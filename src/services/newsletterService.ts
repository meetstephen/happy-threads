import { supabase } from '../lib/supabase';
import { FAITH_EMAIL } from '../utils/constants';

const TABLE = 'newsletter_subscribers';

interface NewsletterSignup {
  email: string;
  name?: string;
}

/**
 * Persists a newsletter signup to Supabase.
 *
 * Throws if Supabase is not configured or the row insert fails.
 * The caller is responsible for showing a friendly fallback (e.g. mailto)
 * when this rejects.
 */
export async function saveNewsletterSignup({ email, name }: NewsletterSignup): Promise<void> {
  if (!supabase) {
    throw new Error('Cloud sync is not configured.');
  }
  const { error } = await supabase.from(TABLE).insert({
    email: email.trim().toLowerCase(),
    name: name?.trim() || null,
    source: 'website',
  });
  if (error) {
    // Treat duplicate-email as a soft success - the visitor is already on the list.
    const isDuplicate = /duplicate key|unique constraint/i.test(error.message);
    if (!isDuplicate) {
      throw new Error(error.message);
    }
  }
}

/**
 * Builds a mailto: URL prefilled with the visitor's signup details so that
 * tapping it opens the visitor's email app addressed to Faith. Used as a
 * 100% reliable fallback when Supabase isn't reachable.
 */
export function buildNewsletterMailto({ email, name }: NewsletterSignup): string {
  const subject = 'Newsletter signup - Happiness Fashion World';
  const body = [
    'Hi Happiness,',
    '',
    'I would like to subscribe to your newsletter.',
    '',
    `Name: ${name?.trim() || '(not provided)'}`,
    `Email: ${email.trim()}`,
    '',
    'Sent from happythreads.netlify.app',
  ].join('\n');
  const params = new URLSearchParams({ subject, body });
  return `mailto:${FAITH_EMAIL}?${params.toString().replace(/\+/g, '%20')}`;
}
