# Cloud Sync Setup (Supabase) — 10-Minute Guide

The site works perfectly **without** this setup — designs Happiness adds in the
admin panel are saved on her phone's browser only. To make them appear on
**every visitor's device** (true cloud sync, real-time updates), follow these
steps.

You only do this once. It's free forever for a small atelier — Supabase's
free tier includes 500 MB database, 1 GB file storage, and 2 GB bandwidth/month
(plenty for thousands of designs and visitors).

---

## Step 1 — Create a Supabase account

1. Go to **https://supabase.com** and click **"Start your project"**.
2. Sign up with GitHub (easiest) — no credit card needed.
3. Click **"New project"**. Pick:
   - **Name:** `happy-threads` (or anything you like)
   - **Database password:** generate a strong one and save it somewhere safe
   - **Region:** closest to Nigeria (e.g. `eu-west-1` Ireland or `eu-central-1` Frankfurt)
4. Click **"Create project"**. Wait ~2 minutes while it provisions.

---

## Step 2 — Create the `designs` table

1. In the Supabase dashboard, click **SQL Editor** (left sidebar) → **"New query"**.
2. Paste the SQL below and click **"Run"**.

```sql
-- Designs table
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

-- Enable Row Level Security and add public-read + public-write policies.
-- (The passcode in AddDesignPanel.tsx is the practical safeguard.
--  For stricter security, see "Hardening" at the bottom of this file.)
alter table public.designs enable row level security;

create policy "designs are publicly readable"
  on public.designs for select
  using (true);

create policy "anyone can insert a design"
  on public.designs for insert
  with check (true);

create policy "anyone can delete a design"
  on public.designs for delete
  using (true);

-- Enable realtime subscriptions (so the site updates without a refresh
-- when Happiness adds a new piece on her phone).
alter publication supabase_realtime add table public.designs;
```

You should see "Success. No rows returned." ✅

---

## Step 3 — Create the `designs` storage bucket (for photos)

1. Click **Storage** in the left sidebar.
2. Click **"New bucket"**.
3. Name it exactly: **`designs`**
4. Toggle **"Public bucket"** ON (this lets visitors load the photos).
5. Click **"Create bucket"**.

Now allow public uploads to it: still in **Storage**, click the `designs`
bucket → **"Policies"** tab → **"New policy"** → choose **"For full
customization"** and paste:

```sql
-- Allow anyone to upload to the designs bucket
create policy "anyone can upload design photos"
  on storage.objects for insert
  with check (bucket_id = 'designs');

-- Allow anyone to read photos from the bucket
create policy "design photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'designs');
```

(Or use the dashboard's policy templates: **"Allow access to JPG images in a public folder"** for read, and **"Allow uploads"** for write.)

---

## Step 4 — Grab the API keys

1. In the Supabase dashboard, click the **gear icon** (Project Settings) → **API**.
2. You'll see two values you need:
   - **Project URL** — looks like `https://abcdefghijklm.supabase.co`
   - **anon public key** — a long string starting with `eyJ…`
3. Keep this tab open — you'll paste both into Netlify next.

> ⚠️ Use **anon public** (not `service_role`). The anon key is safe to expose
> in the browser; the service-role key must never be.

---

## Step 5 — Add the keys to Netlify

1. Go to https://app.netlify.com → click your **happythreads** site.
2. Go to **Site configuration → Environment variables → Add a variable**.
3. Add these two variables:

| Key | Value |
|---|---|
| `VITE_SUPABASE_URL` | (paste your Project URL) |
| `VITE_SUPABASE_ANON_KEY` | (paste your anon public key) |

4. Click **Save**.
5. Go to **Deploys → Trigger deploy → Deploy site** to rebuild with the new env vars.

In ~90 seconds, your site is connected to the cloud. 🎉

---

## Step 6 — Test it

1. Open https://happythreads.netlify.app on your **phone** (Happiness's phone).
2. Tap the 🔑 key icon in the footer → enter passcode `happy2026`.
3. Look at the top-right of the panel — you should see a green **🟢 Live sync** badge (instead of "Local only"). That confirms it's connected.
4. Add a test design with a photo.
5. Now open the same site on your **computer** in a different browser. The new design should appear automatically — even without refreshing! ✨

---

## Hardening (optional, recommended once you're confident)

The setup above lets *anyone* who finds your URL insert designs (the anon
key is in the JavaScript bundle). The passcode in the panel is your only
practical safeguard. For 99% of small-business sites, this is fine — anyone
malicious would just be polluting your specific portfolio.

To make it bulletproof, you can:

1. **Move inserts to a Supabase Edge Function** that checks a secret header.
   The client passes the passcode in the header, the function verifies it
   with the service-role key, and only then inserts. The anon key only gets
   read access.
2. **Use Supabase Auth** — create a single admin account for Happiness, log
   her in once on her phone. Replace `with check (true)` with
   `with check (auth.uid() = '<her-admin-uuid>')`.

Either approach is a 30-minute upgrade — happy to walk you through it whenever
you're ready.

---

## Troubleshooting

**The badge still says "Local only" after deploying.**
Make sure both env vars start with `VITE_` (Vite only exposes those to the
browser) and that you triggered a fresh Netlify deploy after adding them.

**I see "Image upload failed" when adding a design.**
Re-check Step 3 — the bucket must be named exactly `designs` and have public
upload + read policies.

**Real-time updates don't work.**
Make sure you ran the last SQL line (`alter publication supabase_realtime ...`).
You can also check it under **Database → Replication** in the dashboard — the
`designs` table should be toggled on for realtime.

---

Built with care for Happiness Fashion, Abakaliki.
