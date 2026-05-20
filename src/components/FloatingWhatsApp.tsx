import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, generalEnquiryMessage } from '../utils/whatsapp';

export default function FloatingWhatsApp() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href={buildWhatsAppUrl(generalEnquiryMessage())}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Happiness on WhatsApp"
      className={`fixed bottom-6 right-6 z-30 flex items-center gap-3 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-medium text-white shadow-luxe transition-all duration-500 hover:bg-[#1da851] ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
    >
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
      </span>
      <MessageCircle size={18} />
      <span className="hidden sm:inline">Chat with Happiness</span>
    </a>
  );
}
