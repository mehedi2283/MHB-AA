import { NextRequest, NextResponse } from "next/server";
import { getGoogleClientCredentials, saveGoogleAccount } from "@/lib/google-integration";
import { encryptSecret } from "@/lib/crypto";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(new URL(`/admin/settings?error=${error || "no_code"}`, req.url));
  }

  const { clientId, clientSecret } = await getGoogleClientCredentials();
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/admin/settings?error=missing_credentials", req.url));
  }

  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("host") || "localhost:3000";
  const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

  try {
    // Exchange authorization code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error("Google token exchange failed:", errText);
      return NextResponse.redirect(new URL("/admin/settings?error=token_exchange_failed", req.url));
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresInMs = (tokenData.expires_in || 3600) * 1000;

    // Fetch user profile info from Google
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(new URL("/admin/settings?error=failed_user_info", req.url));
    }

    const userData = await userRes.json();

    // Save connected account with encrypted tokens in Supabase
    await saveGoogleAccount({
      email: userData.email,
      name: userData.name || userData.email,
      picture: userData.picture || "",
      connectedAt: new Date().toISOString(),
      scopes: (tokenData.scope || "").split(" "),
      encryptedAccessToken: encryptSecret(accessToken),
      encryptedRefreshToken: refreshToken ? encryptSecret(refreshToken) : undefined,
      expiresAt: Date.now() + expiresInMs,
    });

    return NextResponse.redirect(new URL("/admin/settings?google=connected", req.url));
  } catch (err) {
    console.error("Google OAuth error:", err);
    return NextResponse.redirect(new URL("/admin/settings?error=unknown", req.url));
  }
}
