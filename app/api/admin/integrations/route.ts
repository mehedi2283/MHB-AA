import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isUnauthorizedError, requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { decryptSecret, encryptSecret } from "@/lib/crypto";
import { logActivity } from "@/lib/supabase-data";

const schema = z.object({
  googleCalendarUrl: z.string().url().or(z.literal("")).optional(),
  googleMeetUrl: z.string().url().or(z.literal("")).optional(),
  notificationEmail: z.string().email().or(z.literal("")).optional(),
  autoShareCalendarInChat: z.boolean().default(true),
  sendEmailNotification: z.boolean().default(true),
  smtpEmail: z.string().email().or(z.literal("")).optional(),
  smtpPassword: z.string().max(200).optional(),
  webhookUrl: z.string().url().or(z.literal("")).optional(),
});

const defaultSettings = {
  googleCalendarUrl: "",
  googleMeetUrl: "",
  notificationEmail: "",
  autoShareCalendarInChat: true,
  sendEmailNotification: true,
  smtpEmail: "",
  webhookUrl: "",
};

export async function GET() {
  try {
    await requireAdmin();
    const db = supabaseAdmin();
    const result = await db.from("app_settings").select("data").eq("key", "integrations:google").maybeSingle();
    const data = result.data?.data || {};

    const hasSmtpPassword = Boolean(data.encryptedSmtpPassword);

    return NextResponse.json({
      ...defaultSettings,
      ...data,
      hasSmtpPassword,
    });
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Supabase connection error" }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = schema.parse(await req.json());
    const db = supabaseAdmin();

    const existing = await db.from("app_settings").select("data").eq("key", "integrations:google").maybeSingle();
    const prevData = existing.data?.data || {};

    let encryptedSmtpPassword = prevData.encryptedSmtpPassword || null;
    if (body.smtpPassword && body.smtpPassword.trim().length > 0) {
      encryptedSmtpPassword = encryptSecret(body.smtpPassword.trim());
    }

    const payload = {
      googleCalendarUrl: body.googleCalendarUrl || "",
      googleMeetUrl: body.googleMeetUrl || "",
      notificationEmail: body.notificationEmail || "",
      autoShareCalendarInChat: body.autoShareCalendarInChat,
      sendEmailNotification: body.sendEmailNotification,
      smtpEmail: body.smtpEmail || "",
      encryptedSmtpPassword,
      webhookUrl: body.webhookUrl || "",
      updatedAt: new Date().toISOString(),
    };

    const { error } = await db.from("app_settings").upsert(
      {
        key: "integrations:google",
        data: payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );

    if (error) throw error;

    await logActivity(session.sub!, "update", "settings", "integrations:google");

    return NextResponse.json({ ok: true, hasSmtpPassword: Boolean(encryptedSmtpPassword) });
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid URL or email format.", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to save integration settings." }, { status: 500 });
  }
}
