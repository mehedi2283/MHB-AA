import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const resumePath = path.join(process.cwd(), "public", "resume.pdf");

    if (!fs.existsSync(resumePath)) {
      // If no custom resume has been uploaded yet, return a helpful notice or redirect
      return new NextResponse(
        "Resume is being updated by Mehedi. Please reach out via the Contact Form to request a copy immediately.",
        {
          status: 404,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        }
      );
    }

    const fileBuffer = fs.readFileSync(resumePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Mehedi_Hasan_Resume.pdf"',
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("Resume download error:", err);
    return NextResponse.json({ error: "Failed to download resume." }, { status: 500 });
  }
}
