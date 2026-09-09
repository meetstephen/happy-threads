import type { Design } from '../data/designs';

export const LOOKBOOK_ORDER_KEY = 'lookbook.customOrder';

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

