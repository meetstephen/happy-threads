import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Shirt } from 'lucide-react';
import type { Design } from '../data/designs';
import { useCategoryLabel } from '../utils/categoryLabel';

/** localStorage key + how many recently-viewed pieces we keep. */
export const RECENTLY_VIEWED_KEY = 'hfw-recently-viewed';
export const RECENTLY_VIEWED_CAP = 8;
/** Fired (same tab) whenever the recently-viewed list changes. */
export const RECENTLY_VIEWED_EVENT = 'hfw-recently-viewed-changed';

/** Read the stored ids, newest-first, defensively parsed. */
function readIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === 'string')
      : [];
  } catch {
    return [];
  }
}

/**
 * Record a design id as "recently viewed": newest-first, de-duplicated and
 * capped. Notifies any mounted <RecentlyViewed /> via a custom event so the
 * row updates the moment a visitor opens a design in the Lightbox.
 *
 * Exported so App.tsx can call it from its `openDesignLightbox` handler —
 * keeping all the localStorage logic in one place.
 */
export function recordRecentlyViewed(id: string): void {
  try {
    const next = [id, ...readIds().filter((x) => x !== id)].slice(0, RECENTLY_VIEWED_CAP);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent(RECENTLY_VIEWED_EVENT));
  } catch {
    /* private mode / quota — silently ignore, the row just won't appear */
  }
}

interface Props {
  designs: Design[];
  onOpen: (design: Design) => void;
}

/**
 * Horizontal, snap-scrolling row of the pieces this visitor recently opened.
 * Renders nothing on a first visit (no history) or with fewer than 2 items,
 * so it never adds empty clutter to the page.
 */
export default function RecentlyViewed({ designs, onOpen }: Props) {
  const [ids, setIds] = useState<string[]>(() => readIds());
  const labelFor = useCategoryLabel();

  useEffect(() => {
    const refresh = () => setIds(readIds());
    // Same-tab updates (opening a design) + cross-tab updates (storage event).
    window.addEventListener(RECENTLY_VIEWED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(RECENTLY_VIEWED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // Resolve ids -> live designs in order; drop any that no longer exist
  // (e.g. a custom design the admin deleted).
  const items = ids
    .map((id) => designs.find((d) => d.id === id))
    .filter((d): d is Design => Boolean(d));

  if (items.length < 2) return null;

  return (
    <section
      aria-label="Recently viewed designs"
      className="border-t border-ink-800/5 py-14 md:py-20 dark:border-cream-100/5"
    >
      <div className="container-luxe">
        <p className="eyebrow flex items-center gap-2">
          <Clock size={13} /> Recently Viewed
        </p>
        <h2 className="display-3 mt-3">Pieces you came back to.</h2>

        <div className="mt-8 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-0 sm:px-0">
          {items.map((design) => (
            <RecentCard
              key={design.id}
              design={design}
              label={labelFor(design.category)}
              onOpen={() => onOpen(design)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentCard({
  design,
  label,
  onOpen,
}: {
  design: Design;
  label: string;
  onOpen: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      aria-label={`View ${design.name}`}
      className="group block w-40 shrink-0 snap-start text-left sm:w-48"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-cream-50 shadow-soft transition-shadow duration-500 group-hover:shadow-luxe dark:bg-ink-800">
        {imgError ? (
          <div className="flex h-full w-full items-center justify-center bg-bronze-100 dark:bg-ink-700">
            <Shirt size={36} className="text-bronze-400 opacity-60" />
          </div>
        ) : (
          <img
            src={design.image}
            alt={design.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/55 via-ink-900/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <h3 className="mt-3 truncate font-display text-base text-ink-800 dark:text-cream-100">
        {design.name}
      </h3>
      <p className="mt-0.5 truncate text-[10px] uppercase tracking-[0.22em] text-bronze-500">
        {label}
      </p>
    </motion.button>
  );
}
