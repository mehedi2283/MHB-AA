import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const supabase = supabaseAdmin();

    // 1. Fetch from Supabase app_settings
    let resumeData: { base64Data?: string; filename?: string; publicUrl?: string } | null = null;
    try {
      const res = await supabase
        .from("app_settings")
        .select("data")
        .eq("key", "site:resume")
        .maybeSingle();
      resumeData = res.data?.data;
    } catch (err) {
      console.warn("Supabase resume read error:", err);
    }

    const downloadFilename = resumeData?.filename || "Mehedi_Hasan_Resume.pdf";

    if (resumeData?.base64Data) {
      const fileBuffer = Buffer.from(resumeData.base64Data, "base64");
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${downloadFilename}"`,
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      });
    }

    if (resumeData?.publicUrl) {
      return NextResponse.redirect(resumeData.publicUrl);
    }

    // 2. Fallback to local file if exists
    try {
      const localPath = path.join(process.cwd(), "public", "resume.pdf");
      if (fs.existsSync(localPath)) {
        const fileBuffer = fs.readFileSync(localPath);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${downloadFilename}"`,
          },
        });
      }
    } catch {}

    return new NextResponse(
      "Resume is currently being updated. Please reach out via the Contact Form to request a copy directly.",
      {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      }
    );
  } catch (err) {
    console.error("Resume download error:", err);
    return NextResponse.json({ error: "Failed to download resume." }, { status: 500 });
  }
}
