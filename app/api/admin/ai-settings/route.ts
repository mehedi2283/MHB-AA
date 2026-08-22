import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isUnauthorizedError, requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { encryptSecret } from "@/lib/crypto";
import { logActivity } from "@/lib/supabase-data";

const schema = z.object({
  activeProvider: z.enum(["openai", "anthropic", "gemini"]),
  model: z.string().min(2).max(100),
  apiKey: z.string().max(500).optional(),
  systemPrompt: z.string().min(20).max(10000),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().int().min(50).max(8000),
  monthlyLimit: z.number().int().min(0).optional(),
  leadQualification: z.boolean(),
  bookingEnabled: z.boolean(),
  fallbackEnabled: z.boolean(),
});

const defaults = {
  activeProvider: "gemini",
  model: "gemini-2.5-flash",
  systemPrompt:
    "You are the concise and professional guide for Mehedi’s personal portfolio. Never invent results or guarantees.",
  temperature: 0.3,
  maxTokens: 500,
  monthlyLimit: 0,
  leadQualification: true,
  bookingEnabled: true,
  fallbackEnabled: true,
};

export async function GET() {
  try {
    await requireAdmin();
    const db = supabaseAdmin();
    const result = await db.from("app_settings").select("data").eq("key", "ai:main").maybeSingle();
    const data = result.data?.data || {};

    const activeProvider = data.activeProvider || defaults.activeProvider;
    const providerKey = `provider:${activeProvider}`;
    const providerRes = await db.from("app_settings").select("data").eq("key", providerKey).maybeSingle();
    const hasApiKey = Boolean(providerRes.data?.data?.encryptedApiKey);

    return NextResponse.json({
      ...defaults,
      ...data,
      hasApiKey,
      fallbackEnabled: (data.fallbackProviders?.length || 0) > 0,
    });
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Supabase credentials and schema are required" }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const data = schema.parse(await req.json());
    const db = supabaseAdmin();

    const fallbackMap = {
      openai: ["anthropic", "gemini"],
      anthropic: ["openai", "gemini"],
      gemini: ["openai", "anthropic"],
    };

    const settings = {
      activeProvider: data.activeProvider,
      model: data.model.trim(),
      systemPrompt: data.systemPrompt.trim(),
      temperature: data.temperature,
      maxTokens: data.maxTokens,
      monthlyLimit: data.monthlyLimit || 0,
      leadQualification: data.leadQualification,
      bookingEnabled: data.bookingEnabled,
      fallbackProviders: data.fallbackEnabled ? fallbackMap[data.activeProvider] : [],
    };

    const saved = await db.from("app_settings").upsert({
      key: "ai:main",
      data: settings,
      updated_at: new Date().toISOString(),
    });
    if (saved.error) throw saved.error;

    const providerKey = `provider:${data.activeProvider}`;
    const existing = await db.from("app_settings").select("data").eq("key", providerKey).maybeSingle();
    const providerData: Record<string, unknown> = {
      ...(existing.data?.data || {}),
      provider: data.activeProvider,
      model: data.model.trim(),
      enabled: true,
    };

    if (data.apiKey?.trim()) {
      providerData.encryptedApiKey = encryptSecret(data.apiKey.trim());
    }

    const providerSaved = await db.from("app_settings").upsert({
      key: providerKey,
      data: providerData,
      updated_at: new Date().toISOString(),
    });
    if (providerSaved.error) throw providerSaved.error;

    await logActivity(session.sub!, "update_ai_settings", "aiSettings", "main");
    return NextResponse.json({ ok: true, hasApiKey: Boolean(providerData.encryptedApiKey) });
  } catch (e) {
    if (isUnauthorizedError(e)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Check the provider configuration fields" }, { status: 400 });
    return NextResponse.json({ error: "Unable to save Supabase configuration" }, { status: 503 });
  }
}
