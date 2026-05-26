export const BRAND_STATS = {
  clientsDressed: '200+',
  yearsOfCraft: '7+',
} as const;

/**
 * Faith Chukwu's primary inbox - the real, monitored email used for
 * newsletter signups, customer enquiries, and any "email Happiness directly"
 * fallback flows on the site.
 */
export const FAITH_EMAIL = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined)?.trim() || 'hello@happinessfashionworld.com';
