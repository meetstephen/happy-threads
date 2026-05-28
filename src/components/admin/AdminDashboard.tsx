import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, BarChart3, BookOpen, CalendarCheck, ChevronUp, Cloud, CloudOff, Eye, EyeOff, Home, Image, Layout, LogOut, Megaphone, MessageSquare, MoreHorizontal, Quote, Settings, ShieldCheck, Star, Users, X } from 'lucide-react';
import { useCustomDesigns } from '../../context/CustomDesignsContext';
import { hasAdminConfigured, useAdminAuth } from '../../lib/auth';
import { ADMIN_EMAIL, isSupabaseEnabled } from '../../lib/supabase';
import type { Design } from '../../data/designs';
import AdminHome from './AdminHome';
import AdminImages from './AdminImages';
import AdminSiteCopy from './AdminSiteCopy';
import AdminLookbook from './AdminLookbook';
import AdminFeatured from './AdminFeatured';
import AdminAnnouncements from './AdminAnnouncements';
import AdminTestimonials from './AdminTestimonials';
import AdminAnalytics from './AdminAnalytics';
import AdminTemplates from './AdminTemplates';
import AdminBookings from './AdminBookings';
import AdminCustomers from './AdminCustomers';
import AdminSite from './AdminSite';

interface Props { open: boolean; onClose: () => void; editingDesign?: Design | null; }

type Section = 'home' | 'images' | 'sitecopy' | 'lookbook' | 'featured' | 'announcements' | 'testimonials' | 'analytics' | 'templates' | 'bookings' | 'customers' | 'site';

const LOCAL_PASSCODE = (import.meta.env.VITE_ADMIN_PASSCODE as string | undefined)?.trim() || '';
const ATTEMPT_KEY = 'hfw-admin-attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 300000;

interface AttemptState { count: number; lockedUntil: number | null; }
function getAttempts(): AttemptState { try { const r = sessionStorage.getItem(ATTEMPT_KEY); return r ? JSON.parse(r) : { count: 0, lockedUntil: null }; } catch { return { count: 0, lockedUntil: null }; } }
function setAttempts(s: AttemptState) { try { sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify(s)); } catch {} }

const SIDEBAR_ITEMS: { section: Section; label: string; icon: typeof Home }[] = [
  { section: 'home', label: 'Home', icon: Home },
  { section: 'images', label: 'Images', icon: Image },
  { section: 'sitecopy', label: 'Site Copy', icon: Layout },
  { section: 'lookbook', label: 'Lookbook', icon: BookOpen },
  { section: 'featured', label: 'Featured', icon: Star },
  { section: 'announcements', label: 'Announcements', icon: Megaphone },
  { section: 'testimonials', label: 'Testimonials', icon: Quote },
  { section: 'analytics', label: 'Analytics', icon: BarChart3 },
  { section: 'templates', label: 'Templates', icon: MessageSquare },
  { section: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { section: 'customers', label: 'Customers', icon: Users },
  { section: 'site', label: 'Site', icon: Settings },
];

const BOTTOM_TABS: Section[] = ['home', 'images', 'lookbook', 'analytics'];
const MORE_SECTIONS: Section[] = ['sitecopy', 'featured', 'announcements', 'testimonials', 'templates', 'bookings', 'customers', 'site'];

export default function AdminDashboard({ open, onClose, editingDesign }: Props) {
  const { cloudEnabled, loading } = useCustomDesigns();
  const auth = useAdminAuth();
  const [section, setSection] = useState<Section>('home');
  const [moreOpen, setMoreOpen] = useState(false);
  const [localUnlocked, setLocalUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState(ADMIN_EMAIL ?? '');
  const [authPassword, setAuthPassword] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const cloudReady = isSupabaseEnabled && hasAdminConfigured();
  const unlocked = cloudReady ? auth.admin !== null : localUnlocked;

  useEffect(() => { if (open && editingDesign) { setSection('lookbook'); } }, [open, editingDesign]);

  useEffect(() => { if (!open) { setLocalUnlocked(false); setPasscode(''); setError(null); setInfo(null); setMoreOpen(false); } }, [open]);

  useEffect(() => { if (!open) return; const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', h); document.body.style.overflow = 'hidden'; return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; }; }, [open, onClose]);

  useEffect(() => { const iv = setInterval(() => { const s = getAttempts(); if (s.lockedUntil) { const r = s.lockedUntil - Date.now(); if (r <= 0) { setAttempts({ count: 0, lockedUntil: null }); setLockoutRemaining(0); setError(null); } else { setLockoutRemaining(r); } } else { setLockoutRemaining(0); } }, 1000); return () => clearInterval(iv); }, []);

  const tryPasscode = (e: React.FormEvent) => { e.preventDefault(); const s = getAttempts(); if (s.lockedUntil && s.lockedUntil > Date.now()) { setError('Too many attempts. Wait 5 minutes.'); return; } if (passcode.trim() === LOCAL_PASSCODE) { setLocalUnlocked(true); setError(null); setAttempts({ count: 0, lockedUntil: null }); } else { const nc = s.count + 1; if (nc >= MAX_ATTEMPTS) { setAttempts({ count: nc, lockedUntil: Date.now() + LOCKOUT_MS }); setError('Too many attempts. Locked for 5 minutes.'); } else { setAttempts({ count: nc, lockedUntil: null }); setError(`Incorrect. ${MAX_ATTEMPTS - nc} attempt${MAX_ATTEMPTS - nc === 1 ? '' : 's'} left.`); } } };

  const onAuthSubmit = async (e: React.FormEvent) => { e.preventDefault(); setError(null); setInfo(null); setAuthBusy(true); try { if (authMode === 'signin') { await auth.signIn(authEmail, authPassword); } else { const { needsConfirmation } = await auth.signUp(authEmail, authPassword); if (needsConfirmation) setInfo('Check email for confirmation link.'); } } catch (err) { setError((err as Error).message); } finally { setAuthBusy(false); setAuthPassword(''); } };

  const navigate = (s: Section) => { setSection(s); setMoreOpen(false); };

  const handleClose = () => { onClose(); if (window.location.hash === '#admin') { history.replaceState(null, '', window.location.pathname + window.location.search); } };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-stretch justify-center bg-ink-900/85 backdrop-blur-md sm:items-center sm:p-4" onClick={handleClose}>
          <motion.div initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} onClick={e => e.stopPropagation()} className="relative flex h-[100dvh] w-full max-w-5xl flex-col overflow-hidden bg-cream-100 shadow-luxe sm:h-auto sm:max-h-[92vh] sm:rounded-3xl dark:bg-ink-800">
            {/* Close button */}
            <button type="button" onClick={handleClose} aria-label="Close" className="absolute right-3 top-[max(env(safe-area-inset-top,0),0.75rem)] z-20 grid h-11 w-11 place-items-center rounded-full bg-cream-100/95 text-ink-800 shadow-soft backdrop-blur-md sm:hidden dark:bg-ink-900/95 dark:text-cream-100"><X size={20} /></button>

            {!unlocked ? (
              /* AUTH SCREEN */
              <div className="flex h-full flex-col overflow-y-auto p-6 pt-[max(env(safe-area-inset-top,0),2rem)] sm:p-10">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-bronze-400/20 text-bronze-500"><ShieldCheck size={20} /></div>
                <h3 className="mt-5 font-display text-2xl leading-tight sm:text-4xl">{cloudReady ? (authMode === 'signin' ? 'Atelier sign in' : 'Create account') : 'Enter passcode'}</h3>
                <p className="mt-2 text-sm text-ink-800/65 dark:text-cream-100/65">{cloudReady ? 'Sign in with the admin email.' : 'Enter your admin passcode to continue.'}</p>
                {error && <p className="mt-4 rounded-2xl border border-wine-500/30 bg-wine-500/10 p-3 text-sm text-wine-500">{error}</p>}
                {info && <p className="mt-4 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-3 text-sm text-[#1da851]">{info}</p>}
                {cloudReady ? (
                  <form onSubmit={onAuthSubmit} className="mt-6 space-y-3">
                    <div><label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">Email</label><input type="email" autoFocus value={authEmail} onChange={e => setAuthEmail(e.target.value)} className="w-full rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" required /></div>
                    <div><label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-ink-800/70 dark:text-cream-100/70">Password</label><div className="relative"><input type={showPw ? 'text' : 'password'} value={authPassword} onChange={e => setAuthPassword(e.target.value)} className="w-full rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 pr-12 text-base focus:border-bronze-500 focus:outline-none dark:border-cream-100/20 dark:bg-ink-900" required minLength={6} /><button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-ink-800/55 hover:text-bronze-500 dark:text-cream-100/55">{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
                    <button type="submit" disabled={authBusy || auth.loading} className="btn-primary w-full disabled:opacity-50">{authBusy ? 'Please wait...' : authMode === 'signin' ? 'Sign in' : 'Create account'}</button>
                    <button type="button" onClick={() => { setAuthMode(m => m === 'signin' ? 'signup' : 'signin'); setError(null); }} className="text-xs text-bronze-500 hover:underline">{authMode === 'signin' ? 'Need an account? Sign up' : 'Already have one? Sign in'}</button>
                  </form>
                ) : (
                  <form onSubmit={tryPasscode} className="mt-6 space-y-3">
                    <input type="password" autoFocus value={passcode} onChange={e => setPasscode(e.target.value)} placeholder="Admin passcode" disabled={lockoutRemaining > 0} className="w-full rounded-2xl border border-ink-800/15 bg-cream-50 px-4 py-3.5 text-base focus:border-bronze-500 focus:outline-none disabled:opacity-50 dark:border-cream-100/20 dark:bg-ink-900" />
                    <button type="submit" disabled={lockoutRemaining > 0} className="btn-primary w-full disabled:opacity-50">{lockoutRemaining > 0 ? `Locked (${Math.ceil(lockoutRemaining / 1000)}s)` : 'Unlock'}</button>
                  </form>
                )}
              </div>
            ) : (
              /* MAIN DASHBOARD */
              <div className="flex h-full min-h-0 flex-1">
                {/* Desktop sidebar */}
                <aside className="hidden w-56 shrink-0 flex-col border-r border-ink-800/10 sm:flex dark:border-cream-100/10">
                  <div className="flex items-center gap-2 border-b border-ink-800/10 px-4 py-4 dark:border-cream-100/10">
                    <button type="button" onClick={handleClose} className="inline-flex items-center gap-1.5 text-xs font-medium text-bronze-500 hover:underline"><ArrowLeft size={14} /> Back to site</button>
                  </div>
                  <nav className="flex-1 overflow-y-auto p-2">
                    {SIDEBAR_ITEMS.map(item => (
                      <button key={item.section} type="button" onClick={() => setSection(item.section)} className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${section === item.section ? 'bg-bronze-400/15 font-medium text-bronze-600 dark:text-bronze-400' : 'text-ink-800/70 hover:bg-cream-200/60 dark:text-cream-100/70 dark:hover:bg-ink-900/60'}`}>
                        <item.icon size={16} /> {item.label}
                      </button>
                    ))}
                  </nav>
                  <div className="border-t border-ink-800/10 p-3 dark:border-cream-100/10">
                    <div className="flex items-center gap-2 text-[11px] text-ink-800/55 dark:text-cream-100/55">{cloudEnabled ? <Cloud size={12} className="text-[#25D366]" /> : <CloudOff size={12} />}{cloudEnabled ? 'Cloud' : 'Local'}{loading && ' ...'}</div>
                    {cloudReady && auth.admin && (
                      <button type="button" onClick={() => auth.signOut()} className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-ink-800/50 hover:text-wine-500 dark:text-cream-100/50"><LogOut size={12} /> Sign out</button>
                    )}
                  </div>
                </aside>

                {/* Content area */}
                <div className="flex min-w-0 flex-1 flex-col">
                  {/* Mobile header */}
                  <header className="flex shrink-0 items-center justify-between border-b border-ink-800/10 px-4 py-3 sm:hidden dark:border-cream-100/10">
                    <button type="button" onClick={handleClose} className="inline-flex items-center gap-1.5 text-xs font-medium text-bronze-500"><ArrowLeft size={14} /> Back</button>
                    <div className="flex items-center gap-2">
                      {cloudEnabled ? <Cloud size={14} className="text-[#25D366]" /> : <CloudOff size={14} className="text-ink-800/40 dark:text-cream-100/40" />}
                      {cloudReady && auth.admin && <button type="button" onClick={() => auth.signOut()} className="grid h-8 w-8 place-items-center rounded-full border border-ink-800/15 text-ink-800/60 dark:border-cream-100/20 dark:text-cream-100/60"><LogOut size={13} /></button>}
                    </div>
                  </header>

                  {/* Section content */}
                  <div className="flex-1 overflow-y-auto px-4 py-5 pb-24 sm:px-6 sm:py-6 sm:pb-6 md:px-8">
                    {section === 'home' && <AdminHome onNavigate={navigate} />}
                    {section === 'images' && <AdminImages />}
                    {section === 'sitecopy' && <AdminSiteCopy />}
                    {section === 'lookbook' && <AdminLookbook editingDesign={editingDesign} />}
                    {section === 'featured' && <AdminFeatured />}
                    {section === 'announcements' && <AdminAnnouncements />}
                    {section === 'testimonials' && <AdminTestimonials />}
                    {section === 'analytics' && <AdminAnalytics />}
                    {section === 'templates' && <AdminTemplates />}
                    {section === 'bookings' && <AdminBookings />}
                    {section === 'customers' && <AdminCustomers />}
                    {section === 'site' && <AdminSite />}
                  </div>

                  {/* Mobile bottom tabs */}
                  <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-ink-800/10 bg-cream-100/95 pb-[max(env(safe-area-inset-bottom,0),0.25rem)] pt-1.5 backdrop-blur-md sm:hidden dark:border-cream-100/10 dark:bg-ink-800/95">
                    {BOTTOM_TABS.map(tab => { const item = SIDEBAR_ITEMS.find(i => i.section === tab)!; return (
                      <button key={tab} type="button" onClick={() => navigate(tab)} className={`flex min-w-[44px] flex-col items-center gap-0.5 px-2 py-1 ${section === tab ? 'text-bronze-500' : 'text-ink-800/50 dark:text-cream-100/50'}`}><item.icon size={20} /><span className="text-[9px] uppercase tracking-[0.15em]">{item.label}</span></button>
                    ); })}
                    <button type="button" onClick={() => setMoreOpen(true)} className={`flex min-w-[44px] flex-col items-center gap-0.5 px-2 py-1 ${MORE_SECTIONS.includes(section) ? 'text-bronze-500' : 'text-ink-800/50 dark:text-cream-100/50'}`}><MoreHorizontal size={20} /><span className="text-[9px] uppercase tracking-[0.15em]">More</span></button>
                  </nav>
                </div>
              </div>
            )}

            {/* More menu overlay (mobile) */}
            <AnimatePresence>
              {moreOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-ink-900/60 sm:hidden" onClick={() => setMoreOpen(false)}>
                  <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} onClick={e => e.stopPropagation()} className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-cream-100 pb-[max(env(safe-area-inset-bottom,0),1rem)] dark:bg-ink-800">
                    <div className="flex items-center justify-center py-3"><div className="h-1 w-10 rounded-full bg-ink-800/20 dark:bg-cream-100/20" /></div>
                    <div className="grid grid-cols-4 gap-2 px-4 pb-4">
                      {MORE_SECTIONS.map(s => { const item = SIDEBAR_ITEMS.find(i => i.section === s)!; return (
                        <button key={s} type="button" onClick={() => navigate(s)} className={`flex flex-col items-center gap-1.5 rounded-2xl p-3 transition-colors ${section === s ? 'bg-bronze-400/15 text-bronze-500' : 'text-ink-800/60 hover:bg-cream-200/60 dark:text-cream-100/60'}`}><item.icon size={20} /><span className="text-[9px] uppercase tracking-[0.15em]">{item.label}</span></button>
                      ); })}
                    </div>
                    <button type="button" onClick={() => setMoreOpen(false)} className="mx-4 flex w-[calc(100%-2rem)] items-center justify-center gap-1.5 rounded-2xl border border-ink-800/15 py-3 text-xs font-medium uppercase tracking-[0.18em] dark:border-cream-100/20"><ChevronUp size={14} /> Close</button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
