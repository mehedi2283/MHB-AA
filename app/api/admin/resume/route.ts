import { NextRequest, NextResponse } from "next/server";
import { isUnauthorizedError, requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { logActivity } from "@/lib/supabase-data";

export async function GET() {
  try {
    await requireAdmin();
    const supabase = supabaseAdmin();

    const res = await supabase
      .from("app_settings")
      .select("data")
      .eq("key", "site:resume")
      .maybeSingle();

    const meta = res.data?.data;
    const exists = Boolean(meta && (meta.base64Data || meta.publicUrl));

    return NextResponse.json({
      exists,
      filename: meta?.filename || (exists ? "Mehedi_Hasan_Resume.pdf" : null),
      size: meta?.size || 0,
      updatedAt: meta?.uploadedAt || null,
      url: exists ? "/api/resume/download" : null,
      downloadUrl: exists ? "/api/resume/download" : null,
    });
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("Resume status fetch error:", error);
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
    const fileName = file.name || "Mehedi_Hasan_Resume.pdf";
    if (!fileName.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported for resume/CV." }, { status: 400 });
    }

    // Maximum 15MB limit
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 15MB limit." }, { status: 400 });
    }

    const supabase = supabaseAdmin();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString("base64");

    // Try uploading to Supabase Storage if available
    let publicUrl = "";
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const targetBucket = buckets?.find((b) => b.name === "portfolio-assets" || b.name === "client-screenshots")?.name;

      if (targetBucket) {
        const filePath = `resumes/${Date.now()}_Mehedi_Hasan_Resume.pdf`;
        const { error: uploadErr } = await supabase.storage
          .from(targetBucket)
          .upload(filePath, buffer, {
            contentType: "application/pdf",
            upsert: true,
          });

        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from(targetBucket).getPublicUrl(filePath);
          publicUrl = urlData.publicUrl;
        }
      }
    } catch (storageErr) {
      console.warn("Supabase storage upload fallback to db:", storageErr);
    }

    // Resiliently store in Supabase app_settings table
    const meta = {
      filename: fileName,
      size: file.size,
      mimeType: file.type || "application/pdf",
      uploadedAt: new Date().toISOString(),
      uploadedBy: session.sub,
      publicUrl: publicUrl || null,
      base64Data, // Guarantees 100% download reliability in Vercel Serverless
    };

    const { error: dbError } = await supabase
      .from("app_settings")
      .upsert({
        key: "site:resume",
        data: meta,
        updated_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error("Supabase app_settings upsert error:", dbError);
      throw new Error(dbError.message || "Failed to save resume in Supabase database.");
    }

    await logActivity(session.sub!, "upload", "resume", "site:resume");

    return NextResponse.json({
      ok: true,
      message: "Resume uploaded successfully to Supabase!",
      resume: {
        filename: meta.filename,
        size: meta.size,
        uploadedAt: meta.uploadedAt,
      },
    });
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("Resume upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload resume to Supabase." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await requireAdmin();
    const supabase = supabaseAdmin();

    await supabase
      .from("app_settings")
      .delete()
      .eq("key", "site:resume");

    await logActivity(session.sub!, "delete", "resume", "site:resume");

    return NextResponse.json({ ok: true, message: "Resume removed." });
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed to delete resume." }, { status: 500 });
  }
}
