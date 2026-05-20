/**
 * Build a Pexels CDN image URL.
 * Pexels CDN is free, no API key needed for direct image URLs, and serves
 * authentic photography of Nigerian/African models in traditional and modern wear.
 */
export function pexels(id: number, w = 900, h = 1200): string {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop`;
}
