# Cloud Sync + Admin Auth Setup (Supabase) — 12-Minute Guide

The site works perfectly **without** this setup — designs Happiness adds in
the admin panel are saved on her phone's browser only. To make them appear
on **every visitor's device** (true cloud sync) AND restrict editing so that
**only Happiness can add or remove designs** (no shared passcode), follow
these steps.

You only do this once. It's free forever for a small atelier — Supabase's
free tier includes 500 MB database, 1 GB file storage, and 2 GB bandwidth/month
(plenty for thousands of designs and visitors).

> **Quick mental model:**
> - **Public visitors** can READ designs.
> - Only the signed-in admin (Happiness's email) can INSERT, UPDATE or DELETE.
> - Auth is enforced by Supabase Row-Level Security (RLS) — not by client-side
>   code — so even if someone reads the JavaScript bundle, they cannot write.

---

## Step 1 — Create a Supabase account

1. Go to **https://supabase.com** and click **"Start your project"**.
2. Sign up with GitHub (easiest) — no credit card needed.
3. Click **"New project"**. Pick:
   - **Name:** `happy-threads`
   - **Database password:** generate a strong one and save it somewhere safe
   - **Region:** closest to Nigeria (e.g. `eu-west-1` Ireland or `eu-central-1` Frankfurt)
4. Click **"Create project"**. Wait ~2 minutes while it provisions.

---

## Step 2 — Create the `designs` table with strict RLS

1. In the Supabase dashboard, click **SQL Editor** (left sidebar) → **"New query"**.
2. Paste **all** of the SQL below and click **"Run"**.

```sql
-- 1. The designs table
create table if not exists public.designs (
  id text primary key,
  name text not null,
  category text not null,
  description text,
  image text not null,
  tags text[] default array[]::text[],
  occasions text[] default array[]::text[],
  vibes text[] default array[]::text[],
  color_mood text,
  is_new boolean default true,
  added_on timestamptz default now()
);

-- 2. Row-Level Security: anyone can READ; only Happiness's authenticated
--    session can INSERT or DELETE. Update the email below to hers BEFORE
--    running this. (You'll set the same email as VITE_ADMIN_EMAIL in
--    Netlify env vars in Step 6.)
alter table public.designs enable row level security;

-- Public read
drop policy if exists "designs are publicly readable" on public.designs;
create policy "designs are publicly readable"
  on public.designs for select
  using (true);

-- Only the admin email may insert
drop policy if exists "only admin may insert" on public.designs;
create policy "only admin may insert"
  on public.designs for insert
  with check (auth.jwt() ->> 'email' = 'REPLACE_WITH_HAPPINESS_EMAIL@example.com');

-- Only the admin email may delete
drop policy if exists "only admin may delete" on public.designs;
create policy "only admin may delete"
  on public.designs for delete
  using (auth.jwt() ->> 'email' = 'REPLACE_WITH_HAPPINESS_EMAIL@example.com');

-- Only the admin email may update (for future-proofing)
drop policy if exists "only admin may update" on public.designs;
create policy "only admin may update"
  on public.designs for update
  using (auth.jwt() ->> 'email' = 'REPLACE_WITH_HAPPINESS_EMAIL@example.com');

-- 3. Realtime: visitors see new pieces appear without refreshing
alter publication supabase_realtime add table public.designs;
```

**🔑 IMPORTANT:** Before clicking Run, replace
`REPLACE_WITH_HAPPINESS_EMAIL@example.com` with Happiness's real email
(the one she'll sign in with). The same email goes into Netlify in Step 6.

You should see "Success. No rows returned." ✅

---

## Step 3 — Create the `designs` storage bucket (for photos)

1. Click **Storage** in the left sidebar.
2. Click **"New bucket"**.
3. Name it exactly: **`designs`**
4. Toggle **"Public bucket"** ON (this lets visitors load the photos).
5. Click **"Create bucket"**.

Now lock down uploads so only the admin can upload, but anyone can view:
go to **SQL Editor → New query** and run:

```sql
-- Public read of design photos
drop policy if exists "design photos are publicly readable" on storage.objects;
create policy "design photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'designs');

-- Only the admin email may upload new design photos
drop policy if exists "only admin may upload designs" on storage.objects;
create policy "only admin may upload designs"
  on storage.objects for insert
  with check (
    bucket_id = 'designs'
    and auth.jwt() ->> 'email' = 'REPLACE_WITH_HAPPINESS_EMAIL@example.com'
  );

-- Only the admin email may delete design photos
drop policy if exists "only admin may delete designs" on storage.objects;
create policy "only admin may delete designs"
  on storage.objects for delete
  using (
    bucket_id = 'designs'
    and auth.jwt() ->> 'email' = 'REPLACE_WITH_HAPPINESS_EMAIL@example.com'
  );
```

Again — replace the email with Happiness's real email before running.

---

## Step 4 — Configure Supabase Auth (one-time)

1. Click **Authentication** in the left sidebar → **Providers** → **Email**.
2. Make sure **"Email provider"** is enabled (it is by default).
3. **Recommended for ease of use:** scroll down to "Confirm email" and
   **disable** it. This way Happiness can sign up and immediately use the
   account without clicking a confirmation link. (You can re-enable later.)
4. Save.

---

## Step 5 — Grab the API keys

1. In Supabase dashboard, click the **gear icon** (Project Settings) → **API**.
2. Copy these two values:
   - **Project URL** — looks like `https://abcdefghijklm.supabase.co`
   - **anon public key** — a long string starting with `eyJ…`

> ⚠️ Use **anon public** (NOT `service_role`). The anon key is safe to expose
> in the browser; the service-role key must never be.

---

## Step 6 — Add the env vars to Netlify

1. Go to https://app.netlify.com → click your **happythreads** site.
2. Go to **Site configuration → Environment variables → Add a variable**.
3. Add these **three** variables:

| Key | Value |
|---|---|
| `VITE_SUPABASE_URL` | (paste your Project URL) |
| `VITE_SUPABASE_ANON_KEY` | (paste your anon public key) |
| `VITE_ADMIN_EMAIL` | (Happiness's email — must match the email in your SQL policies above) |

4. Click **Save**.
5. Go to **Deploys → Trigger deploy → Deploy site** to rebuild with the new env vars.

In ~90 seconds, your site is connected to the cloud with admin auth. 🎉

---

## Step 7 — Sign Happiness up as the admin

1. On Happiness's phone (or any device), open
   **https://happythreads.netlify.app/#admin**
   *(notice the `/#admin` at the end — this is the hidden admin URL)*
2. The Atelier sign-in screen appears. Click **"Create your atelier account"**.
3. Enter her admin email (the same one you put in `VITE_ADMIN_EMAIL`) and a
   strong password.
4. Click **"Create account"**.
5. **Tell her to bookmark `https://happythreads.netlify.app/#admin` on her
   phone home screen.** That's the only entry point — there is no visible
   button anywhere on the site.
6. Future visits: the site remembers her, so she's already signed in. The
   admin form opens straight to "Add design" mode.

---

## Step 8 — Test it

1. On Happiness's phone, open `/#admin`. The header should show:
   - 🟢 **Live sync** badge
   - "Signed in as happiness@…"
2. Add a test design with a photo.
3. On a different device (your computer, a different browser, or a friend's
   phone), open https://happythreads.netlify.app — the new design should
   appear automatically, even without refreshing. ✨
4. **Test that random visitors can't add anything:** open `/#admin` in a
   private/incognito browser → it should show the sign-in form, but signing
   up with any email other than Happiness's will be rejected with
   "This email is not registered as the atelier admin."

---

## Resetting Happiness's password

If she ever forgets:

1. In Supabase dashboard → **Authentication → Users**.
2. Find her email, click the three-dot menu → **"Send password recovery"**.
3. She gets an email with a reset link.

Or you can manually set a new password right there.

---

## Troubleshooting

**"This email is not registered as the atelier admin." even though I used the right email.**
The email comparison is case-insensitive but trims spaces. Make sure
`VITE_ADMIN_EMAIL` in Netlify exactly matches the address she signed up with
(no leading/trailing space). Trigger a fresh deploy after editing.

**Designs save locally but never appear on other devices.**
Most likely the env vars aren't reaching the build. Check Netlify
**Site configuration → Environment variables** — both `VITE_SUPABASE_URL`
and `VITE_SUPABASE_ANON_KEY` must start with `VITE_` (Vite only exposes
those). Then trigger a fresh deploy.

**"Image upload failed: new row violates row-level security policy"**
The storage policies in Step 3 weren't applied with Happiness's correct
email. Re-run that SQL block with the correct email.

**Real-time updates don't work.**
Run the last line from Step 2:
`alter publication supabase_realtime add table public.designs;`
You can also verify it under **Database → Replication** in the dashboard —
the `designs` table should be toggled on.

**She wants to use a different email later.**
Update `VITE_ADMIN_EMAIL` in Netlify, redeploy, and re-run the SQL policies
from Steps 2 and 3 with the new email. (She'll need to sign up the new
account on `/#admin` first.)

---

## Architecture summary

```
┌────────────────┐     ┌─────────────────┐     ┌───────────────────┐
│ Public visitor │────▶│ Supabase  RLS:  │────▶│ public.designs    │
│ (anon)         │     │ select=true     │     │  - id, name, ...  │
└────────────────┘     └─────────────────┘     └───────────────────┘

┌────────────────┐     ┌─────────────────┐     ┌───────────────────┐
│ Happiness      │     │ Supabase Auth   │     │ public.designs    │
│ /#admin signs  │────▶│ + RLS:          │────▶│  insert/delete OK │
│ in with email  │     │ jwt.email==hers │     │                   │
└────────────────┘     └─────────────────┘     └───────────────────┘
```

The admin email check happens **server-side** in Postgres, so even a
malicious visitor can't bypass it by editing JavaScript.

---

Built with care for Happiness Fashion, Abakaliki.
