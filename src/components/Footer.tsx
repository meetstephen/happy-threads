import { Instagram } from 'lucide-react';
import { WHATSAPP_DISPLAY, buildWhatsAppUrl, generalEnquiryMessage } from '../utils/whatsapp';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-ink-800/10 py-12 dark:border-cream-100/10">
      <div className="container-luxe flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-800 font-display italic text-bronze-400 dark:bg-cream-100 dark:text-ink-900">
            H
          </span>
          <div className="leading-tight">
            <div className="font-display text-base">Happiness Fashion</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-bronze-500">
              Bespoke Atelier • Lagos
            </div>
          </div>
        </div>

        <p className="text-xs text-ink-800/55 dark:text-cream-100/55">
          © {year} Happiness Fashion. Stitched with love.
        </p>

        <div className="flex items-center gap-3">
          <a
            href={buildWhatsAppUrl(generalEnquiryMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.22em] text-ink-800/70 transition-colors hover:text-bronze-500 dark:text-cream-100/70"
          >
            {WHATSAPP_DISPLAY}
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="grid h-9 w-9 place-items-center rounded-full border border-ink-800/15 transition-colors hover:border-bronze-500 hover:text-bronze-500 dark:border-cream-100/15"
          >
            <Instagram size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
