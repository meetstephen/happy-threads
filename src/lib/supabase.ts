import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * The single admin email that may sign in and manage the catalog.
 * Set via Netlify env var `VITE_ADMIN_EMAIL`. If unset, no one can edit
 * (the cloud is read-only for visitors).
 */
export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined)
  ?.trim()
  .toLowerCase();

/**
 * True when both Supabase env vars are configured. When false, the site
 * works fully offline via localStorage — no backend required.
 */
export const isSupabaseEnabled: boolean = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseEnabled
  ? createClient(url!, anonKey!, {
      auth: {
        // Persist the admin's session across reloads so Happiness only
        // signs in once on her phone.
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export const STORAGE_BUCKET = 'designs';
export const DESIGNS_TABLE = 'designs';
