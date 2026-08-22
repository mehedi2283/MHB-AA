import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createDocument } from "@/lib/supabase-data";
import { rateLimit } from "@/lib/rate-limit";
import {
  createGoogleCalendarEvent,
  getConnectedGoogleAccount,
  sendGmailMessage,
} from "@/lib/google-integration";
import { supabaseAdmin } from "@/lib/supabase";
import crypto from "crypto";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().max(200),
  company: z.string().max(150).optional(),
  projectType: z.string().min(2).max(100),
  budget: z.string().max(60),
  timeline: z.string().max(60),
  message: z.string().min(10).max(5000),
  meetingRequested: z.union([z.boolean(), z.string()]).optional(),
  meetingDate: z.string().max(50).optional(),
  meetingTime: z.string().max(100).optional(),
  meetingPlatform: z.string().max(50).optional(),
  website: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  // Generous rate limit for smooth user experience (30 requests per hour)
  if (!rateLimit(`contact:${ip}`, 30, 3600000)) {
    return NextResponse.json({ error: "Rate limit reached. Please try again shortly." }, { status: 429 });
  }

  try {
    const rawBody = await req.json();
    const data = schema.parse(rawBody);
    if (data.website) return NextResponse.json({ ok: true });
    const { website: _, ...submission } = data;
    void _;

    let meetUrl: string | undefined = undefined;
    let calendarEventLink: string | undefined = undefined;

    // 1. Google Integration (Calendar Event + Meet Link + Client Email + Admin Notification)
    try {
      const googleAccount = await getConnectedGoogleAccount();

      if (googleAccount) {
        // If user requested a discovery meeting
        if (submission.meetingRequested && submission.meetingDate) {
          const datePart = submission.meetingDate.split("T")[0];
          // Default to 10:00 AM UTC or parse time if provided
          let timeHour = "10";
          let timeMin = "00";
          if (submission.meetingTime) {
            const match = submission.meetingTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
            if (match) {
              let h = parseInt(match[1], 10);
              const m = match[2];
              const p = match[3].toUpperCase();
              if (p === "PM" && h !== 12) h += 12;
              if (p === "AM" && h === 12) h = 0;
              timeHour = String(h).padStart(2, "0");
              timeMin = m;
            }
          }

          const startIso = `${datePart}T${timeHour}:${timeMin}:00Z`;
          const endHour = String((parseInt(timeHour, 10) + 1) % 24).padStart(2, "0");
          const endIso = `${datePart}T${endHour}:${timeMin}:00Z`;

          const eventResult = await createGoogleCalendarEvent({
            summary: `Discovery Call · Mehedi & ${submission.name}`,
            description: `Project Type: ${submission.projectType}\nBudget: ${submission.budget}\nTimeline: ${submission.timeline}\nClient Email: ${submission.email}\nCompany: ${submission.company || "N/A"}\n\nClient Brief:\n${submission.message}`,
            startDateTime: startIso,
            endDateTime: endIso,
            attendeeEmail: submission.email,
          });

          if (eventResult?.meetUrl) {
            meetUrl = eventResult.meetUrl;
            calendarEventLink = eventResult.htmlLink;
          }

          // A) Send Confirmation Message to Client
          await sendGmailMessage({
            to: submission.email,
            subject: `Discovery Call Confirmed · Mehedi & ${submission.name}`,
            bodyText: `Hi ${submission.name},\n\nThank you for reaching out! Your discovery call has been placed on Google Calendar.\n\nMeeting Details:\n• Date: ${submission.meetingDate}\n• Time: ${submission.meetingTime || "11:00 AM"}\n• Project: ${submission.projectType}\n• Google Meet Link: ${meetUrl || "Will be provided in calendar invite"}\n\nI look forward to speaking with you.\n\nBest regards,\nMehedi\nAI & Automation Specialist\nhttps://mehedi.ai`,
          });
        }

        // B) Send Instant Notification Email to Mehedi (Admin)
        const adminDestEmail =
          googleAccount.email ||
          process.env.NOTIFICATION_EMAIL ||
          process.env.ADMIN_EMAIL ||
          "mehedihasan123456789.mh.mh@gmail.com";

        await sendGmailMessage({
          to: adminDestEmail,
          subject: `🚨 New Lead & ${submission.meetingRequested ? "Meeting Booked" : "Inquiry"}: ${submission.name} (${submission.budget})`,
          bodyText: `New project inquiry received on your portfolio!\n\nClient Details:\n• Name: ${submission.name}\n• Email: ${submission.email}\n• Company: ${submission.company || "N/A"}\n• Project Type: ${submission.projectType}\n• Budget Range: ${submission.budget}\n• Timeline: ${submission.timeline}\n• Meeting Requested: ${submission.meetingRequested ? "YES" : "No"}\n${submission.meetingDate ? `• Meeting Date: ${submission.meetingDate} at ${submission.meetingTime || "Flexible"}\n` : ""}${meetUrl ? `• Google Meet Link: ${meetUrl}\n` : ""}\nProject Problem / Solution Brief:\n${submission.message}\n\nView and manage in Admin Control Room: /admin/inquiries`,
        });
      }
    } catch (googleErr) {
      console.error("Google background sync error:", googleErr);
    }

    // 2. Save Inquiry to Supabase
    try {
      await createDocument("inquiries", {
        ...submission,
        meetUrl,
        calendarEventLink,
        submissionStatus: "new",
        ipHash: crypto.createHash("sha256").update(ip).digest("hex"),
        status: "new",
        visible: false,
      });
    } catch (dbErr) {
      console.error("Database save error:", dbErr);
    }

    // 3. Optional Webhook Dispatch
    try {
      const db = supabaseAdmin();
      const intSettings = await db.from("app_settings").select("data").eq("key", "integrations:google").maybeSingle();
      const webhookUrl = intSettings.data?.data?.webhookUrl;
      if (webhookUrl) {
        fetch(webhookUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ event: "lead.created", data: { ...submission, meetUrl } }),
        }).catch(() => {});
      }
    } catch {}

    return NextResponse.json({ ok: true, meetUrl, calendarEventLink }, { status: 201 });
  } catch (e) {
    console.error("Contact form error:", e);
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Please check all required fields." }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to send inquiry. Please try again." }, { status: 500 });
  }
}
