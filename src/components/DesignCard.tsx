import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Maximize2, MessageCircle, Share2, Shirt, Sparkles } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { buildWhatsAppUrl, orderMessage } from '../utils/whatsapp';
import { useCategoryLabel } from '../utils/categoryLabel';
import EditableImage from './EditableImage';
import type { Design } from '../data/designs';

async function shareDesign(d: Design) {
  const url = new URL(window.location.href);
  url.searchParams.set('design', d.id);
  const shareUrl = url.toString();
  const shareData = {
    title: `${d.name} · Happiness Fashion World`,
    text: `Check out this ${d.category} piece: ${d.name}`,
    url: shareUrl,
  };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return false;
    }
    await navigator.clipboard.writeText(shareUrl);
    return true; // copied
  } catch {
    return false;
  }
}

interface Props {
  design: Design;
  onOpen: (d: Design) => void;
  highlighted?: boolean;
  featured?: boolean;
}

export default function DesignCard({ design, onOpen, highlighted, featured }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const fav = isFavorite(design.id);
  const labelFor = useCategoryLabel();

  const onShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const wasCopied = await shareDesign(design);
    if (wasCopied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <motion.article
      data-design-id={design.id}
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl bg-cream-50 shadow-soft transition-all duration-500 hover:shadow-luxe hover:-translate-y-1 dark:bg-ink-800 ${
        highlighted ? 'ring-2 ring-bronze-500 ring-offset-4 ring-offset-cream-100 dark:ring-offset-ink-900' : ''
      } ${featured ? 'border-t-2 border-t-bronze-500' : ''}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {design.custom ? (
          imgError ? (
            <div className="flex h-full w-full items-center justify-center bg-bronze-100 dark:bg-ink-700">
              <Shirt size={48} className="text-bronze-400 opacity-60" />
            </div>
          ) : (
            <img
              src={design.image}
              alt={design.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="luxe-image h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
            />
          )
        ) : (
          <EditableImage
            contentKey={`design.image.${design.id}`}
            defaultSrc={design.image}
            alt={design.name}
            className="luxe-image h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* badges (top-left) */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {featured && !highlighted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-bronze-500/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-cream-100 backdrop-blur">
              <Sparkles size={10} /> Featured
            </span>
          )}
          {highlighted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-bronze-500 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-cream-100">
              <Sparkles size={10} /> Stylist Pick
            </span>
          )}
          {design.isNew && (
            <span className="rounded-full bg-wine-500 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-cream-100">
              New Arrival
            </span>
          )}
          {design.custom && (
            <span className="rounded-full border border-cream-100/40 bg-ink-900/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-cream-100 backdrop-blur">
              Just In
            </span>
          )}
        </div>

        {/* top-right actions */}
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(design.id);
            }}
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
            className={`grid h-11 w-11 sm:h-9 sm:w-9 place-items-center rounded-full backdrop-blur-md transition-all ${
              fav
                ? 'bg-wine-500 text-cream-100'
                : 'bg-cream-100/85 text-ink-800 hover:bg-cream-100'
            }`}
          >
            <Heart size={15} fill={fav ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(design);
            }}
            aria-label="View larger"
            className="grid h-11 w-11 sm:h-9 sm:w-9 place-items-center rounded-full bg-cream-100/85 text-ink-800 backdrop-blur-md transition-colors hover:bg-cream-100"
          >
            <Maximize2 size={15} />
          </button>
          <button
            type="button"
            onClick={onShareClick}
            aria-label="Share this design"
            className="grid h-11 w-11 sm:h-9 sm:w-9 place-items-center rounded-full bg-cream-100/85 text-ink-800 backdrop-blur-md transition-colors hover:bg-cream-100"
            title={copied ? 'Link copied!' : 'Share'}
          >
            <Share2 size={15} />
          </button>
        </div>

        {/* hover order overlay */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-500 group-hover:translate-y-0">
          <a
            href={buildWhatsAppUrl(orderMessage(design.name, design.id))}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-cream-100/95 px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ink-800 transition-colors hover:bg-bronze-400 hover:text-ink-900"
          >
            <MessageCircle size={14} /> Order on WhatsApp
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpen(design)}
        className="block w-full p-5 text-left"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl text-ink-800 dark:text-cream-100">
            {design.name}
          </h3>
          <span className="text-[10px] uppercase tracking-[0.3em] text-bronze-500">
            {design.id.length > 12 ? design.id.slice(0, 12) + '…' : design.id}
          </span>
        </div>
        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-ink-800/55 dark:text-cream-100/55">
          {labelFor(design.category)}
        </p>
      </button>
    </motion.article>
  );
}
