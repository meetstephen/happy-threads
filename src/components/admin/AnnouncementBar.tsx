import { useState } from 'react';
import { X } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

const SESSION_KEY = 'happy-threads-announcement-dismissed';

export default function AnnouncementBar() {
  const { get } = useSiteContent();
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
  });

  const enabled = get('announcement.enabled', 'false') === 'true';
  const text = get('announcement.text', '');
  const linkUrl = get('announcement.linkUrl', '');
  const linkText = get('announcement.linkText', '');

  if (!enabled || !text.trim() || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch {}
  };

  return (
    <div className="relative z-[55] flex items-center justify-center gap-2 bg-gradient-to-r from-bronze-600 via-gold-500 to-bronze-600 px-8 py-2.5 text-center text-xs font-medium text-cream-100 sm:text-sm">
      <span>{text}</span>
      {linkUrl && linkText && (
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-cream-200">
          {linkText}
        </a>
      )}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-cream-100/80 transition-colors hover:bg-cream-100/15 hover:text-cream-100"
      >
        <X size={12} />
      </button>
    </div>
  );
}
