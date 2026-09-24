import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const HEARTBEAT_KEY = "supabase_heartbeat";
const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET;
  const authorization = req.headers.get("authorization");
  if (!expectedSecret || authorization !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = supabaseAdmin();
    const { data: current, error: readError } = await db
      .from("app_settings")
      .select("data, updated_at")
      .eq("key", "crm_last_loaded_at")
      .maybeSingle();
    if (readError) throw readError;

    const lastLoadedAt = typeof current?.data?.loadedAt === "string"
      ? new Date(current.data.loadedAt).getTime()
      : 0;
    const now = Date.now();
    if (lastLoadedAt && now - lastLoadedAt < DAY_MS) {
      return NextResponse.json({ ok: true, skipped: true, lastLoadedAt: current?.data?.loadedAt });
    }

    const heartbeatAt = new Date(now).toISOString();
    const { error: heartbeatError } = await db.from("app_settings").upsert({
      key: HEARTBEAT_KEY,
      data: { heartbeatAt, reason: "24-hour CRM keep-alive" },
      updated_at: heartbeatAt,
    });
    if (heartbeatError) throw heartbeatError;

    return NextResponse.json({ ok: true, skipped: false, heartbeatAt });
  } catch (error) {
    console.error("Supabase heartbeat failed:", error);
    return NextResponse.json({ error: "Database heartbeat failed" }, { status: 500 });
  }
}
