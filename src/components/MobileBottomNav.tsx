import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Grid3X3, HelpCircle, Info, Phone, Scissors, Sparkles, X, Menu } from 'lucide-react';

interface Props {
  onOpenLookbook: () => void;
}

const navItems = [
  { id: 'collection', icon: Grid3X3, label: 'Collection', href: '#collections' },
  { id: 'lookbook', icon: BookOpen, label: 'Lookbook', action: true },
  { id: 'stylist', icon: Sparkles, label: 'AI Stylist', href: '#style-quiz' },
  { id: 'contact', icon: Phone, label: 'Contact', href: '#contact' },
  { id: 'more', icon: Menu, label: 'More', action: true },
];

const moreLinks = [
  { icon: Info, label: 'About', href: '#about' },
  { icon: Scissors, label: 'Services', href: '#services' },
  { icon: HelpCircle, label: 'FAQ', href: '#faq' },
];

export default function MobileBottomNav({ onOpenLookbook }: Props) {
  const [moreOpen, setMoreOpen] = useState(false);

  const handleNavClick = (item: (typeof navItems)[number]) => {
    if (item.id === 'lookbook') {
      onOpenLookbook();
    } else if (item.id === 'more') {
      setMoreOpen((v) => !v);
    } else if (item.href) {
      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-20 bg-ink-900/30 backdrop-blur-sm md:hidden"
              onClick={() => setMoreOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-16 z-20 mx-4 mb-2 rounded-2xl border border-ink-800/10 bg-cream-100/98 p-4 shadow-luxe backdrop-blur-lg md:hidden dark:border-cream-100/10 dark:bg-ink-900/98"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-800/60 dark:text-cream-100/60">More</span>
                <button type="button" onClick={() => setMoreOpen(false)} aria-label="Close menu" className="grid h-8 w-8 place-items-center rounded-full bg-ink-800/5 dark:bg-cream-100/5">
                  <X size={14} />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {moreLinks.map(({ icon: Icon, label, href }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={(e) => { e.preventDefault(); setMoreOpen(false); document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-800/80 transition-colors hover:bg-bronze-500/10 hover:text-bronze-500 dark:text-cream-100/80"
                  >
                    <Icon size={18} />
                    {label}
                  </a>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around border-t border-ink-800/10 bg-cream-100/95 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] backdrop-blur-lg md:hidden dark:border-cream-100/10 dark:bg-ink-900/95"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item)}
              className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-ink-800/70 transition-colors active:text-bronze-500 dark:text-cream-100/70"
            >
              <Icon size={20} />
              <span className="text-[9px] font-medium uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
