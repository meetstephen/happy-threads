export interface Testimonial {
  key: string;
  name: string;
  role: string;
  quote: string;
  custom?: boolean;
}

export const CUSTOM_TESTIMONIALS_KEY = 'testimonials.custom';

export function parseCustomTestimonials(value: string): Testimonial[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
      .filter(item => typeof item.id === 'string' && typeof item.name === 'string' && typeof item.quote === 'string')
      .slice(0, 20)
      .map(item => ({
        key: `custom-${item.id}`,
        name: String(item.name).trim().slice(0, 100),
        role: typeof item.role === 'string' ? item.role.trim().slice(0, 120) : '',
        quote: String(item.quote).trim().slice(0, 600),
        custom: true,
      }))
      .filter(item => item.name.length > 0 && item.quote.length > 0);
  } catch {
    return [];
  }
}
