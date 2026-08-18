import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { timingSafeEqual } from "crypto";
import { z } from "zod";
import { ADMIN_SESSION_COOKIE, createSession, requireAdmin, sessionCookieOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

const registrationSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.email().max(254),
  password: z.string().min(12).max(128),
  setupToken: z.string().max(256).optional(),
});

async function currentSession() {
  try { return await requireAdmin(); } catch { return null; }
}

function setupTokenConfigured(){return (process.env.ADMIN_SETUP_TOKEN||"").length>=32}
function validSetupToken(value?:string){const expected=process.env.ADMIN_SETUP_TOKEN||"",received=value||"";if(expected.length<32||received.length!==expected.length)return false;return timingSafeEqual(Buffer.from(received),Buffer.from(expected))}

async function registrationState() {
  if (!supabaseConfigured()) throw new Error("SUPABASE_NOT_CONFIGURED");
  const result = await supabaseAdmin().from("admins").select("email").limit(1);
  if (result.error) throw result.error;
  const hasAdmins = (result.data?.length ?? 0) > 0;
  const session = await currentSession();
  return { hasAdmins, session, canRegister: hasAdmins ? Boolean(session) : setupTokenConfigured() };
}

export async function GET() {
  try {
    const state = await registrationState();
    return NextResponse.json({ hasAdmins: state.hasAdmins, canRegister: state.canRegister, requiresSetupToken: !state.hasAdmins }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    const message = code === "PGRST205" ? "Supabase is connected, but the CMS schema has not been installed yet" : "The Supabase server connection is unavailable";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`register:${ip}`, 5, 60 * 60 * 1000)) return NextResponse.json({ error: "Too many registration attempts" }, { status: 429 });

  try {
    const input = registrationSchema.parse(await request.json());
    const state = await registrationState();
    if (!state.canRegister) return NextResponse.json({ error: "Registration is restricted to an existing administrator" }, { status: 403 });
    if (!state.hasAdmins && !validSetupToken(input.setupToken)) return NextResponse.json({ error: "The owner setup token is invalid" }, { status: 403 });

    const email = input.email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(input.password, 12);
    const role = state.hasAdmins ? "admin" : "owner";
    const createdBy = state.hasAdmins ? String(state.session?.sub || "admin") : email;
    const db = supabaseAdmin();
    const result = await db.from("admins").insert({
      email,
      full_name: input.fullName,
      password_hash: passwordHash,
      role,
      created_by: createdBy,
      updated_at: new Date().toISOString(),
    }).select("email, full_name, role").single();

    if (result.error?.code === "23505") return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    if (result.error) throw result.error;

    await db.from("activity_logs").insert({ admin_id: createdBy, action: "register", entity: "admin", entity_id: email });
    const response = NextResponse.json({ user: result.data, signedIn: !state.hasAdmins }, { status: 201 });
    if (!state.hasAdmins) {
      response.cookies.set(ADMIN_SESSION_COOKIE, await createSession(email), sessionCookieOptions());
    }
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Enter a valid name, email and a password of at least 12 characters" }, { status: 400 });
    return NextResponse.json({ error: "Unable to register this account" }, { status: 500 });
  }
}
