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
      recipients,
      clientName,
      company,
      projectName,
      techStack = [],
      subject,
      customBodyHtml,
      customBodyText,
    } = body;

    const recipientList = Array.from(new Set([
      ...(Array.isArray(recipients) ? recipients : []),
      ...(typeof to === "string" ? [to] : []),
    ].map(email => email.trim().toLowerCase()).filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))));

    if (recipientList.length === 0) {
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
    const failedRecipients: string[] = [];
    for (const recipient of recipientList) {
      const sent = await sendGmailMessage({
        to: recipient,
        subject,
        bodyHtml: fullHtml,
        bodyText: plainText,
      });
      if (!sent) failedRecipients.push(recipient);
    }

    if (failedRecipients.length === recipientList.length) {
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
          const sentAt = new Date().toISOString();
          const updatedHistory = [
            ...recipientList
              .filter(recipient => !failedRecipients.includes(recipient))
              .map(recipient => ({ sentAt, subject, to: recipient, status: "sent" })),
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

    if (failedRecipients.length > 0) {
      return NextResponse.json({ ok: true, message: `Email sent to ${recipientList.length - failedRecipients.length} recipient(s).`, failedRecipients }, { status: 207 });
    }
    return NextResponse.json({ ok: true, message: `Email successfully sent to ${recipientList.join(", ")}` });
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.error("Cold outreach sending error:", error);
    return NextResponse.json({ error: "Internal server error dispatching cold email" }, { status: 500 });
  }
}
