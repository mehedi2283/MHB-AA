import { NextRequest, NextResponse } from "next/server";
import { isUnauthorizedError, requireAdmin } from "@/lib/auth";
import { createDocument, listDocuments, logActivity } from "@/lib/supabase-data";
import { supabaseAdmin } from "@/lib/supabase";

function normalizeEmails(email: unknown, emails: unknown) {
  return Array.from(new Set([...(typeof email === "string" ? [email] : []), ...(Array.isArray(emails) ? emails : [])]
    .filter((value): value is string => typeof value === "string")
    .map(value => value.trim().toLowerCase())
    .filter(Boolean)));
}

export async function GET() {
  try {
    await requireAdmin();
    const clients = await listDocuments("clients");
    const loadedAt = new Date().toISOString();
    const { error: heartbeatError } = await supabaseAdmin().from("app_settings").upsert({
      key: "crm_last_loaded_at",
      data: { loadedAt },
      updated_at: loadedAt,
    });
    if (heartbeatError) throw heartbeatError;
    return NextResponse.json(clients);
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed to fetch clients from Supabase" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const body = await req.json();
    delete body._id;
    const emails = normalizeEmails(body.email, body.emails);
    if (emails.length === 0) return NextResponse.json({ error: "At least one valid email address is required." }, { status: 400 });

    const doc = await createDocument("clients", {
      ...body,
      email: emails[0],
      emails: emails.slice(1),
      status: "published",
      visible: true,
      stage: body.stage || "lead",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (session.sub) {
      await logActivity(session.sub, "create", "clients", String(doc._id));
    }

    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Unable to create client in Supabase" }, { status: 400 });
  }
}
