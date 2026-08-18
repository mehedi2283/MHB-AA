import { NextRequest, NextResponse } from "next/server";
import { isUnauthorizedError, requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { defaultSiteContent, getSiteContent } from "@/lib/site-content";
import { logActivity } from "@/lib/supabase-data";

export async function GET() { try { await requireAdmin(); return NextResponse.json(await getSiteContent()); } catch(error) { if(isUnauthorizedError(error))return NextResponse.json({error:"Unauthorized"},{status:401});return NextResponse.json({ error: "Supabase credentials and schema are required", defaults: defaultSiteContent }, { status: 503 }); } }
export async function PUT(req: NextRequest) { try { const session = await requireAdmin(), content = await req.json(); const { error } = await supabaseAdmin().from("site_content").upsert({ id: "main", content, updated_by: session.sub, updated_at: new Date().toISOString() }); if (error) throw error; await logActivity(session.sub!, "update", "siteContent", "main"); return NextResponse.json({ ok: true }); } catch(error) { if(isUnauthorizedError(error))return NextResponse.json({error:"Unauthorized"},{status:401});return NextResponse.json({ error: "Unable to save. Add the Supabase variables and run the schema first." }, { status: 503 }); } }
