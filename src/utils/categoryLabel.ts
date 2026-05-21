import { useSiteContent } from '../context/SiteContentContext';
import type { DesignCategory } from '../data/designs';

/**
 * Returns the display label for a category — either the admin-overridden
 * label (set on the Categories tab in the admin panel) or the canonical name.
 * The underlying data still uses the canonical category strings; only what
 * visitors see can be renamed.
 */
export function useCategoryLabel(): (canonical: DesignCategory | string) => string {
  const { get } = useSiteContent();
  return (canonical) => get(`category.label.${canonical}`, canonical);
}
