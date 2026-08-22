import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { decryptSecret } from "@/lib/crypto";
import { rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
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

function sanitizeMessagesForProvider(messages: { role: string; content: string }[]) {
  // Providers (Gemini, Anthropic) require the first message to be from 'user'
  const firstUserIdx = messages.findIndex((m) => m.role === "user");
  const filtered = firstUserIdx >= 0 ? messages.slice(firstUserIdx) : messages;
  return filtered.filter((m) => m.content && m.content.trim().length > 0);
}

async function callProvider(
  provider: string,
  key: string,
  model: string,
  prompt: string,
  rawMessages: { role: string; content: string }[],
  temperature: number,
  maxTokens: number
): Promise<string> {
  const messages = sanitizeMessagesForProvider(rawMessages);
  if (messages.length === 0) {
    throw new Error("No user messages to process");
  }

  // 1. Google Gemini API
  if (provider === "gemini") {
    const cleanModel = model.replace(/^models\//, "");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${cleanModel}:generateContent?key=${key}`;

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
    const { messages } = bodySchema.parse(await req.json());
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

      for (const provider of order) {
        const c = configs.find((item) => item?.provider === provider);
        if (!c?.encryptedApiKey || !c.enabled) continue;

        try {
          const apiKey = decryptSecret(c.encryptedApiKey);
          if (!apiKey) continue;

          const modelToUse = c.model || settings.model || (provider === "gemini" ? "gemini-2.5-flash" : "gpt-4o-mini");
          const prompt = `${settings.systemPrompt || basePrompt}\n\nThis is Mehedi’s personal portfolio. Refer to its public identity as Mehedi / AI.`;

          message = await callProvider(
            provider,
            apiKey,
            modelToUse,
            prompt,
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

      // Log conversation to CMS documents
      await db.from("cms_documents").insert({
        collection: "aiConversations",
        data: {
          sessionId: crypto.randomUUID(),
          messages: [...messages, { role: "assistant", content: message }],
          provider: usedProvider,
          model: usedModel,
        },
        status: "complete",
        visible: false,
      });
    } catch (dbErr) {
      console.error("AI execution error:", dbErr);
      const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
      message = localReply(lastUserMsg);
    }

    return NextResponse.json({ message, provider: usedProvider, model: usedModel });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Invalid chat request format.", details: err instanceof Error ? err.message : String(err) }, { status: 400 });
  }
}
