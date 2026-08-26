import { NextRequest, NextResponse } from "next/server";
import { isUnauthorizedError, requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { logActivity } from "@/lib/supabase-data";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    await requireAdmin();
    const resumePath = path.join(process.cwd(), "public", "resume.pdf");
    const exists = fs.existsSync(resumePath);

    let stats = null;
    if (exists) {
      const fileStat = fs.statSync(resumePath);
      stats = {
        size: fileStat.size,
        updatedAt: fileStat.mtime.toISOString(),
      };
    }

    // Also check Supabase metadata
    let metadata: Record<string, unknown> = {};
    try {
      const res = await supabaseAdmin()
        .from("app_settings")
        .select("data")
        .eq("key", "site:resume")
        .maybeSingle();
      metadata = res.data?.data || {};
    } catch {}

    return NextResponse.json({
      exists,
      filename: (metadata.filename as string) || (exists ? "Mehedi_Hasan_Resume.pdf" : null),
      size: stats?.size || (metadata.size as number) || 0,
      updatedAt: stats?.updatedAt || (metadata.updatedAt as string) || null,
      url: exists ? "/resume.pdf" : null,
      downloadUrl: exists ? "/api/resume/download" : null,
    });
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed to fetch resume status." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // Validate PDF
    const fileName = file.name || "resume.pdf";
    if (!fileName.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported for resume/CV." }, { status: 400 });
    }

    // Maximum 15MB size limit
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 15MB limit." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const filePath = path.join(publicDir, "resume.pdf");
    fs.writeFileSync(filePath, buffer);

    // Save metadata in Supabase app_settings
    const meta = {
      filename: fileName,
      size: file.size,
      mimeType: file.type || "application/pdf",
      uploadedAt: new Date().toISOString(),
      uploadedBy: session.sub,
      url: "/resume.pdf",
    };

    try {
      await supabaseAdmin()
        .from("app_settings")
        .upsert({
          key: "site:resume",
          data: meta,
          updated_at: new Date().toISOString(),
        });
      await logActivity(session.sub!, "upload", "resume", "site:resume");
    } catch {}

    return NextResponse.json({
      ok: true,
      message: "Resume uploaded successfully!",
      resume: meta,
    });
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("Resume upload error:", error);
    return NextResponse.json({ error: "Failed to upload resume." }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await requireAdmin();
    const resumePath = path.join(process.cwd(), "public", "resume.pdf");
    if (fs.existsSync(resumePath)) {
      fs.unlinkSync(resumePath);
    }

    try {
      await supabaseAdmin()
        .from("app_settings")
        .delete()
        .eq("key", "site:resume");
      await logActivity(session.sub!, "delete", "resume", "site:resume");
    } catch {}

    return NextResponse.json({ ok: true, message: "Resume removed." });
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed to delete resume." }, { status: 500 });
  }
}
