import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * True when both Supabase env vars are configured. When false, the site
 * works fully offline via localStorage — no backend required.
 */
export const isSupabaseEnabled: boolean = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseEnabled
  ? createClient(url!, anonKey!, {
      auth: { persistSession: false },
    })
  : null;

export const STORAGE_BUCKET = 'designs';
export const DESIGNS_TABLE = 'designs';
