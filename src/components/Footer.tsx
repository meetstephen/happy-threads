import { useRef } from 'react';
import { Instagram, Mail } from 'lucide-react';
import Logo from './Logo';
import { WHATSAPP_DISPLAY, buildWhatsAppUrl, generalEnquiryMessage } from '../utils/whatsapp';
import { FAITH_EMAIL } from '../utils/constants';

export default function Footer() {
  const year = new Date().getFullYear();
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSecretTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 3000);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      window.location.hash = 'admin';
    }
  };

  return (
    <footer className="border-t border-ink-800/10 py-12 pb-24 sm:pb-12 dark:border-cream-100/10">
      <div className="container-luxe flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <Logo size={36} withWordmark />

        <p
          className="text-xs text-ink-800/55 select-none dark:text-cream-100/55"
          onClick={handleSecretTap}
        >
          © {year} Happiness Fashion World · Abakaliki, Nigeria. Stitched with love.
        </p>

        <div className="flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-end">
          <a
            href={buildWhatsAppUrl(generalEnquiryMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.22em] text-ink-800/70 transition-colors hover:text-bronze-500 dark:text-cream-100/70"
          >
            {WHATSAPP_DISPLAY}
          </a>
          <a
            href={`mailto:${FAITH_EMAIL}?subject=${encodeURIComponent('Enquiry from Happiness Fashion World')}`}
            className="inline-flex min-w-0 max-w-full items-center gap-1.5 break-words text-xs lowercase tracking-wide text-ink-800/70 transition-colors hover:text-bronze-500 dark:text-cream-100/70"
            aria-label={`Email Happiness at ${FAITH_EMAIL}`}
          >
            <Mail size={13} className="shrink-0" />
            <span className="break-all">{FAITH_EMAIL}</span>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink-800/15 transition-colors hover:border-bronze-500 hover:text-bronze-500 dark:border-cream-100/15"
          >
            <Instagram size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
