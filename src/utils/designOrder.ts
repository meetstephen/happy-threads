import type { Design } from '../data/designs';

export const LOOKBOOK_ORDER_KEY = 'lookbook.customOrder';
export const LOOKBOOK_HIDDEN_KEY = 'lookbook.hiddenDesigns';

export function parseDesignOrder(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : [];
  } catch {
    return [];
  }
}

export function applyDesignOrder(designs: Design[], value: string): Design[] {
  const order = parseDesignOrder(value);
  if (order.length === 0) return designs;

  const rank = new Map(order.map((id, index) => [id, index]));
  return designs
    .map((design, originalIndex) => ({ design, originalIndex }))
    .sort((a, b) => {
      const aRank = rank.get(a.design.id);
      const bRank = rank.get(b.design.id);
      if (aRank !== undefined && bRank !== undefined) return aRank - bRank;
      if (aRank !== undefined) return -1;
      if (bRank !== undefined) return 1;
      return a.originalIndex - b.originalIndex;
    })
    .map(({ design }) => design);
}

export function parseHiddenDesigns(value: string): string[] {
  return parseDesignOrder(value);
}

export function applyDesignVisibility(designs: Design[], value: string): Design[] {
  const hidden = new Set(parseHiddenDesigns(value));
  return hidden.size === 0 ? designs : designs.filter((design) => !hidden.has(design.id));
}
