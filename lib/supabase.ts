import { createClient } from "@supabase/supabase-js";

function serverKey() {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

export function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && serverKey());
}

export function supabaseAdmin() {
  if (!supabaseConfigured()) throw new Error("Supabase server credentials are not configured");
  return createClient(process.env.SUPABASE_URL!, serverKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
