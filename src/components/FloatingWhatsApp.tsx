import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, generalEnquiryMessage } from '../utils/whatsapp';
import { useScrollY, useNearBottom } from '../utils/scroll';

export default function FloatingWhatsApp() {
  // Both hooks share the same singleton scroll listener — no extra listeners added.
  const scrollY = useScrollY();
  const nearBottom = useNearBottom();

  // Only visible after scrolling 600 px down, and hidden near the footer
  // so the button never covers the contact section or footer links.
  const visible = scrollY > 600 && !nearBottom;

  const handleClick = () => {
    const url = buildWhatsAppUrl(generalEnquiryMessage());
    const opened = window.open(url, '_blank');
    if (!opened) {
      window.location.href = url;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Chat with Happiness on WhatsApp"
      className={`fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 z-30 flex items-center gap-2 rounded-full bg-[#25D366] px-3.5 py-2.5 text-xs font-medium text-white shadow-luxe transition-[opacity,transform] duration-500 hover:bg-[#1da851] sm:right-6 sm:gap-3 sm:px-5 sm:py-3.5 sm:text-sm ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
      </span>
      <MessageCircle size={16} className="sm:h-[18px] sm:w-[18px]" />
      <span className="hidden md:inline">Chat with Happiness</span>
    </button>
  );
}
