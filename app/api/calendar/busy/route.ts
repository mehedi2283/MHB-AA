import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getValidGoogleAccessToken } from "@/lib/google-integration";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date"); // e.g. "2026-08-25"
  const hostTimezone = process.env.HOST_TIMEZONE || "Asia/Dhaka";

  if (!dateStr) {
    return NextResponse.json({ busySlots: [], hostTimezone });
  }

  const busySlotsSet = new Set<string>();

  // 1. Check Supabase inquiries for booked slots on this date
  try {
    const db = supabaseAdmin();
    const { data: inquiries } = await db
      .from("inquiries")
      .select("meeting_date, meeting_time, status")
      .eq("meeting_date", dateStr);

    if (inquiries && inquiries.length > 0) {
      for (const inq of inquiries) {
        if (inq.meeting_time && inq.status !== "cancelled" && inq.status !== "rejected") {
          busySlotsSet.add(inq.meeting_time.trim());
        }
      }
    }
  } catch (dbErr) {
    console.error("Error querying Supabase for busy slots:", dbErr);
  }

  // 2. Check Google Calendar events if connected
  try {
    const token = await getValidGoogleAccessToken();
    if (token) {
      const timeMin = `${dateStr}T00:00:00Z`;
      const timeMax = `${dateStr}T23:59:59Z`;

      const gcalRes = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
          timeMin
        )}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true`,
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );

      if (gcalRes.ok) {
        const eventsData = await gcalRes.json();
        if (eventsData.items && Array.isArray(eventsData.items)) {
          for (const ev of eventsData.items) {
            const startDt = ev.start?.dateTime || ev.start?.date;
            if (startDt && startDt.includes("T")) {
              const dateObj = new Date(startDt);
              // Format to 12-hour format e.g. "11:00 AM" or "03:00 PM"
              let h = dateObj.getHours();
              const m = String(dateObj.getMinutes()).padStart(2, "0");
              const p = h >= 12 ? "PM" : "AM";
              h = h % 12;
              if (h === 0) h = 12;
              const formattedSlot = `${String(h).padStart(2, "0")}:${m} ${p}`;
              busySlotsSet.add(formattedSlot);
            }
          }
        }
      }
    }
  } catch (gcalErr) {
    console.error("Error checking Google Calendar for busy slots:", gcalErr);
  }

  return NextResponse.json({
    busySlots: Array.from(busySlotsSet),
    hostTimezone,
  });
}
