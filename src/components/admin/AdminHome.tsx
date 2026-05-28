import {
  BarChart3,
  BookOpen,
  CalendarCheck,
  Image,
  Layout,
  MessageSquare,
  Megaphone,
  Quote,
  Settings,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { useCustomDesigns } from '../../context/CustomDesignsContext';

type Section =
  | 'home'
  | 'images'
  | 'sitecopy'
  | 'lookbook'
  | 'featured'
  | 'announcements'
  | 'testimonials'
  | 'analytics'
  | 'templates'
  | 'bookings'
  | 'customers'
  | 'site';

interface Props {
  onNavigate: (section: Section) => void;
}

const operationsTiles: { section: Section; label: string; icon: typeof BarChart3; desc: string }[] = [
  { section: 'bookings', label: 'Bookings', icon: CalendarCheck, desc: 'Track fittings & appointments' },
  { section: 'customers', label: 'Customers', icon: Users, desc: 'Client directory & measurements' },
  { section: 'templates', label: 'WhatsApp Templates', icon: MessageSquare, desc: 'Quick message templates' },
];

const contentTiles: { section: Section; label: string; icon: typeof BarChart3; desc: string }[] = [
  { section: 'images', label: 'Images', icon: Image, desc: 'Manage site images' },
  { section: 'sitecopy', label: 'Site Copy', icon: Layout, desc: 'Edit text content' },
  { section: 'lookbook', label: 'Lookbook', icon: BookOpen, desc: 'Add & remove designs' },
  { section: 'featured', label: 'Featured', icon: Star, desc: 'Hero & featured designs' },
  { section: 'announcements', label: 'Announcements', icon: Megaphone, desc: 'Top bar announcement' },
  { section: 'testimonials', label: 'Testimonials', icon: Quote, desc: 'Manage client reviews' },
];

export default function AdminHome({ onNavigate }: Props) {
  const { customDesigns, cloudEnabled } = useCustomDesigns();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <p className="eyebrow flex items-center gap-2">
          <Sparkles size={12} className="text-bronze-500" />
          Welcome back
        </p>
        <h2 className="mt-2 font-display text-2xl leading-tight sm:text-3xl">Atelier Dashboard</h2>
        <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">
          Manage every conversation, every commission, every page from one place.
        </p>
      </div>

      {/* Quick stats */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-2xl border border-ink-800/10 bg-cream-50 px-4 py-2.5 text-sm dark:border-cream-100/10 dark:bg-ink-900">
          <BookOpen size={14} className="text-bronze-500" />
          <span className="font-medium">{customDesigns.length}</span>
          <span className="text-ink-800/60 dark:text-cream-100/60">designs</span>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border border-ink-800/10 bg-cream-50 px-4 py-2.5 text-sm dark:border-cream-100/10 dark:bg-ink-900">
          <Settings size={14} className={cloudEnabled ? 'text-[#25D366]' : 'text-ink-800/40 dark:text-cream-100/40'} />
          <span className="text-ink-800/60 dark:text-cream-100/60">{cloudEnabled ? 'Cloud synced' : 'Local only'}</span>
        </div>
      </div>

      {/* Operations tiles */}
      <div>
        <p className="eyebrow mb-3">Operations</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {operationsTiles.map((tile) => (
            <button
              key={tile.section}
              type="button"
              onClick={() => onNavigate(tile.section)}
              className="flex items-start gap-3 rounded-2xl border border-ink-800/10 bg-cream-50 p-4 text-left transition-colors hover:border-bronze-500 active:scale-[0.98] dark:border-cream-100/10 dark:bg-ink-900"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-bronze-400/15 text-bronze-500">
                <tile.icon size={18} />
              </div>
              <div className="min-w-0">
                <div className="font-medium">{tile.label}</div>
                <div className="mt-0.5 text-xs text-ink-800/55 dark:text-cream-100/55">{tile.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content tiles */}
      <div>
        <p className="eyebrow mb-3">Content</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {contentTiles.map((tile) => (
            <button
              key={tile.section}
              type="button"
              onClick={() => onNavigate(tile.section)}
              className="flex items-start gap-3 rounded-2xl border border-ink-800/10 bg-cream-50 p-4 text-left transition-colors hover:border-bronze-500 active:scale-[0.98] dark:border-cream-100/10 dark:bg-ink-900"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-bronze-400/15 text-bronze-500">
                <tile.icon size={18} />
              </div>
              <div className="min-w-0">
                <div className="font-medium">{tile.label}</div>
                <div className="mt-0.5 text-xs text-ink-800/55 dark:text-cream-100/55">{tile.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
