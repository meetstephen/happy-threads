import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { isSupabaseEnabled, supabase } from '../lib/supabase';

/**
 * Site Content Management — allows the admin to edit text and swap images
 * across the site from her phone. Content is keyed by a unique string ID.
 *
 * Storage priority:
 * 1. Supabase `site_content` table (when configured) — syncs to all visitors
 * 2. localStorage (fallback) — local-only
 *
 * Visitors always get the overridden content (if any exists). The default
 * (hardcoded) content acts as the fallback when no override is stored.
 */

interface SiteContentContextValue {
  /** Get the current value of a content key, or the fallback if not overridden. */
  get: (key: string, fallback: string) => string;
  /** Set a content value (admin only). */
  set: (key: string, value: string) => Promise<void>;
  /** Remove an override — revert to the hardcoded default. */
  reset: (key: string) => Promise<void>;
  /** True if there's an override for this key. */
  hasOverride: (key: string) => boolean;
  /** True when initially loading from the cloud. */
  loading: boolean;
}

const SiteContentContext = createContext<SiteContentContextValue | undefined>(undefined);
const LOCAL_KEY = 'happy-threads-site-content';

type ContentMap = Record<string, string>;

function loadLocal(): ContentMap {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveLocal(map: ContentMap) {
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(map));
  } catch {
    // quota exceeded — ignore
  }
}

const SUPABASE_TABLE = 'site_content';

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentMap>(() => loadLocal());
  const [loading, setLoading] = useState(isSupabaseEnabled);

  // Load from Supabase on mount (if configured)
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase
      .from(SUPABASE_TABLE)
      .select('key, value')
      .then(({ data, error }) => {
        if (!error && data) {
          const map: ContentMap = {};
          for (const row of data as { key: string; value: string }[]) {
            map[row.key] = row.value;
          }
          setContent((prev) => ({ ...prev, ...map }));
        }
        setLoading(false);
      });
  }, []);

  // Persist locally
  useEffect(() => {
    saveLocal(content);
  }, [content]);

  const get = useCallback(
    (key: string, fallback: string) => content[key] ?? fallback,
    [content]
  );

  const hasOverride = useCallback((key: string) => key in content, [content]);

  const set = useCallback(async (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    if (supabase) {
      await supabase
        .from(SUPABASE_TABLE)
        .upsert({ key, value }, { onConflict: 'key' })
        .then(({ error }) => {
          if (error) console.warn('[site-content] upsert error:', error.message);
        });
    }
  }, []);

  const reset = useCallback(async (key: string) => {
    setContent((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    if (supabase) {
      await supabase.from(SUPABASE_TABLE).delete().eq('key', key);
    }
  }, []);

  return (
    <SiteContentContext.Provider value={{ get, set, reset, hasOverride, loading }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error('useSiteContent must be used inside SiteContentProvider');
  return ctx;
}
