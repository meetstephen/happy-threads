import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ExternalLink, Mail, Send } from 'lucide-react';
import { buildNewsletterMailto, saveNewsletterSignup } from '../services/newsletterService';
import { isSupabaseEnabled } from '../lib/supabase';
import { FAITH_EMAIL } from '../utils/constants';

/**
 * Newsletter signup form.
 *
 * Behaviour:
 *   1. Primary path - if Supabase is configured, the email is inserted into
 *      the `newsletter_subscribers` table where Happiness can see it from
 *      the Supabase dashboard.
 *   2. Always-on fallback - a visible "Email Happiness directly" button
 *      below the form opens the visitor's email app pre-filled, so signups
 *      reach her inbox even if Supabase isn't set up or fails.
 *   3. If Supabase save fails, the form auto-launches the mailto fallback
 *      so the visitor never sees a dead end.
 *
 * Replaces the previous Netlify-Forms approach, which silently dropped
 * submissions when the build-time form crawler missed the React-rendered
 * form (which is what was happening on production).
 */
export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('That email looks incomplete. Double-check it?');
      return;
    }

    setStatus('submitting');
    setError(null);

    if (isSupabaseEnabled) {
      try {
        await saveNewsletterSignup({ email: trimmedEmail, name: name.trim() });
        setStatus('success');
        setEmail('');
        setName('');
        return;
      } catch (err) {
        console.warn('[Newsletter] Supabase save failed, falling back to mailto:', err);
        // fall through to mailto fallback below
      }
    }

    // Fallback path - launch the user's email app addressed to Faith.
    try {
      window.location.href = buildNewsletterMailto({ email: trimmedEmail, name: name.trim() });
      setStatus('success');
      setEmail('');
      setName('');
    } catch (err) {
      console.warn('[Newsletter] mailto fallback failed:', err);
      setStatus('error');
      setError(
        'Could not subscribe right now. Tap "Email Happiness directly" below or message her on WhatsApp.'
      );
    }
  };

  const directMailto = buildNewsletterMailto({ email: email.trim(), name: name.trim() });

  return (
    <section className="bg-cream-200/40 py-20 md:py-28 dark:bg-ink-800/40">
      <div className="container-luxe">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-bronze-400/20 text-bronze-500">
            <Mail size={20} />
          </div>
          <p className="eyebrow mt-5">Be the first to see new pieces</p>
          <h2 className="display-3 mt-3">Get the lookbook in your inbox.</h2>
          <p className="mt-5 text-ink-800/70 dark:text-cream-100/70">
            One quiet email each season - new arrivals, fitting promotions, and behind-the-scenes
            from the atelier. Unsubscribe anytime.
          </p>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-10 inline-flex max-w-md items-center gap-3 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 px-5 py-3 text-sm text-[#1da851]"
            >
              <Check size={16} className="shrink-0" />
              <span className="text-left">
                You're in. Happiness will be in touch soon.
              </span>
            </motion.div>
          ) : (
            <>
              <form
                onSubmit={submit}
                className="mx-auto mt-10 grid max-w-xl gap-3 sm:grid-cols-[1fr_1fr_auto]"
                noValidate
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Your first name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  enterKeyHint="next"
                  autoComplete="given-name"
                  autoCapitalize="words"
                  className="rounded-2xl border border-ink-800/15 bg-cream-100 px-5 py-3 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900"
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  enterKeyHint="send"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  className="rounded-2xl border border-ink-800/15 bg-cream-100 px-5 py-3 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-primary disabled:opacity-50"
                >
                  <Send size={14} />
                  {status === 'submitting' ? 'Sending...' : 'Subscribe'}
                </button>
                {error && (
                  <p className="rounded-2xl border border-wine-500/30 bg-wine-500/10 p-3 text-left text-sm text-wine-500 sm:col-span-3">
                    {error}
                  </p>
                )}
              </form>

              {/* Always-visible mailto fallback */}
              <p className="mt-6 text-xs text-ink-800/55 dark:text-cream-100/55">
                Or{' '}
                <a
                  href={directMailto}
                  className="inline-flex items-center gap-1 font-medium text-bronze-500 underline-offset-4 hover:underline"
                >
                  email Happiness directly
                  <ExternalLink size={11} />
                </a>{' '}
                at <span className="break-all">{FAITH_EMAIL}</span>
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
