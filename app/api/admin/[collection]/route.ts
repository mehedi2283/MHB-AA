import { NextRequest, NextResponse } from "next/server";
import { isUnauthorizedError, requireAdmin } from "@/lib/auth";
import { createDocument, deleteDocuments, isEditableCollection, listDocuments, logActivity } from "@/lib/supabase-data";
type Params = { params: Promise<{ collection: string }> };
export async function GET(_: NextRequest, { params }: Params) { try { await requireAdmin(); const { collection } = await params; if (!isEditableCollection(collection)) return NextResponse.json({ error: "Not found" }, { status: 404 }); return NextResponse.json(await listDocuments(collection)); } catch(error) { if(isUnauthorizedError(error))return NextResponse.json({error:"Unauthorized"},{status:401});return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 }); } }
export async function POST(req: NextRequest, { params }: Params) { try { const session = await requireAdmin(); const { collection } = await params; if (!isEditableCollection(collection)) return NextResponse.json({ error: "Not found" }, { status: 404 }); const body = await req.json(); delete body._id; const doc = await createDocument(collection, body); await logActivity(session.sub!, "create", collection, String(doc._id)); return NextResponse.json(doc, { status: 201 }); } catch(error) { if(isUnauthorizedError(error))return NextResponse.json({error:"Unauthorized"},{status:401});return NextResponse.json({ error: "Unable to create Supabase document" }, { status: 400 }); } }
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await requireAdmin();
    const { collection } = await params;
    if (!isEditableCollection(collection)) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const body = await req.json();
    const ids: string[] = Array.isArray(body?.ids) ? body.ids.filter((id: unknown): id is string => typeof id === "string" && id.length > 0) : [];
    if (ids.length === 0) return NextResponse.json({ error: "No document IDs provided" }, { status: 400 });
    await deleteDocuments(collection, ids);
    await logActivity(session.sub!, "batch_delete", collection, ids.slice(0, 5).join(",") + (ids.length > 5 ? ` (+${ids.length - 5} more)` : ""));
    return NextResponse.json({ ok: true, deletedCount: ids.length });
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Unable to batch delete Supabase documents" }, { status: 400 });
  }
}
