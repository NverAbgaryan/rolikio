# Supabase setup (MVP)

This folder contains SQL migrations for the MVP.

## 1) Create project + get keys
- Create a Supabase project.
- Copy:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only)

Put them in `.env.local` (do **not** commit secrets).

## 2) Apply migrations
Fastest MVP path:
- Open Supabase Dashboard → SQL Editor
- Run `supabase/migrations/0001_init.sql`
- Then run `supabase/migrations/0002_brief_and_refs.sql`

If you see an API error like “schema cache” / “tables are missing”, it means the migrations weren’t applied to the project you’re using in `.env.local`.

Later we can switch to Supabase CLI migration workflow.

