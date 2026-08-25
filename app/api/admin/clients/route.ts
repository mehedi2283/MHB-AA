import { NextRequest, NextResponse } from "next/server";
import { isUnauthorizedError, requireAdmin } from "@/lib/auth";
import { createDocument, listDocuments, logActivity } from "@/lib/supabase-data";

export async function GET() {
  try {
    await requireAdmin();
    const clients = await listDocuments("clients");
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

    const doc = await createDocument("clients", {
      ...body,
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
