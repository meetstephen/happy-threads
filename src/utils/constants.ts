export const BRAND_STATS = {
  clientsDressed: '200+',
  yearsOfCraft: '7+',
} as const;

/**
 * Primary contact email for the business - used for newsletter signups,
 * customer enquiries, and "email Happiness directly" fallback flows.
 * Defaults to a generic business email; override with VITE_CONTACT_EMAIL.
 */
export const FAITH_EMAIL = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) || 'hello@happinessfashionworld.com';
