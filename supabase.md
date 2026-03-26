# Supabase Integration Guide (Actual Steps)

This project already contains Supabase client code, auth middleware, migrations, and an Edge Function.
Follow the steps below in order to make everything work end-to-end.

## 0) What this project expects

Environment variables used by the app:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY` (for the Supabase Edge Function)

Main integration points already in code:

- Public + server clients: `src/lib/supabase.ts`
- Auth-aware clients (SSR cookies): `src/lib/supabase-auth.ts`
- Admin protection middleware: `middleware.ts`
- Edge function for lead email: `supabase/functions/send-lead-email/index.ts`
- Migrations:
  - `supabase/migrations/20260326_projects_slug_trigger.sql`
  - `supabase/migrations/20260326_leads_table_and_policies.sql`
  - `supabase/migrations/20260326_admin_cms_tables_and_policies.sql`

---

## 1) Create Supabase project

1. Go to Supabase Dashboard.
2. Create a new project.
3. Copy these values from Project Settings > API:
   - Project URL
   - anon public key

---

## 2) Create local env file

In project root, create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
RESEND_API_KEY=YOUR_RESEND_API_KEY
```

You can copy from `.env.example` first.

---

## 3) Install and login to Supabase CLI

If not installed yet:

```powershell
npm install -g supabase
```

Login:

```powershell
supabase login
```

---

## 4) Link this repo to your Supabase project

From repo root:

```powershell
supabase link --project-ref YOUR_PROJECT_REF
```

You can find project ref in Supabase URL:

- `https://YOUR_PROJECT_REF.supabase.co`

---

## 5) Run database migrations

Push all SQL migrations in this repo:

```powershell
supabase db push
```

This creates:

- leads table + policies
- blog_posts/testimonials/site_settings tables + policies
- storage bucket `admin-media`
- project slug trigger/functions

---

## 6) IMPORTANT policy alignment for leads (required)

Current leads migration uses policies that allow select/update/delete only when JWT has role claim = `admin`.

Your app login uses normal Supabase auth (`signInWithPassword`) and does not add custom role claims, so admin pages can fail to read/update leads unless you patch policies.

Run this SQL in Supabase SQL Editor (recommended for this app):

```sql
-- Replace strict admin-claim policies with authenticated-user policies

drop policy if exists "Admins can read leads" on public.leads;
create policy "Authenticated can read leads"
on public.leads
for select
to authenticated
using (true);

drop policy if exists "Admins can update leads" on public.leads;
create policy "Authenticated can update leads"
on public.leads
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Admins can delete leads" on public.leads;
create policy "Authenticated can delete leads"
on public.leads
for delete
to authenticated
using (true);
```

If you prefer strict owner-only admin security, keep claim-based policies and implement custom auth claims in your auth flow before using `/admin`.

---

## 7) Create your admin login user

In Supabase Dashboard:

1. Go to Authentication > Users.
2. Create a user with email + password.
3. Use that same email/password on `/admin/login`.

Notes:

- `/admin/*` is protected by `middleware.ts` and redirects to `/admin/login` when not authenticated.
- After login, user is redirected to `/admin/dashboard`.

---

## 8) Deploy Edge Function for lead emails

The contact form inserts into `leads` and invokes function `send-lead-email`.

### 8.1 Set function secrets

```powershell
supabase secrets set RESEND_API_KEY=YOUR_RESEND_API_KEY
```

### 8.2 Deploy function

```powershell
supabase functions deploy send-lead-email
```

### 8.3 Verify sender/domain in Resend

`send-lead-email` currently sends from:

- `Abaay Tech <no-reply@abaay.tech>`

Make sure this sender/domain is verified in Resend. If not, update the `from` value in:

- `supabase/functions/send-lead-email/index.ts`

Then redeploy function.

---

## 9) Start app and verify integration

Run app:

```powershell
npm install
npm run dev
```

### Verify checklist

1. Open `/contact` and submit a lead.
2. Confirm row appears in Supabase table `public.leads`.
3. Confirm email is sent by Edge Function (Supabase logs + inbox).
4. Open `/admin/login`, sign in with the created user.
5. Open `/admin/leads` and verify read/update/delete works.
6. Open `/admin/projects`, `/admin/blog`, `/admin/testimonials`, `/admin/settings` and verify CRUD.
7. Upload media in project editor and confirm object appears in storage bucket `admin-media`.

---

## 10) Troubleshooting

### "Supabase environment is missing"

Cause: missing env vars in `.env.local`.

Fix:

- Set `NEXT_PUBLIC_SUPABASE_URL`
- Set `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart `npm run dev`

### Admin login works but leads fail with RLS errors

Cause: leads policies still require JWT role claim `admin`.

Fix: apply SQL patch from section 6.

### Contact submit inserts lead but email is not sent

Check:

- `RESEND_API_KEY` secret set in Supabase
- function deployed: `send-lead-email`
- sender domain verified in Resend
- function logs in Supabase Dashboard

### Media upload fails in admin project editor

Check:

- migration created bucket `admin-media`
- storage policies exist (public read + authenticated write)
- logged in user is authenticated

---

## 11) Production notes

- Keep `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in hosting env settings.
- Keep `RESEND_API_KEY` only in Supabase function secrets (and optionally app server env if needed elsewhere).
- Prefer owner-only RLS policies for admin tables in production if multiple users can register.
