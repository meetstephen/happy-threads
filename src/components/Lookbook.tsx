import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Heart, Search, Sparkles, X } from 'lucide-react';
import { categories, type Design, type DesignCategory } from '../data/designs';
import { useFavorites } from '../context/FavoritesContext';

interface Props {
  open: boolean;
  designs: Design[];
  onClose: () => void;
  onOpenDesign: (design: Design) => void;
}

type Filter = 'All' | 'New Arrivals' | DesignCategory | 'Favorites';

/**
 * The Lookbook — a full-screen overlay that opens on click and reveals
 * the entire catalog (10–20+ designs) in a beautiful, dense grid.
 *
 * Hidden by default so it doesn't occupy any space on the page. When opened
 * it takes over the viewport with a sticky header (filters, search, close)
 * and a scrollable body of designs. Tapping any design opens the existing
 * Lightbox on top — close that and you're back in the lookbook.
 */
export default function Lookbook({ open, designs, onClose, onOpenDesign }: Props) {
  const [filter, setFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const newCount = useMemo(
    () => designs.filter((d) => d.isNew || d.custom).length,
    [designs]
  );

  const visible = useMemo(() => {
    let list = designs;
    if (filter === 'New Arrivals') {
      list = list.filter((d) => d.isNew || d.custom);
    } else if (filter === 'Favorites') {
      list = list.filter((d) => favorites.includes(d.id));
    } else if (filter !== 'All') {
      list = list.filter((d) => d.category === filter);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)) ||
          d.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [designs, filter, favorites, query]);

  // Lock body scroll + escape-to-close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Reset filters when reopened
  useEffect(() => {
    if (open) {
      setFilter('All');
      setQuery('');
    }
  }, [open]);

  const allFilters: Filter[] = ['All', 'New Arrivals', ...categories, 'Favorites'];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col bg-cream-100 dark:bg-ink-900"
          role="dialog"
          aria-modal="true"
          aria-label="The Lookbook"
        >
          {/* Sticky header */}
          <header className="sticky top-0 z-10 border-b border-ink-800/10 bg-cream-100/95 backdrop-blur-lg dark:border-cream-100/10 dark:bg-ink-900/95">
            <div className="container-luxe flex items-center justify-between gap-4 py-4 md:py-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-bronze-400/20 text-bronze-500">
                  <BookOpen size={18} />
                </div>
                <div className="leading-tight">
                  <p className="eyebrow">The Lookbook</p>
                  <h2 className="font-display text-xl md:text-2xl">
                    {visible.length} {visible.length === 1 ? 'piece' : 'pieces'}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close lookbook"
                className="grid h-10 w-10 place-items-center rounded-full border border-ink-800/15 bg-cream-100 transition-colors hover:border-bronze-500 hover:text-bronze-500 dark:border-cream-100/20 dark:bg-ink-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search bar */}
            <div className="container-luxe pb-3 md:pb-4">
              <div className="relative">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-800/40 dark:text-cream-100/40"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, fabric, occasion..."
                  className="w-full rounded-full border border-ink-800/15 bg-cream-50 py-2.5 pl-11 pr-4 text-sm focus:border-bronze-500 focus:outline-none dark:border-cream-100/15 dark:bg-ink-800"
                />
              </div>
            </div>

            {/* Filter chips — horizontal scroll on mobile */}
            <div className="container-luxe">
              <div className="-mx-5 flex snap-x snap-mandatory items-center gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 md:gap-2.5 md:pb-4">
                {allFilters.map((f) => {
                  const active = filter === f;
                  const isFav = f === 'Favorites';
                  const isNew = f === 'New Arrivals';
                  return (
                    <button
                      type="button"
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`flex shrink-0 snap-start items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] transition-all duration-300 sm:shrink sm:px-4 sm:text-[11px] ${
                        active
                          ? 'border-ink-800 bg-ink-800 text-cream-100 dark:border-cream-100 dark:bg-cream-100 dark:text-ink-900'
                          : 'border-ink-800/20 text-ink-800/70 hover:border-ink-800 dark:border-cream-100/20 dark:text-cream-100/70'
                      }`}
                    >
                      {isFav && <Heart size={10} fill={active ? 'currentColor' : 'none'} />}
                      {isNew && <Sparkles size={10} />}
                      {f}
                      {isFav && favorites.length > 0 && (
                        <span className="rounded-full bg-bronze-500 px-1.5 text-[9px] text-cream-100">
                          {favorites.length}
                        </span>
                      )}
                      {isNew && newCount > 0 && (
                        <span className="rounded-full bg-wine-500 px-1.5 text-[9px] text-cream-100">
                          {newCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </header>

          {/* Body — dense grid of designs */}
          <div className="flex-1 overflow-y-auto">
            <div className="container-luxe py-6 md:py-10">
              {visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-ink-800/20 p-12 text-center text-ink-800/60 dark:border-cream-100/20 dark:text-cream-100/60">
                  No pieces match your filters. Try clearing the search or picking another category.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                  {visible.map((design, i) => (
                    <LookbookCard
                      key={design.id}
                      design={design}
                      index={i}
                      isFavorite={isFavorite(design.id)}
                      onToggleFavorite={() => toggleFavorite(design.id)}
                      onOpen={() => onOpenDesign(design)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface CardProps {
  design: Design;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
}

/** A compact, dense lookbook card — smaller than the homepage DesignCard. */
function LookbookCard({ design, index, isFavorite, onToggleFavorite, onOpen }: CardProps) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.4) }}
      className="group relative overflow-hidden rounded-xl bg-cream-50 text-left shadow-soft transition-shadow hover:shadow-luxe dark:bg-ink-800"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={design.image}
          alt={design.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/65 via-ink-900/0 to-transparent" />

        {/* Badges (top-left) */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {design.isNew && (
            <span className="rounded-full bg-wine-500 px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.2em] text-cream-100">
              New
            </span>
          )}
          {design.custom && (
            <span className="rounded-full bg-ink-900/70 px-2 py-0.5 text-[8px] font-medium uppercase tracking-[0.2em] text-cream-100 backdrop-blur">
              Just In
            </span>
          )}
        </div>

        {/* Heart (top-right) */}
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite();
            }
          }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute right-2 top-2 grid h-7 w-7 cursor-pointer place-items-center rounded-full backdrop-blur-md transition-all ${
            isFavorite
              ? 'bg-wine-500 text-cream-100'
              : 'bg-cream-100/85 text-ink-800 hover:bg-cream-100'
          }`}
        >
          <Heart size={12} fill={isFavorite ? 'currentColor' : 'none'} />
        </span>

        {/* Name overlay (bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5 text-cream-100">
          <div className="line-clamp-1 font-display text-sm md:text-base">{design.name}</div>
          <div className="line-clamp-1 text-[9px] uppercase tracking-[0.2em] text-cream-100/80">
            {design.category}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
