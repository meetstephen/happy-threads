import { useEffect, useState } from 'react';
import { BookOpen, Heart, Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAdminAuth } from '../lib/auth';
import Logo from './Logo';

const links = [
  { href: '#collections', label: 'Collection' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#style-quiz', label: 'AI Stylist' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
];

interface Props {
  onOpenLookbook: () => void;
}

export default function Navbar({ onOpenLookbook }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const { admin } = useAdminAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navBg = scrolled
    ? 'bg-cream-100/85 backdrop-blur-lg shadow-soft dark:bg-ink-900/85'
    : 'bg-transparent';

  // When the gold "Edit Mode" admin banner is showing, push the navbar
  // (which holds the brand wordmark) down by the banner's measured height
  // so the wordmark is never covered. The CSS variable is set in App.tsx.
  const navTopStyle = admin ? { top: 'var(--admin-banner-h, 0px)' } : { top: 0 };

  return (
    <header
      style={navTopStyle}
      className={`fixed inset-x-0 z-40 transition-all duration-500 ${navBg}`}
    >
      <div className="container-luxe flex h-20 items-center justify-between">
        <a href="#top" className="group">
          <Logo size={42} withWordmark />
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          <button
            type="button"
            onClick={onOpenLookbook}
            className="relative flex items-center gap-1.5 text-sm font-medium tracking-wide text-ink-800/80 transition-colors hover:text-bronze-500 dark:text-cream-100/80 dark:hover:text-bronze-400"
          >
            <BookOpen size={14} />
            Lookbook
          </button>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-sm font-medium tracking-wide text-ink-800/80 transition-colors hover:text-bronze-500 dark:text-cream-100/80 dark:hover:text-bronze-400"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-800/15 transition-colors hover:border-bronze-500 hover:text-bronze-500 dark:border-cream-100/20"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a
            href="#favorites"
            aria-label="View favorites"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-ink-800/15 transition-colors hover:border-bronze-500 hover:text-bronze-500 dark:border-cream-100/20"
          >
            <Heart size={16} />
            {favorites.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-wine-500 text-[10px] font-medium text-cream-100">
                {favorites.length}
              </span>
            )}
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink-800/15 transition-colors hover:border-bronze-500 hover:text-bronze-500 md:hidden dark:border-cream-100/20"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {open && (
        <div className="md:hidden">
          <div className="mx-5 mb-4 rounded-3xl border border-ink-800/10 bg-cream-100/95 p-6 shadow-luxe backdrop-blur-xl dark:border-cream-100/10 dark:bg-ink-900/95">
            <nav className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onOpenLookbook();
                }}
                className="flex items-center gap-2 text-left font-display text-2xl text-ink-800 transition-colors hover:text-bronze-500 dark:text-cream-100"
              >
                <BookOpen size={20} />
                Lookbook
              </button>
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-2xl text-ink-800 transition-colors hover:text-bronze-500 dark:text-cream-100"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
