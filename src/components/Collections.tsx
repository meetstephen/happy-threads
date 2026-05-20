import { useMemo, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import DesignCard from './DesignCard';
import { categories, type Design, type DesignCategory } from '../data/designs';
import { useFavorites } from '../context/FavoritesContext';

interface Props {
  designs: Design[];
  highlightIds?: string[] | null;
  onOpen: (design: Design) => void;
}

type Filter = 'All' | 'New Arrivals' | DesignCategory | 'Favorites';

export default function Collections({ designs, highlightIds, onOpen }: Props) {
  const [filter, setFilter] = useState<Filter>('All');
  const { favorites } = useFavorites();

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
    if (highlightIds && highlightIds.length > 0) {
      list = [...list].sort((a, b) => {
        const ai = highlightIds.includes(a.id) ? 0 : 1;
        const bi = highlightIds.includes(b.id) ? 0 : 1;
        return ai - bi;
      });
    }
    return list;
  }, [designs, filter, favorites, highlightIds]);

  const allFilters: Filter[] = ['All', 'New Arrivals', ...categories, 'Favorites'];

  return (
    <section id="collections" className="py-24 md:py-32">
      <div className="container-luxe">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">The Collection</p>
          <h2 className="display-2 mt-4">Crafted for the moments that matter.</h2>
          <div className="gold-divider mt-8" />
          <p className="mt-6 text-ink-800/70 dark:text-cream-100/70">
            Browse a curated selection — every piece is made-to-measure and finished by
            hand. Tap any design to view it larger or send it straight to WhatsApp.
          </p>
        </div>

        {/* filter chips */}
        <div id="favorites" className="mt-12 flex flex-wrap items-center justify-center gap-2.5 md:gap-3">
          {allFilters.map((f) => {
            const active = filter === f;
            const isFav = f === 'Favorites';
            const isNew = f === 'New Arrivals';
            return (
              <button
                type="button"
                key={f}
                onClick={() => setFilter(f)}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-all duration-300 ${
                  active
                    ? 'border-ink-800 bg-ink-800 text-cream-100 dark:border-cream-100 dark:bg-cream-100 dark:text-ink-900'
                    : 'border-ink-800/20 text-ink-800/70 hover:border-ink-800 hover:text-ink-800 dark:border-cream-100/20 dark:text-cream-100/70 dark:hover:border-cream-100 dark:hover:text-cream-100'
                }`}
              >
                {isFav && <Heart size={12} fill={active ? 'currentColor' : 'none'} />}
                {isNew && <Sparkles size={12} />}
                {f}
                {isFav && favorites.length > 0 && (
                  <span className="ml-1 rounded-full bg-bronze-500 px-1.5 text-[9px] text-cream-100">
                    {favorites.length}
                  </span>
                )}
                {isNew && newCount > 0 && (
                  <span className="ml-1 rounded-full bg-wine-500 px-1.5 text-[9px] text-cream-100">
                    {newCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* grid */}
        <motion.div layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((d) => (
            <DesignCard
              key={d.id}
              design={d}
              onOpen={onOpen}
              highlighted={highlightIds?.includes(d.id) ?? false}
            />
          ))}
        </motion.div>

        {visible.length === 0 && (
          <div className="mt-16 rounded-2xl border border-dashed border-ink-800/20 p-12 text-center text-ink-800/60 dark:border-cream-100/20 dark:text-cream-100/60">
            {filter === 'Favorites'
              ? 'No favorites yet — tap the heart on any design to save it for later.'
              : filter === 'New Arrivals'
              ? 'No new arrivals at the moment. Check back soon!'
              : 'No pieces in this category yet.'}
          </div>
        )}
      </div>
    </section>
  );
}
