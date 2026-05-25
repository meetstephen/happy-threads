import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Mail, Send } from 'lucide-react';

/**
 * Netlify-Forms newsletter signup. No backend required — Netlify automatically
 * captures submissions and surfaces them in the project dashboard.
 *
 * IMPORTANT: A hidden static form mirroring this one is rendered inside
 * `index.html`'s body so Netlify's build can detect and register it.
 */
export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    setStatus('submitting');
    setError(null);
    try {
      const body = new URLSearchParams({
        'form-name': 'newsletter',
        name,
        email,
      }).toString();
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      setStatus('success');
      setEmail('');
      setName('');
    } catch (err) {
      setStatus('error');
      setError(
        'Could not subscribe right now. Please try again in a moment, or DM Happiness on WhatsApp.'
      );
      console.warn('Newsletter submission failed:', err);
    }
  };

  return (
    <section className="bg-cream-200/40 py-20 md:py-28 dark:bg-ink-800/40">
      <div className="container-luxe">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-bronze-400/20 text-bronze-500">
            <Mail size={20} />
          </div>
          <p className="eyebrow mt-5">Be the first to see new pieces</p>
          <h2 className="display-3 mt-3">
            Get the lookbook in your inbox.
          </h2>
          <p className="mt-5 text-ink-800/70 dark:text-cream-100/70">
            One quiet email each season — new arrivals, fitting promotions, and behind-the-scenes
            from the atelier. Unsubscribe anytime.
          </p>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-10 inline-flex items-center gap-3 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-5 py-3 text-sm text-[#1da851]"
            >
              <Check size={16} />
              You're in. Check your inbox for our welcome note.
            </motion.div>
          ) : (
            <form
              name="newsletter"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={submit}
              className="mx-auto mt-10 grid max-w-xl gap-3 sm:grid-cols-[1fr_1fr_auto]"
            >
              <input type="hidden" name="form-name" value="newsletter" />
              {/* honeypot */}
              <p className="hidden">
                <label>
                  Don't fill this out: <input name="bot-field" />
                </label>
              </p>
              <input
                type="text"
                name="name"
                placeholder="Your first name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-full border border-ink-800/15 bg-cream-100 px-5 py-3 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900"
              />
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full border border-ink-800/15 bg-cream-100 px-5 py-3 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900"
              />
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-primary w-full sm:w-auto disabled:opacity-50"
              >
                <Send size={14} />
                {status === 'submitting' ? 'Sending…' : 'Subscribe'}
              </button>
              {error && (
                <p className="text-sm text-wine-500 sm:col-span-3">{error}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
