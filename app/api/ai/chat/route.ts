import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { decryptSecret } from "@/lib/crypto";
import { rateLimit } from "@/lib/rate-limit";
import { getSiteContent, getPublicCollections } from "@/lib/site-content";
import { getConnectedGoogleAccount, createGoogleCalendarEvent, sendGmailMessage } from "@/lib/google-integration";
import { buildClientConfirmationHtml, buildAdminNotificationHtml } from "@/lib/email-templates";
import { createDocument, listDocuments } from "@/lib/supabase-data";

const bodySchema = z.object({
  sessionId: z.string().optional(),
  userLabel: z.string().optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(3000),
      })
    )
    .min(1)
    .max(50),
});

const basePrompt =
  "You are Mehedi's friendly AI assistant. Keep responses short, simple, and always format in 2 to 3 short paragraphs separated by a blank line. Explain his AI agents, workflow automation (n8n/Make), and SaaS systems simply. If the visitor greets you, reply warmly in 1 sentence, leave a blank line, and ask what they'd like to automate. If they want to work together or book a call, suggest picking a time in the Contact Form below.";

async function buildDynamicKnowledgePrompt(customSystemPrompt?: string): Promise<string> {
  try {
    const [content, collections] = await Promise.all([getSiteContent(), getPublicCollections()]);

    const projectKnowledge = collections.projects
      .map(
        (p) =>
          `• Project: ${p.title} (Client: ${p.client || "Client System"})\n  Summary: ${p.summary || ""}\n  Tech Stack/Tags: ${
            p.tags?.join(", ") || ""
          }${p.solution ? `\n  Solution: ${p.solution}` : ""}`
      )
      .join("\n\n");

    const servicesKnowledge = collections.services
      .map((s) => `• Service: ${s.title}\n  Details: ${s.description}\n  Deliverables/Tools: ${s.tools?.join(", ") || ""}`)
      .join("\n");

    const metricsKnowledge = content.metrics
      ?.map((m) => `${m.value} ${m.label}`)
      .join(" | ");

    const workflowKnowledge = content.workflowNodes
      ?.map((n) => `Step ${n.name}: ${n.desc} (Tools: ${n.tools} -> Benefit: ${n.benefit})`)
      .join("\n");

    let calendarSnippet = "";
    try {
      const googleRes = await supabaseAdmin().from("app_settings").select("data").eq("key", "integrations:google").maybeSingle();
      const googleData = googleRes.data?.data || {};
      if (googleData.googleCalendarUrl && googleData.autoShareCalendarInChat !== false) {
        calendarSnippet = `\n• Direct Google Calendar Booking Link: ${googleData.googleCalendarUrl}\n(You may provide this direct Google Calendar link whenever the user asks for a booking link or wants to schedule a discovery call!)`;
      }
      if (googleData.googleMeetUrl) {
        calendarSnippet += `\n• Direct Google Meet Room: ${googleData.googleMeetUrl}`;
      }
    } catch {}

    return `${customSystemPrompt || basePrompt}

=== LIVE DATABASE KNOWLEDGE & PORTFOLIO TRUTH ===
Name: Mehedi (Independent AI & Automation Specialist)
Bio Intro: ${content.about?.intro || ""}
Experience: ${content.about?.profileBody || ""}
Key Metrics: ${metricsKnowledge || "50+ workflows engineered | 20+ projects delivered | 15+ platforms connected"}

Client Projects in Database:
${projectKnowledge}

Services & Capabilities in Database:
${servicesKnowledge}

6-Step Automation Workflow in Database:
${workflowKnowledge}

Meeting & Discovery Call Scheduling:
• Online Platform: Google Meet & Google Calendar
• Availability: 1-on-1 discovery calls for system architecture, automation audits, and SaaS builds.
• Booking Instructions: Visitors can select their preferred date and time slot in the Contact Form at the bottom of the page, or tell you their preferred day/time and email in chat.${calendarSnippet}
• Timezones: Accommodates US (EST/PST), UK/Europe (GMT/CET), Middle East (GST), and APAC.

Formatting & Tone Rules:
1. Always format responses in 2 to 3 short, clean paragraphs with a blank line between them. Never output a single dense wall of text.
2. Keep responses simple, natural, and concise (under 50 words whenever possible). Avoid long robotic introductions.
3. For simple greetings (like "hi" or "hello"), respond with a warm 1-sentence welcome, followed by a blank line and a simple question about what project or workflow they want to automate.
4. CRITICAL BOOKING RULES (STEP-BY-STEP):
   - When a visitor wants to book or gives their email/name WITHOUT a time slot:
     Thank them by name and proactively offer 3 clear time slots:
     "Thanks [Name]! What time slot works best for you?
     • Tomorrow at 11:00 AM EST
     • Tomorrow at 3:00 PM EST
     • Tomorrow at 6:00 PM EST
     (Or choose your exact slot in the Contact Form below)."
   - If a visitor gives a time slot (e.g. "3pm") WITHOUT an email:
     Ask for their email address and name to send the calendar invite.
   - NEVER claim a meeting is booked until BOTH their email address AND a specific time slot are confirmed by the user.
   - Once BOTH are provided, confirm the booking and inform them that the Google Meet invite was scheduled on the calendar and sent to their email.
5. Ground all answers in the live database knowledge above.
6. Never invent unverified results, fake pricing, or agency team members.`;
  } catch (err) {
    console.error("Failed to build dynamic database prompt, using fallback:", err);
    return `${customSystemPrompt || basePrompt}\n\nThis is Mehedi’s personal portfolio. Refer to its public identity as Mehedi / AI.`;
  }
}

function sanitizeMessagesForProvider(messages: { role: string; content: string }[]) {
  // Providers (Gemini, Anthropic) require the first message in the conversation history to be from 'user'
  const firstUserIdx = messages.findIndex((m) => m.role === "user");
  const filtered = firstUserIdx >= 0 ? messages.slice(firstUserIdx) : messages;
  return filtered.filter((m) => m.content && m.content.trim().length > 0);
}

function normalizeModel(provider: string, model: string): string {
  const clean = model.replace(/^models\//, "");
  if (provider === "gemini") {
    if (clean === "gemini-2.5-flash-lite") return "gemini-3.5-flash-lite";
    if (clean === "gemini-2.0-flash" || clean === "gemini-1.5-flash") return "gemini-2.5-flash";
    if (clean === "gemini-1.5-pro") return "gemini-2.5-pro";
  }
  if (provider === "openai") {
    if (clean === "gpt-4.1-mini") return "gpt-4o-mini";
  }
  return clean;
}

async function callProvider(
  provider: string,
  key: string,
  rawModel: string,
  prompt: string,
  rawMessages: { role: string; content: string }[],
  temperature: number,
  maxTokens: number
): Promise<string> {
  const messages = sanitizeMessagesForProvider(rawMessages);
  if (messages.length === 0) {
    throw new Error("No user messages to process");
  }

  const model = normalizeModel(provider, rawModel);

  // 1. Google Gemini API
  if (provider === "gemini") {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

    const payload = {
      system_instruction: { parts: [{ text: prompt }] },
      contents: messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        temperature: Math.max(0, Math.min(2, temperature)),
        maxOutputTokens: maxTokens || 500,
      },
    };

    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const errText = await r.text();
      throw new Error(`Gemini API error (${r.status}): ${errText}`);
    }

    const d = await r.json();
    const reply = d.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error("Empty response from Gemini");
    return reply;
  }

  // 2. Anthropic Claude API
  if (provider === "anthropic") {
    const payload = {
      model,
      max_tokens: maxTokens || 500,
      temperature: Math.max(0, Math.min(1, temperature)),
      system: prompt,
      messages: messages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    };

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const errText = await r.text();
      throw new Error(`Anthropic API error (${r.status}): ${errText}`);
    }

    const d = await r.json();
    const reply = d.content?.[0]?.text;
    if (!reply) throw new Error("Empty response from Anthropic");
    return reply;
  }

  // 3. OpenAI API
  const isOpenAIReasoning = model.startsWith("o1") || model.startsWith("o3");
  const payload: Record<string, unknown> = {
    model,
    messages: [{ role: "system", content: prompt }, ...messages],
  };

  if (isOpenAIReasoning) {
    payload.max_completion_tokens = maxTokens || 500;
  } else {
    payload.temperature = temperature;
    payload.max_tokens = maxTokens || 500;
  }

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    const errText = await r.text();
    throw new Error(`OpenAI API error (${r.status}): ${errText}`);
  }

  const d = await r.json();
  const reply = d.choices?.[0]?.message?.content;
  if (!reply) throw new Error("Empty response from OpenAI");
  return reply;
}

function localReply(question: string) {
  const q = question.toLowerCase();
  if (q.includes("who are you") || q.includes("your name")) {
    return "I’m the AI guide for Mehedi’s personal portfolio. I can explain his experience, projects, and technical skills, or help you connect with him.";
  }
  if (q.includes("eight") || q.includes("skincare") || q.includes("agent")) {
    return "Mehedi architected the UK skincare ecosystem using eight specialized AI agents with shared business context, centralized data, and automated n8n workflows.";
  }
  if (q.includes("saas")) {
    return "Yes! Mehedi builds client-facing AI SaaS platforms from concept to launch. Gazi AI is a flagship example: automated lead scraping, email enrichment, and multi-channel campaigns.";
  }
  return "Mehedi designs autonomous AI agents, n8n/Make automation workflows, CRM integrations, and full-stack SaaS apps. What would you like to know about his past projects or availability?";
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "local";
  if (!rateLimit(`ai:${ip}`, 30, 60000)) {
    return NextResponse.json({ error: "Rate limit reached. Please wait a moment." }, { status: 429 });
  }

  try {
      const parsedBody = bodySchema.parse(await req.json());
      const messages = parsedBody.messages;
      const userSessionId = parsedBody.sessionId || `visitor_${crypto.randomUUID().slice(0, 8)}`;
      let message = "";
      let usedProvider = "local";
      let usedModel = "knowledge-fallback";

      try {
        const db = supabaseAdmin();
        const settingsResult = await db.from("app_settings").select("data").eq("key", "ai:main").maybeSingle();
        const settings = settingsResult.data?.data || {};

        const activeProvider = settings.activeProvider || "gemini";
        const fallbackList = settings.fallbackProviders || [];
        const order = [activeProvider, ...fallbackList.filter((p: string) => p !== activeProvider)];

        const configRows = await db
          .from("app_settings")
          .select("key, data")
          .in("key", order.map((p) => `provider:${p}`));

        const configs = (configRows.data || []).map((row) => row.data);

        // Build live dynamic knowledge prompt from Supabase database tables
        const fullKnowledgePrompt = await buildDynamicKnowledgePrompt(settings.systemPrompt);

        for (const provider of order) {
          const c = configs.find((item) => item?.provider === provider);
          if (!c?.encryptedApiKey || !c.enabled) continue;

          try {
            const apiKey = decryptSecret(c.encryptedApiKey);
            if (!apiKey) continue;

            const modelToUse = c.model || settings.model || (provider === "gemini" ? "gemini-2.5-flash" : "gpt-4o-mini");

            message = await callProvider(
              provider,
              apiKey,
              modelToUse,
              fullKnowledgePrompt,
              messages,
              settings.temperature ?? 0.3,
              settings.maxTokens ?? 500
            );

            usedProvider = provider;
            usedModel = modelToUse;
            break;
          } catch (providerError) {
            console.error(`Provider [${provider}] failed:`, providerError);
            continue;
          }
        }

        if (!message) {
          const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
          message = localReply(lastUserMsg);
        }

        // In-Chat Automatic Google Calendar Booking & Lead Sync
        try {
          const allUserMsgs = messages.filter((m) => m.role === "user").map((m) => m.content);
          const combinedUserText = allUserMsgs.join(" ");
          const emailMatch = combinedUserText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);

          if (emailMatch) {
            const attendeeEmail = emailMatch[1].toLowerCase();
            const textWithoutEmail = combinedUserText.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, " ");

            // Extract Name if user stated it
            let clientName = attendeeEmail.split("@")[0];
            const nameMatch = textWithoutEmail.match(/(?:my name is|i am|i'm|name is|name:)\s+([a-zA-Z\s]{2,30})/i);
            if (nameMatch) {
              clientName = nameMatch[1].trim();
            }

            // ONLY book when user has provided an explicit time slot (e.g. "3pm", "11:00 AM", "at 4", "15:00")
            const timeMatch =
              textWithoutEmail.match(/\b(1[0-2]|0?[1-9])(?::([0-5][0-9]))?\s*(am|pm)\b/i) ||
              textWithoutEmail.match(/\bat\s+(1[0-2]|0?[1-9])(?::([0-5][0-9]))?\b/i) ||
              textWithoutEmail.match(/\b(1[0-9]|2[0-3]|0?[0-9]):([0-5][0-9])\b/);

            // Check if already booked for this session
            const prevInquiries = await listDocuments("inquiries");
            const alreadyBooked = prevInquiries.some(
              (inq) =>
                (inq.email === attendeeEmail || (inq as Record<string, unknown>).sessionId === userSessionId) &&
                (inq as Record<string, unknown>).source === "ai_chat" &&
                (inq as Record<string, unknown>).submissionStatus === "meeting_scheduled"
            );

            if (timeMatch && !alreadyBooked) {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              const datePart = tomorrow.toISOString().split("T")[0];

              let h = parseInt(timeMatch[1], 10);
              const m = timeMatch[2] || "00";
              const p = (timeMatch[3] || "").toLowerCase();
              if (p === "pm" && h !== 12) h += 12;
              if (p === "am" && h === 12) h = 0;
              if (!p && h <= 5) h += 12;
              const timeHour = String(h).padStart(2, "0");
              const timeMin = m;

              const startIso = `${datePart}T${timeHour}:${timeMin}:00`;
              const endHour = String((parseInt(timeHour, 10) + 1) % 24).padStart(2, "0");
              const endIso = `${datePart}T${endHour}:${timeMin}:00`;

              // 1. Create real Google Calendar Event
              const eventResult = await createGoogleCalendarEvent({
                summary: `Discovery Call · Mehedi & ${clientName}`,
                description: `Automated Discovery Call booked via AI Assistant.\nClient Name: ${clientName}\nClient Email: ${attendeeEmail}\nSession ID: ${userSessionId}\n\nChat Conversation:\n${combinedUserText.slice(-600)}`,
                startDateTime: startIso,
                endDateTime: endIso,
                attendeeEmail,
              });

              const meetUrl = eventResult?.meetUrl;

              const emailPayload = {
                clientName,
                clientEmail: attendeeEmail,
                projectType: "AI & Workflow Automation Discovery",
                budget: "Flexible / To Discuss",
                timeline: "Immediate",
                message: combinedUserText.slice(-400),
                meetingDate: datePart,
                meetingTime: `${timeHour}:${timeMin}`,
                meetUrl,
              };

              // 2. Dispatch Confirmation Emails
              await sendGmailMessage({
                to: attendeeEmail,
                subject: `Discovery Call Confirmed · Mehedi & ${clientName}`,
                bodyHtml: buildClientConfirmationHtml(emailPayload),
                bodyText: `Discovery Call Confirmed with Mehedi!\nDate: ${datePart} at ${timeHour}:${timeMin}\nGoogle Meet Link: ${meetUrl || "Will be provided in calendar invite"}\nhttps://mhb-aa.vercel.app`,
              });

              const googleAcc = await getConnectedGoogleAccount();
              if (googleAcc?.email) {
                await sendGmailMessage({
                  to: googleAcc.email,
                  subject: `🚨 In-Chat Discovery Meeting Booked: ${clientName} (${attendeeEmail})`,
                  bodyHtml: buildAdminNotificationHtml(emailPayload),
                  bodyText: `New discovery call scheduled via AI Chat!\nClient: ${clientName} (${attendeeEmail})\nDate: ${datePart} at ${timeHour}:${timeMin}\nGoogle Meet Link: ${meetUrl || "N/A"}\nhttps://mhb-aa.vercel.app/admin/inquiries`,
                });
              }

              // 3. Save Inquiry to Supabase
              await createDocument("inquiries", {
                name: clientName,
                email: attendeeEmail,
                projectType: "AI & Workflow Automation",
                budget: "To Discuss",
                timeline: "Immediate",
                message: `Booked via AI Assistant Chat:\n${combinedUserText.slice(-400)}`,
                meetingRequested: true,
                meetingDate: datePart,
                meetingTime: `${timeHour}:${timeMin}`,
                meetUrl,
                source: "ai_chat",
                sessionId: userSessionId,
                submissionStatus: "meeting_scheduled",
                status: "published",
                visible: true,
              });

              if (meetUrl && !message.includes(meetUrl)) {
                message += `\n\n✓ Discovery call confirmed on Google Calendar for ${datePart} at ${timeHour}:${timeMin}.\n\nGoogle Meet: ${meetUrl}\n\nA confirmation email has also been sent to ${attendeeEmail}!`;
              }
            } else if (!timeMatch && !alreadyBooked) {
              // User shared email but no time slot yet - log lead to CRM
              await createDocument("inquiries", {
                name: clientName,
                email: attendeeEmail,
                projectType: "AI & Workflow Automation Inquiry",
                budget: "To Discuss",
                timeline: "Immediate",
                message: `Lead captured via AI Assistant (Awaiting time selection):\n${combinedUserText.slice(-400)}`,
                meetingRequested: false,
                source: "ai_chat",
                sessionId: userSessionId,
                submissionStatus: "new_lead",
                status: "published",
                visible: true,
              });
            }
          }
        } catch (bookingErr) {
          console.error("In-chat auto booking error:", bookingErr);
        }

        // Log / update conversation in Supabase cms_documents under 'aiConversations' grouped by user sessionId
        const fullConversation = [...messages, { role: "assistant" as const, content: message }];
        const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";

        const { data: existingRows } = await db
          .from("cms_documents")
          .select("id, data")
          .eq("collection", "aiConversations")
          .order("created_at", { ascending: false });

        const matchedDoc = (existingRows || []).find((r) => (r.data as Record<string, unknown>)?.sessionId === userSessionId);

        if (matchedDoc) {
          const prevData = (matchedDoc.data as Record<string, unknown>) || {};
          await db.from("cms_documents").update({
            data: {
              ...prevData,
              sessionId: userSessionId,
              userLabel: prevData.userLabel || `Visitor #${userSessionId.replace(/[^a-zA-Z0-9]/g, "").slice(-6)}`,
              messages: fullConversation,
              turnCount: fullConversation.length,
              lastUserMessage: lastUserMsg,
              lastAssistantMessage: message,
              provider: usedProvider,
              model: usedModel,
              ip: ip !== "local" ? ip : undefined,
              lastActiveAt: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          }).eq("id", matchedDoc.id);
        } else {
          await db.from("cms_documents").insert({
            collection: "aiConversations",
            data: {
              sessionId: userSessionId,
              userLabel: `Visitor #${userSessionId.replace(/[^a-zA-Z0-9]/g, "").slice(-6)}`,
              messages: fullConversation,
              turnCount: fullConversation.length,
              lastUserMessage: lastUserMsg,
              lastAssistantMessage: message,
              provider: usedProvider,
              model: usedModel,
              ip: ip !== "local" ? ip : undefined,
              startedAt: new Date().toISOString(),
              lastActiveAt: new Date().toISOString(),
            },
            status: "complete",
            visible: true,
          });
        }
      } catch (dbErr) {
        console.error("AI execution error:", dbErr);
        const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
        message = localReply(lastUserMsg);
      }

    return NextResponse.json({ message, provider: usedProvider, model: usedModel });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Invalid chat request format.", details: err instanceof Error ? err.message : String(err) },
      { status: 400 }
    );
  }
}
