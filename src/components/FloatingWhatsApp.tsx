import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, generalEnquiryMessage } from '../utils/whatsapp';
import { useNearBottom } from '../utils/scroll';

export default function FloatingWhatsApp() {
  const [scrolled, setScrolled] = useState(false);
  const nearBottom = useNearBottom();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Visible only after the user has scrolled in (so it doesn't crowd the hero)
  // AND when they are NOT near the footer (so it never blocks footer links).
  const visible = scrolled && !nearBottom;

  return (
    <a
      href={buildWhatsAppUrl(generalEnquiryMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Happiness on WhatsApp"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 5rem)' }}
      className={`fixed right-4 z-30 flex items-center gap-2 rounded-full bg-[#25D366] px-3.5 py-2.5 text-xs font-medium text-white shadow-luxe transition-all duration-500 hover:bg-[#1da851] md:!bottom-6 md:right-6 sm:gap-3 sm:px-5 sm:py-3.5 sm:text-sm ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
      </span>
      <MessageCircle size={16} className="sm:h-[18px] sm:w-[18px]" />
      <span className="hidden md:inline">Chat with Happiness</span>
    </a>
  );
}
