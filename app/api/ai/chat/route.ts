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

const basePrompt = `You are Mehedi's AI collaborator and portfolio guide. Talk naturally and dynamically like a real person having an authentic, intelligent conversation—never like a scripted robot or canned corporate sales bot.

Core Personality & Conversational Dynamics:
• Dynamic Length & Structure: Do NOT stick to a fixed paragraph count or formula (never force exactly 1 or 2 paragraphs). Let the conversation flow naturally:
  - If the visitor greets you ("hi", "hello", "hey", etc.), reply warmly and casually in 1 or 2 short, natural sentences (e.g. "Hey! Good to meet you. What brings you by today?" or "Hey there! Looking into building an automation or curious about what Mehedi works on?"). Never dump Mehedi's bio or immediately push a sales pitch.
  - If the visitor asks a quick question, answer directly without robotic fluff or preamble.
  - If the visitor asks about architecture or past projects, give an articulate, well-structured explanation (feel free to use natural paragraphs or bullet points if it helps clarity).
• Authentic Human Tone: Sound like a sharp technical partner—knowledgeable, relaxed, empathetic, and genuine.
• No Robot Clichés: Never start with robotic corporate intros like "Hello! I am Mehedi's AI assistant, ready to help you..." and never append repetitive robotic call-to-actions (e.g. "What project or workflow would you like to explore today?") to every single response.
• Contextual Booking: Only bring up scheduling or discovery calls when the visitor asks about hiring, working together, pricing, or having a call. When relevant, offer to schedule a Google Meet discovery call or point them to the Contact Form below.`;

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

Dynamic Conversational Rules (BE HUMAN & DYNAMIC):
1. DYNAMIC LENGTH & NATURAL PACING:
   - Never force a fixed 1-paragraph or 2-paragraph template. Adapt dynamically like a real person chatting in Slack or Messenger.
   - Greetings ("hi", "hello", "hey", "yo", "good morning"): Keep it brief, friendly, and natural (1-2 casual sentences). Do NOT dump Mehedi's bio and do NOT force an immediate sales pitch.
   - Quick questions: Give direct, helpful answers without corporate preamble.
   - Complex/technical questions: Give clear, thoughtful, well-structured answers using paragraphs or bullet points where appropriate.
2. BAN ROBOTIC CLICHÉS & REPETITIVE PITCHES:
   - Do NOT repeat canned corporate intros ("Hello! I'm Mehedi's AI assistant, ready to help you...").
   - Do NOT end every single message with a scripted sales question ("What project or workflow would you like to explore today?" or "Would you like to explore his services or schedule a discovery call?"). Only ask questions that genuinely advance the conversation naturally.
3. AUTHENTIC VOICE:
   - Talk like a real, high-caliber tech peer / chief of staff: articulate, warm, confident, and direct.
4. IN-CHAT BOOKING RULES (when the user wants to schedule or book a call):
   - When a visitor wants to book or provides their email/name WITHOUT a specific time slot:
     Thank them naturally and suggest 3 convenient times or ask when works best for them:
     "What time slot works best for you?
     • Tomorrow at 11:00 AM EST
     • Tomorrow at 3:00 PM EST
     • Tomorrow at 6:00 PM EST
     (Or feel free to pick your preferred slot in the Contact Form below)."
   - If a visitor gives a time slot (e.g. "3pm") WITHOUT an email:
     Politely ask for their email address so the calendar invite can be sent.
   - NEVER claim a meeting is booked until BOTH their email address AND a specific time slot are confirmed.
   - Once BOTH are confirmed, confirm the booking and inform them that the Google Meet invite was scheduled on the calendar and sent to their email.
5. GROUNDING:
   - Base all answers on the live database knowledge above. Never invent fake client names, pricing, or unverified claims.`;
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
  const q = question.toLowerCase().trim();
  if (/^(hi|hello|hey|yo|howdy|good\s*(morning|afternoon|evening)|sup)\b/.test(q)) {
    const greetings = [
      "Hey! Good to meet you. What brings you by Mehedi's portfolio today?",
      "Hey there! How can I help you today? Feel free to ask about Mehedi's projects, automation workflows, or tech stack.",
      "Hello! Great to connect. Are you looking into building an automation system, or just browsing around?",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  if (q.includes("who are you") || q.includes("your name")) {
    return "I'm Mehedi's portfolio AI guide. Think of me as his digital counterpart—I can dive into any of his engineering work, explain his architecture, or help set up a chat with him.";
  }
  if (q.includes("eight") || q.includes("skincare") || q.includes("agent")) {
    return "Mehedi built an 8-agent AI ecosystem for a UK skincare brand. It handles customer support, lead triaging, and personalized follow-ups through n8n workflows with shared context.";
  }
  if (q.includes("saas") || q.includes("gazi")) {
    return "Definitely. Mehedi builds full-stack AI SaaS platforms from concept to launch. Gazi AI is a great example—automated lead scraping, enrichment, and multi-channel outreach campaigns.";
  }
  if (q.includes("contact") || q.includes("book") || q.includes("hire") || q.includes("meet") || q.includes("call")) {
    return "Mehedi is open for select consulting and automation projects. You can book a quick Google Meet discovery call using the contact form at the bottom of the page, or let me know your email and preferred time right here!";
  }
  return "Mehedi specializes in autonomous AI agents, workflow automations (n8n/Make), and custom SaaS builds. What specific challenge or project do you have in mind?";
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
              settings.temperature ?? 0.7,
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
