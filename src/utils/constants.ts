export const BRAND_STATS = {
  clientsDressed: '200+',
  yearsOfCraft: '7+',
} as const;

/**
 * Happiness's primary inbox - the real, monitored email shown on the site as
 * an alternative contact method, used for newsletter signups, customer
 * enquiries, and any "email Happiness directly" fallback flows.
 *
 * Defaults to her real address so it always appears even without env config;
 * can still be overridden via the VITE_CONTACT_EMAIL env var.
 */
export const FAITH_EMAIL = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim() || 'chukwufaithhappiness1@gmail.com';
