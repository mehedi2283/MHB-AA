import { NextRequest, NextResponse } from "next/server";
import { isUnauthorizedError, requireAdmin } from "@/lib/auth";
import { deleteDocument, logActivity, updateDocument } from "@/lib/supabase-data";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    delete body._id;

    const doc = await updateDocument("clients", id, {
      ...body,
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
