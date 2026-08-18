# Mehedi / AI portfolio

A production-oriented Next.js portfolio backed by a Supabase CMS. Homepage copy, projects, services, technologies, process steps, workflow nodes, metrics, inquiries and AI settings are managed at `/admin`.

## Supabase setup

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and preserve your existing `AUTH_SECRET` and `APP_ENCRYPTION_KEY`.
3. In the Supabase SQL Editor, run `supabase/schema.sql`.
4. Open **Project settings → API Keys** and place the project URL and a server-only `sb_secret_...` key in `SUPABASE_URL` and `SUPABASE_SECRET_KEY`. The legacy `SUPABASE_SERVICE_ROLE_KEY` remains supported as a fallback. Never expose either key to the browser.
5. Run `npm run seed` to copy the current website content into Supabase.
6. Set a private `ADMIN_SETUP_TOKEN` of at least 32 random characters, then register the first owner at `/admin/register`. Remove the token after the owner exists. Additional administrators require a valid owner/admin session. Alternatively, set `ADMIN_EMAIL`, `ADMIN_NAME` and a temporary `ADMIN_PASSWORD` (at least 12 characters), run `npm run create-admin`, then remove the plain password from `.env.local`.
7. Run `npm run dev -- --port 4000` or `npm run build && npm start -- --port 4000`, and open `/admin/login`.

The public website keeps its built-in content when Supabase is not configured. CMS writes, authentication, submissions, AI settings and conversation logs require the service-role connection.

All CMS tables have Row Level Security enabled without public policies. The trusted Next.js server uses the service role, so database writes are not exposed to visitors.

## Security

- Admin sessions use signed HTTP-only cookies and bcrypt password hashes.
- Provider keys use AES-256-GCM with `APP_ENCRYPTION_KEY` and are never returned to the browser.
- Contact requests are validated, rate limited and store only a one-way IP hash.
- Add `SUPABASE_SERVICE_ROLE_KEY` as an encrypted server environment variable when deploying. Never expose it through a `NEXT_PUBLIC_` variable.
