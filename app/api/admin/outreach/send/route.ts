import { NextRequest, NextResponse } from "next/server";
import { isUnauthorizedError, requireAdmin } from "@/lib/auth";
import { getConnectedGoogleAccount, sendGmailMessage } from "@/lib/google-integration";
import { buildColdOutreachHtml } from "@/lib/email-templates";
import { listDocuments, updateDocument } from "@/lib/supabase-data";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    const {
      clientId,
      to,
      clientName,
      company,
      projectName,
      techStack = [],
      subject,
      customBodyHtml,
      customBodyText,
    } = body;

    if (!to || !to.includes("@")) {
      return NextResponse.json({ error: "Valid recipient email address is required." }, { status: 400 });
    }

    if (!subject || !customBodyHtml) {
      return NextResponse.json({ error: "Email subject and message body are required." }, { status: 400 });
    }

    // Check if Google account is connected
    const googleAccount = await getConnectedGoogleAccount();
    if (!googleAccount) {
      return NextResponse.json(
        {
          error:
            "Google Account is not connected. Please go to Admin Settings -> Google Integration to connect your Gmail account.",
        },
        { status: 400 }
      );
    }

    // Build rich HTML email
    const fullHtml = buildColdOutreachHtml({
      clientName: clientName || "there",
      company,
      projectName,
      techStack,
      customSubject: subject,
      customBodyHtml,
    });

    const plainText =
      customBodyText ||
      customBodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    // Send via connected Gmail account
    const sent = await sendGmailMessage({
      to,
      subject,
      bodyHtml: fullHtml,
      bodyText: plainText,
    });

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send email via Google Gmail API. Please verify your Google OAuth tokens in Settings." },
        { status: 500 }
      );
    }

    // If a clientId is provided, record this outreach in client's history
    if (clientId) {
      try {
        const allClients = await listDocuments("clients");
        const clientDoc = allClients.find(c => c._id === clientId);
        if (clientDoc) {
          const pastHistory = Array.isArray(clientDoc.outreachHistory) ? clientDoc.outreachHistory : [];
          const updatedHistory = [
            {
              sentAt: new Date().toISOString(),
              subject,
              to,
              status: "sent",
            },
            ...pastHistory,
          ];

          await updateDocument("clients", clientId, {
            ...clientDoc,
            stage: clientDoc.stage === "lead" ? "contacted" : clientDoc.stage,
            lastContactedAt: new Date().toISOString(),
            outreachHistory: updatedHistory,
          });
        }
      } catch (logErr) {
        console.error("Failed to update client outreach history:", logErr);
      }
    }

    return NextResponse.json({ ok: true, message: `Email successfully sent to ${to}` });
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("Cold outreach sending error:", error);
    return NextResponse.json({ error: "Internal server error dispatching cold email" }, { status: 500 });
  }
}
