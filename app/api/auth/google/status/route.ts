import { NextRequest, NextResponse } from "next/server";
import { isUnauthorizedError, requireAdmin } from "@/lib/auth";
import {
  disconnectGoogleAccount,
  getConnectedGoogleAccount,
  getGoogleClientCredentials,
} from "@/lib/google-integration";
import { supabaseAdmin } from "@/lib/supabase";
import { encryptSecret } from "@/lib/crypto";

export async function GET() {
  try {
    await requireAdmin();

    const [account, creds] = await Promise.all([
      getConnectedGoogleAccount(),
      getGoogleClientCredentials(),
    ]);

    return NextResponse.json({
      connected: Boolean(account),
      account: account
        ? {
            email: account.email,
            name: account.name,
            picture: account.picture,
            connectedAt: account.connectedAt,
            scopes: account.scopes,
          }
        : null,
      hasClientId: Boolean(creds.clientId),
      clientId: creds.clientId ? `${creds.clientId.slice(0, 12)}...apps.googleusercontent.com` : "",
      hasClientSecret: Boolean(creds.clientSecret),
    });
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Supabase error" }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();

    if (body.action === "disconnect") {
      await disconnectGoogleAccount();
      return NextResponse.json({ ok: true });
    }

    if (body.action === "save_credentials") {
      const { clientId, clientSecret } = body;
      if (!clientId || !clientSecret) {
        return NextResponse.json({ error: "Client ID and Client Secret are required." }, { status: 400 });
      }

      const db = supabaseAdmin();
      await db.from("app_settings").upsert(
        {
          key: "integration:google_creds",
          data: {
            clientId: clientId.trim(),
            encryptedSecret: encryptSecret(clientSecret.trim()),
            updatedAt: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" }
      );

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    if (isUnauthorizedError(error)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
