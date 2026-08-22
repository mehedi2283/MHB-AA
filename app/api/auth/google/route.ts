import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getGoogleClientCredentials } from "@/lib/google-integration";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { clientId } = await getGoogleClientCredentials();
    if (!clientId) {
      return NextResponse.redirect(new URL("/admin/settings?error=missing_google_client_id", req.url));
    }

    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const host = req.headers.get("host") || "localhost:3000";
    const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

    const scopes = [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/gmail.send",
    ].join(" ");

    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", scopes);
    googleAuthUrl.searchParams.set("access_type", "offline");
    googleAuthUrl.searchParams.set("prompt", "consent");
    googleAuthUrl.searchParams.set("include_granted_scopes", "true");

    return NextResponse.redirect(googleAuthUrl.toString());
  } catch (err) {
    console.error("Google auth init error:", err);
    return NextResponse.redirect(new URL("/admin/settings?error=unauthorized", req.url));
  }
}
