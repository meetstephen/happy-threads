import { useEffect, useState } from 'react';
import { ADMIN_EMAIL, supabase } from './supabase';

export interface AdminSession {
  email: string;
  userId: string;
}

interface AuthState {
  /** True while we're checking the persisted session on mount. */
  loading: boolean;
  /** The admin session, or null if not signed in (or not the admin email). */
  admin: AdminSession | null;
}

/**
 * React hook around Supabase Auth, gated to a single allowed admin email.
 *
 * - On mount, checks for a persisted session and exposes it.
 * - Subscribes to auth state changes so sign-in/sign-out re-render the UI.
 * - Only sessions matching `VITE_ADMIN_EMAIL` are returned as `admin`;
 *   any other signed-in user is treated as anonymous and immediately
 *   signed out (defensive — RLS policies are the real wall).
 */
export function useAdminAuth(): AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
} {
  const [state, setState] = useState<AuthState>({ loading: true, admin: null });

  useEffect(() => {
    if (!supabase) {
      setState({ loading: false, admin: null });
      return;
    }

    let mounted = true;

    const apply = async (session: { user?: { id: string; email?: string | null } } | null) => {
      const email = session?.user?.email?.toLowerCase() ?? null;
      const userId = session?.user?.id ?? null;
      if (email && userId && ADMIN_EMAIL && email === ADMIN_EMAIL) {
        if (mounted) setState({ loading: false, admin: { email, userId } });
      } else {
        if (email && ADMIN_EMAIL && email !== ADMIN_EMAIL) {
          // signed in as someone else — kick them out
          await supabase!.auth.signOut().catch(() => {});
        }
        if (mounted) setState({ loading: false, admin: null });
      }
    };

    supabase.auth.getSession().then(({ data }) => apply(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      apply(session);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error('Cloud sync is not configured.');
    const trimmed = email.trim().toLowerCase();
    if (ADMIN_EMAIL && trimmed !== ADMIN_EMAIL) {
      throw new Error('This email is not registered as the atelier admin.');
    }
    const { error } = await supabase.auth.signInWithPassword({ email: trimmed, password });
    if (error) throw new Error(error.message);
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) throw new Error('Cloud sync is not configured.');
    const trimmed = email.trim().toLowerCase();
    if (ADMIN_EMAIL && trimmed !== ADMIN_EMAIL) {
      throw new Error('Only the atelier admin email can register.');
    }
    const { data, error } = await supabase.auth.signUp({ email: trimmed, password });
    if (error) throw new Error(error.message);
    return { needsConfirmation: !data.session };
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return { ...state, signIn, signUp, signOut };
}

/** True when an admin email is configured (cloud + admin both ready). */
export function hasAdminConfigured(): boolean {
  return Boolean(supabase && ADMIN_EMAIL);
}
