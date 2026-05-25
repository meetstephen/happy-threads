import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Send, Sparkles, X, Zap } from 'lucide-react';
import { generateReply, initialMessages, userMessage, type BotMessage } from '../utils/chatbot';
import { chatWithGemini, isGeminiEnabled, type GeminiMessage } from '../services/geminiChat';
import { useCustomDesigns } from '../context/CustomDesignsContext';
import { designs as staticDesigns } from '../data/designs';
import { useNearBottom } from '../utils/scroll';
import { buildWhatsAppUrl, generalEnquiryMessage } from '../utils/whatsapp';

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<BotMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { customDesigns } = useCustomDesigns();
  const nearBottom = useNearBottom();
  const launcherVisible = open || !nearBottom;

  // Gemini conversation history (persists across messages in this session)
  const geminiHistory = useRef<GeminiMessage[]>([]);

  const allDesigns = useMemo(
    () => [...customDesigns, ...staticDesigns],
    [customDesigns]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => setUnread(true), 8000);
    return () => clearTimeout(t);
  }, [open]);

  const sendText = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, userMessage(trimmed)]);
    setInput('');
    setTyping(true);

    try {
      if (isGeminiEnabled) {
        // Use real AI
        const { reply, updatedHistory } = await chatWithGemini(
          trimmed,
          geminiHistory.current,
          allDesigns
        );
        geminiHistory.current = updatedHistory;

        // Check if Gemini mentioned a design by reference ID — show the card
        const mentionedDesign = allDesigns.find(
          (d) => reply.includes(d.id) || reply.toLowerCase().includes(d.name.toLowerCase())
        );

        const botMsg: BotMessage = {
          id: makeId(),
          from: 'bot',
          text: reply,
          design: mentionedDesign,
          // Add WhatsApp CTA if the reply mentions ordering or WhatsApp
          cta: /whatsapp|wa\.me|order|book/i.test(reply)
            ? {
                label: 'Chat with Happiness',
                href: buildWhatsAppUrl(generalEnquiryMessage()),
                external: true,
              }
            : undefined,
        };
        setMessages((m) => [...m, botMsg]);
      } else {
        // Fallback: pattern-matching engine (still solid for basic queries)
        await new Promise((r) =>
          setTimeout(r, Math.min(1400, 600 + trimmed.length * 18))
        );
        const reply = generateReply(trimmed, allDesigns);
        setMessages((m) => [...m, reply]);
      }
    } catch (err) {
      console.warn('[Chatbot] error:', err);
      // On Gemini failure, fallback to pattern matcher for this message
      const reply = generateReply(trimmed, allDesigns);
      setMessages((m) => [...m, reply]);
    } finally {
      setTyping(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendText(input);
  };

  const onChip = (chip: string) => {
    if (chip === 'View Collection') {
      document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
      setOpen(false);
      return;
    }
    if (chip === 'Take Style Quiz') {
      document.getElementById('style-quiz')?.scrollIntoView({ behavior: 'smooth' });
      setOpen(false);
      return;
    }
    sendText(chip);
  };

  const onDesignClick = (id: string) => {
    setOpen(false);
    setTimeout(() => {
      document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
      const el = document.querySelector(`[data-design-id="${id}"]`);
      el?.classList.add('animate-pulse');
      setTimeout(() => el?.classList.remove('animate-pulse'), 2000);
    }, 200);
  };

  return (
    <>
      {/* Launcher */}
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setUnread(false);
        }}
        aria-label="Chat with Joy, Happiness Fashion World's AI stylist"
        className={`fixed bottom-5 left-4 z-30 flex items-center gap-2 rounded-full bg-ink-800 px-3.5 py-2.5 text-xs font-medium text-cream-100 shadow-luxe transition-all duration-500 hover:bg-bronze-500 sm:bottom-6 sm:left-6 sm:gap-2.5 sm:px-5 sm:py-3.5 sm:text-sm dark:bg-cream-100 dark:text-ink-900 dark:hover:bg-bronze-400 ${
          launcherVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
        }`}
      >
        <span className="relative grid h-6 w-6 place-items-center rounded-full bg-bronze-400/30 sm:h-7 sm:w-7">
          <Sparkles size={12} className="text-bronze-400 sm:h-[14px] sm:w-[14px]" />
          {unread && !open && (
            <span className="absolute -right-0.5 -top-0.5 grid h-3 w-3 place-items-center rounded-full bg-wine-500">
              <span className="absolute h-3 w-3 animate-ping rounded-full bg-wine-500 opacity-75" />
            </span>
          )}
        </span>
        <span className="hidden md:inline">{open ? 'Close' : 'Ask Joy (AI)'}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-20 left-4 right-4 z-40 flex h-[min(640px,78vh)] max-w-md flex-col overflow-hidden rounded-3xl border border-ink-800/10 bg-cream-100 shadow-luxe sm:bottom-24 sm:left-6 sm:right-auto sm:w-[400px] dark:border-cream-100/10 dark:bg-ink-800"
          >
            {/* Header */}
            <header className="flex items-center justify-between gap-3 border-b border-ink-800/10 bg-ink-800 p-4 text-cream-100 dark:border-cream-100/10 dark:bg-ink-900">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-bronze-400 to-bronze-600 font-display text-lg italic text-ink-900">
                  J
                </div>
                <div className="leading-tight">
                  <div className="flex items-center gap-2 font-medium">
                    Joy
                    <span className="grid h-2 w-2 place-items-center rounded-full bg-[#25D366]">
                      <span className="absolute h-2 w-2 animate-ping rounded-full bg-[#25D366]/60" />
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-bronze-400">
                    {isGeminiEnabled ? (
                      <>
                        <Zap size={9} /> Gemini AI • Online
                      </>
                    ) : (
                      'AI Stylist • Online'
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid h-9 w-9 place-items-center rounded-full bg-cream-100/10 transition-colors hover:bg-cream-100/20"
              >
                <X size={16} />
              </button>
            </header>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto overscroll-contain p-4" style={{ WebkitOverflowScrolling: 'touch' }}>
              {messages.map((m) => (
                <MessageBubble key={m.id} m={m} onChip={onChip} onDesign={onDesignClick} />
              ))}
              {typing && (
                <div className="flex items-center gap-2 text-ink-800/60 dark:text-cream-100/60">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-bronze-400/20 text-[11px] font-display italic text-bronze-500">
                    J
                  </span>
                  <span className="flex items-center gap-1 rounded-2xl bg-cream-200/60 px-3 py-2 dark:bg-ink-900/60">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-bronze-500 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-bronze-500 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-bronze-500" />
                  </span>
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 border-t border-ink-800/10 p-3 dark:border-cream-100/10"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isGeminiEnabled ? 'Ask Joy anything…' : 'Ask about the collection…'}
                className="flex-1 rounded-full bg-cream-200/50 px-4 py-2.5 text-base focus:outline-none dark:bg-ink-900/60"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Send"
                className="grid h-10 w-10 place-items-center rounded-full bg-ink-800 text-cream-100 transition-colors hover:bg-bronze-500 disabled:opacity-40 dark:bg-cream-100 dark:text-ink-900"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageBubble({
  m,
  onChip,
  onDesign,
}: {
  m: BotMessage;
  onChip: (s: string) => void;
  onDesign: (id: string) => void;
}) {
  if (m.from === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-ink-800 px-4 py-2.5 text-sm text-cream-100 dark:bg-cream-100 dark:text-ink-900">
          {m.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-bronze-400 to-bronze-600 text-[11px] font-display italic text-ink-900">
        J
      </span>
      <div className="max-w-[85%] space-y-2">
        <div className="whitespace-pre-line rounded-2xl rounded-tl-sm bg-cream-200/60 px-4 py-2.5 text-sm leading-relaxed dark:bg-ink-900/60">
          {m.text}
        </div>

        {m.design && (
          <button
            type="button"
            onClick={() => onDesign(m.design!.id)}
            className="group flex w-full items-center gap-3 rounded-2xl border border-ink-800/10 bg-cream-50 p-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-bronze-500 hover:shadow-soft dark:border-cream-100/10 dark:bg-ink-900"
          >
            <img
              src={m.design.image}
              alt={m.design.name}
              className="h-14 w-14 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-sm">{m.design.name}</div>
              <div className="truncate text-[11px] uppercase tracking-[0.18em] text-bronze-500">
                {m.design.category}
              </div>
            </div>
            <ArrowRight size={14} className="text-bronze-500 transition-transform group-hover:translate-x-0.5" />
          </button>
        )}

        {m.cta && (
          <a
            href={m.cta.href}
            target={m.cta.external ? '_blank' : undefined}
            rel={m.cta.external ? 'noopener noreferrer' : undefined}
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#1da851]"
          >
            <MessageCircle size={13} /> {m.cta.label}
          </a>
        )}

        {m.chips && m.chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {m.chips.map((chip) => (
              <button
                type="button"
                key={chip}
                onClick={() => onChip(chip)}
                className="rounded-full border border-bronze-500/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-bronze-600 transition-colors hover:border-bronze-500 hover:bg-bronze-500 hover:text-cream-100 dark:text-bronze-400"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
