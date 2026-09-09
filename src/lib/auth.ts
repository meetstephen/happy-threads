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
  signOut: () => Promise<void>;
  /**
   * Sends a password-reset email to the admin via Supabase Auth.
   * The email contains a magic link that, when clicked, lands the user
   * back on `?admin=recovery` with a temporary session that lets them set a new
   * password from the dashboard. Throws if `email` does not match the
   * configured ADMIN_EMAIL.
   */
  resetPassword: (email: string) => Promise<void>;
  /** Set a new password while signed in, including from a recovery link. */
  updatePassword: (password: string) => Promise<void>;
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

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    if (!supabase) throw new Error('Cloud sync is not configured.');
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) throw new Error('Enter your email above first.');
    if (ADMIN_EMAIL && trimmed !== ADMIN_EMAIL) {
      throw new Error('Password reset is only available for the atelier admin email.');
    }
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}?admin=recovery`
        : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(trimmed, { redirectTo });
    if (error) throw new Error(error.message);
  };

  const updatePassword = async (password: string) => {
    if (!supabase) throw new Error('Cloud sync is not configured.');
    if (password.length < 10) throw new Error('Use at least 10 characters.');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(error.message);
  };

  return { ...state, signIn, signOut, resetPassword, updatePassword };
}

/** True when an admin email is configured (cloud + admin both ready). */
export function hasAdminConfigured(): boolean {
  return Boolean(supabase && ADMIN_EMAIL);
}
