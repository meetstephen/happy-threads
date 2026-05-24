import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, X } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { buildWhatsAppUrl, orderMessage } from '../utils/whatsapp';
import { useCategoryLabel } from '../utils/categoryLabel';
import type { Design } from '../data/designs';

interface Props {
  design: Design | null;
  onClose: () => void;
}

export default function Lightbox({ design, onClose }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [shared, setShared] = useState(false);
  const labelFor = useCategoryLabel();

  useEffect(() => {
    if (!design) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // Update URL so the lightbox is shareable. Replaces (no history entry).
    const url = new URL(window.location.href);
    url.searchParams.set('design', design.id);
    window.history.replaceState({}, '', url.toString());
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      const u = new URL(window.location.href);
      u.searchParams.delete('design');
      window.history.replaceState({}, '', u.toString());
    };
  }, [design, onClose]);

  const onShare = async () => {
    if (!design) return;
    const url = new URL(window.location.href);
    url.searchParams.set('design', design.id);
    const shareUrl = url.toString();
    const shareData = {
      title: `${design.name} · Happiness Fashion World`,
      text: `Check out this ${design.category} piece by Happiness Fashion World: ${design.name}`,
      url: shareUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShared(true);
        setTimeout(() => setShared(false), 1800);
      }
    } catch {
      // user cancelled — ignore
    }
  };

  return (
    <AnimatePresence>
      {design && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-ink-900/85 p-4 backdrop-blur-md sm:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative grid w-full max-w-5xl gap-0 overflow-hidden rounded-3xl bg-cream-100 shadow-luxe md:grid-cols-2 dark:bg-ink-800"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-cream-100/90 text-ink-800 backdrop-blur-md transition-colors hover:bg-cream-100 dark:bg-ink-900/90 dark:text-cream-100"
            >
              <X size={18} />
            </button>

            <div className="aspect-[3/4] w-full overflow-hidden md:aspect-auto md:h-[80vh]">
              <img src={design.image} alt={design.name} className="h-full w-full object-cover" />
            </div>

            <div className="flex flex-col justify-between p-8 md:p-10">
              <div>
                <p className="eyebrow">{labelFor(design.category)}</p>
                <h3 className="display-3 mt-3">{design.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-bronze-500">
                  Reference {design.id}
                </p>
                <p className="mt-6 leading-relaxed text-ink-800/75 dark:text-cream-100/75">
                  {design.description}
                </p>

                {design.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {design.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-ink-800/15 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-ink-800/70 dark:border-cream-100/20 dark:text-cream-100/70"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-10 space-y-3">
                <a
                  href={buildWhatsAppUrl(orderMessage(design.name, design.id))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp w-full"
                >
                  <MessageCircle size={16} /> Order on WhatsApp
                </a>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(design.id)}
                    className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-all ${
                      isFavorite(design.id)
                        ? 'border-wine-500 bg-wine-500 text-cream-100'
                        : 'border-ink-800/20 text-ink-800 hover:border-ink-800 dark:border-cream-100/20 dark:text-cream-100'
                    }`}
                  >
                    <Heart
                      size={14}
                      fill={isFavorite(design.id) ? 'currentColor' : 'none'}
                    />
                    {isFavorite(design.id) ? 'Saved' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={onShare}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-800/20 px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-ink-800 transition-all hover:border-bronze-500 hover:text-bronze-500 dark:border-cream-100/20 dark:text-cream-100"
                  >
                    <Share2 size={14} />
                    {shared ? 'Link copied!' : 'Share'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
