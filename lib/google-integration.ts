import { supabaseAdmin } from "@/lib/supabase";
import { decryptSecret, encryptSecret } from "@/lib/crypto";

export type GoogleAccountData = {
  email: string;
  name: string;
  picture: string;
  connectedAt: string;
  scopes: string[];
  encryptedAccessToken: string;
  encryptedRefreshToken?: string;
  expiresAt: number; // timestamp in ms
};

export async function getConnectedGoogleAccount(): Promise<GoogleAccountData | null> {
  try {
    const db = supabaseAdmin();
    const res = await db.from("app_settings").select("data").eq("key", "integration:google_oauth").maybeSingle();
    if (!res.data?.data) return null;
    return res.data.data as GoogleAccountData;
  } catch (err) {
    console.error("Error loading Google account:", err);
    return null;
  }
}

export async function saveGoogleAccount(data: GoogleAccountData): Promise<void> {
  const db = supabaseAdmin();
  const { error } = await db.from("app_settings").upsert(
    {
      key: "integration:google_oauth",
      data,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );
  if (error) throw error;
}

export async function disconnectGoogleAccount(): Promise<void> {
  const db = supabaseAdmin();
  const { error } = await db.from("app_settings").delete().eq("key", "integration:google_oauth");
  if (error) throw error;
}

export async function getGoogleClientCredentials() {
  const envId = process.env.GOOGLE_CLIENT_ID;
  const envSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (envId && envSecret) {
    return { clientId: envId, clientSecret: envSecret };
  }

  // Fallback to credentials stored in app_settings if configured in dashboard
  try {
    const db = supabaseAdmin();
    const res = await db.from("app_settings").select("data").eq("key", "integration:google_creds").maybeSingle();
    if (res.data?.data) {
      const data = res.data.data;
      const secret = data.encryptedSecret ? decryptSecret(data.encryptedSecret) : "";
      if (data.clientId && secret) {
        return { clientId: data.clientId, clientSecret: secret };
      }
    }
  } catch {}

  return { clientId: envId || "", clientSecret: envSecret || "" };
}

export async function getValidGoogleAccessToken(): Promise<string | null> {
  const account = await getConnectedGoogleAccount();
  if (!account) return null;

  const now = Date.now();
  // If access token is still valid (with 60s buffer)
  if (account.expiresAt && account.expiresAt > now + 60000 && account.encryptedAccessToken) {
    return decryptSecret(account.encryptedAccessToken);
  }

  // Otherwise, refresh using refresh_token
  if (!account.encryptedRefreshToken) {
    console.warn("No refresh token stored for Google account");
    return null;
  }

  const refreshToken = decryptSecret(account.encryptedRefreshToken);
  if (!refreshToken) return null;

  const { clientId, clientSecret } = await getGoogleClientCredentials();
  if (!clientId || !clientSecret) return null;

  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!res.ok) {
      console.error("Failed to refresh Google access token:", await res.text());
      return null;
    }

    const tokenData = await res.json();
    const newAccessToken = tokenData.access_token;
    const expiresInMs = (tokenData.expires_in || 3600) * 1000;

    await saveGoogleAccount({
      ...account,
      encryptedAccessToken: encryptSecret(newAccessToken),
      expiresAt: Date.now() + expiresInMs,
    });

    return newAccessToken;
  } catch (err) {
    console.error("Error refreshing Google access token:", err);
    return null;
  }
}

/**
 * Creates an event directly on Google Calendar with automatic Google Meet video link!
 */
export async function createGoogleCalendarEvent(params: {
  summary: string;
  description: string;
  startDateTime: string; // e.g. "2026-08-25T15:00:00"
  endDateTime: string; // e.g. "2026-08-25T15:45:00"
  timeZone?: string; // e.g. "Asia/Dhaka", "America/New_York"
  attendeeEmail?: string;
}): Promise<{ eventId?: string; meetUrl?: string; htmlLink?: string } | null> {
  const token = await getValidGoogleAccessToken();
  if (!token) return null;

  try {
    const tz = params.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

    const eventPayload: Record<string, unknown> = {
      summary: params.summary,
      description: params.description,
      start: {
        dateTime: params.startDateTime,
        timeZone: tz,
      },
      end: {
        dateTime: params.endDateTime,
        timeZone: tz,
      },
      conferenceData: {
        createRequest: {
          requestId: `meet_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    if (params.attendeeEmail) {
      eventPayload.attendees = [{ email: params.attendeeEmail }];
    }

    const res = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1",
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(eventPayload),
      }
    );

    if (!res.ok) {
      console.error("Google Calendar API Error:", await res.text());
      return null;
    }

    const data = await res.json();
    const meetUrl =
      data.conferenceData?.entryPoints?.find(
        (ep: { entryPointType: string; uri: string }) => ep.entryPointType === "video"
      )?.uri || data.hangoutLink;

    return {
      eventId: data.id,
      meetUrl,
      htmlLink: data.htmlLink,
    };
  } catch (err) {
    console.error("Failed to create Google Calendar event:", err);
    return null;
  }
}

/**
 * Sends an email directly from the connected Gmail account using Google Gmail API with rich HTML and CSS support.
 */
export async function sendGmailMessage(params: {
  to: string;
  subject: string;
  bodyText?: string;
  bodyHtml?: string;
}): Promise<boolean> {
  const token = await getValidGoogleAccessToken();
  if (!token) return false;

  try {
    const boundary = `boundary_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const plainText = params.bodyText || (params.bodyHtml ? params.bodyHtml.replace(/<[^>]+>/g, " ") : "");
    const htmlContent = params.bodyHtml || `<p style="white-space: pre-wrap;">${plainText}</p>`;

    const emailLines = [
      `To: ${params.to}`,
      `Subject: =?utf-8?B?${Buffer.from(params.subject).toString("base64")}?=`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: 7bit",
      "",
      plainText,
      "",
      `--${boundary}`,
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: 7bit",
      "",
      htmlContent,
      "",
      `--${boundary}--`,
    ];

    const rawMessage = Buffer.from(emailLines.join("\r\n"))
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ raw: rawMessage }),
    });

    return res.ok;
  } catch (err) {
    console.error("Failed to send Gmail message:", err);
    return false;
  }
}
