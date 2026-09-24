import { NextRequest, NextResponse } from "next/server";
import { isUnauthorizedError, requireAdmin } from "@/lib/auth";
import { deleteDocument, logActivity, updateDocument } from "@/lib/supabase-data";

type Params = { params: Promise<{ id: string }> };

function normalizeEmails(email: unknown, emails: unknown) {
  return Array.from(new Set([...(typeof email === "string" ? [email] : []), ...(Array.isArray(emails) ? emails : [])]
    .filter((value): value is string => typeof value === "string")
    .map(value => value.trim().toLowerCase())
    .filter(Boolean)));
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    delete body._id;
    const emails = normalizeEmails(body.email, body.emails);
    if (emails.length === 0) return NextResponse.json({ error: "At least one valid email address is required." }, { status: 400 });

    const doc = await updateDocument("clients", id, {
      ...body,
      email: emails[0],
      emails: emails.slice(1),
      status: "published",
      visible: true,
      updatedAt: new Date().toISOString(),
    });

    if (session.sub) {
      await logActivity(session.sub, "update", "clients", id);
    }

    return NextResponse.json(doc);
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Unable to update client in Supabase" }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    await deleteDocument("clients", id);

    if (session.sub) {
      await logActivity(session.sub, "delete", "clients", id);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Unable to delete client from Supabase" }, { status: 400 });
  }
}
