import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { decryptSecret } from "@/lib/crypto";
import { rateLimit } from "@/lib/rate-limit";
import { getSiteContent, getPublicCollections } from "@/lib/site-content";

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
  "You are the concise, professional guide for Mehedi's personal portfolio. Describe Mehedi as an independent AI & Automation Specialist with 2+ years of hands-on experience and 1+ year of client delivery. Explain his AI agents, workflow automation, CRM/outreach systems and SaaS MVP capabilities. Known work: 13+ workflow gaming venue member lifecycle; Gazi AI outreach SaaS; eight-agent UK skincare ecosystem. Never present him as an agency or team. Never invent results, testimonials, prices or guarantees. Ask one useful discovery question at a time. Suggest the contact form for project, contract or employment opportunities.";

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
• Booking Instructions: Visitors can select their preferred date and time slot in the Contact Form at the bottom of the page, or tell you their preferred day/time and email in chat.
• Timezones: Accommodates US (EST/PST), UK/Europe (GMT/CET), Middle East (GST), and APAC.

Instructions:
1. Ground all answers in the live database knowledge above.
2. Maintain a confident, concise, and professional tone.
3. If the user asks about booking a call, meeting, or scheduling time to chat, explain that Mehedi hosts discovery calls on Google Meet and guide them to select their preferred date and time slot in the Contact Form below.
4. Never invent unverified results, fake pricing, or agency team members.`;
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
