import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { X as XIcon } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import PressStrip from './components/PressStrip';
import Collections from './components/Collections';
import About from './components/About';
import Craftsmanship from './components/Craftsmanship';
import Services from './components/Services';
import WhatWeSew from './components/WhatWeSew';
import BookingCTA from './components/BookingCTA';
import StyleQuiz from './components/StyleQuiz';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import Newsletter from './components/Newsletter';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import FloatingIcons from './components/FloatingIcons';
import Chatbot from './components/Chatbot';
import SizeGuide from './components/SizeGuide';
import Lookbook from './components/Lookbook';
import ErrorBoundary from './components/ErrorBoundary';
import MobileBottomNav from './components/MobileBottomNav';
import ScrollToTop from './components/ScrollToTop';
import ScrollProgress from './components/ScrollProgress';
import RecentlyViewed, { recordRecentlyViewed } from './components/RecentlyViewed';
import { designs as staticDesigns } from './data/designs';
import type { Design } from './data/designs';
import { useCustomDesigns } from './context/CustomDesignsContext';
import { useAdminAuth } from './lib/auth';
import { initAnalytics, trackPageView, trackDesignView, trackDesignLike, trackSectionTime } from './services/analytics';
import { useFavorites } from './context/FavoritesContext';

// Admin panel is only opened via the hidden /#admin URL — load on demand
// so the bundle stays small for the 99% of visitors who never see it.
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
import AnnouncementBar from './components/admin/AnnouncementBar';

export default function App() {
  const [lightboxDesign, setLightboxDesign] = useState<Design | null>(null);
  const [quizFilter, setQuizFilter] = useState<string[] | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [lookbookOpen, setLookbookOpen] = useState(false);
  const [bannerHidden, setBannerHidden] = useState(false);
  const { customDesigns } = useCustomDesigns();
  const { admin } = useAdminAuth();
  const { favorites } = useFavorites();
  const prevFavoritesRef = useRef<string[]>(favorites);
  const bannerRef = useRef<HTMLDivElement>(null);

  const allDesigns = useMemo(
    () => [...customDesigns, ...staticDesigns],
    [customDesigns]
  );

  /**
   * Publish the admin banner's measured height to a CSS variable so the
   * fixed Navbar (and anything else that needs to sit below it) can offset
   * itself correctly. Without this, the Navbar's "HAPPINESS FASHION WORLD"
   * wordmark gets covered by the banner because both are pinned to top:0.
   */
  useEffect(() => {
    const root = document.documentElement;
    if (!admin || bannerHidden) {
      root.style.setProperty('--admin-banner-h', '0px');
      return;
    }
    const update = () => {
      const h = bannerRef.current?.offsetHeight ?? 0;
      root.style.setProperty('--admin-banner-h', `${h}px`);
    };
    update();
    let ro: ResizeObserver | null = null;
    if (bannerRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(update);
      ro.observe(bannerRef.current);
    }
    window.addEventListener('resize', update);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', update);
      root.style.setProperty('--admin-banner-h', '0px');
    };
  }, [admin, bannerHidden]);

  // Deep-link hash routing
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') setAdminOpen(true);
      if (window.location.hash === '#size-guide') setSizeGuideOpen(true);
      if (window.location.hash === '#lookbook') setLookbookOpen(true);
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Open lightbox when ?design=HF-XXX deep link is used
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('design');
    if (!id) return;
    const found = allDesigns.find((d) => d.id === id);
    if (found) {
      setLightboxDesign(found);
      trackDesignView(found.id);
    }
  }, [allDesigns]);

  // Analytics: initialize + track page view
  useEffect(() => {
    initAnalytics();
    trackPageView();
  }, []);

  // Analytics: track section visibility time
  useEffect(() => {
    const sectionIds = [
      'top', 'collections', 'about', 'process',
      'services', 'what-we-sew', 'style-quiz', 'testimonials', 'faq', 'contact',
    ];
    const timers = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!id) continue;
          if (entry.isIntersecting) {
            timers.set(id, Date.now());
          } else {
            const start = timers.get(id);
            if (start) {
              const seconds = (Date.now() - start) / 1000;
              trackSectionTime(id, seconds);
              timers.delete(id);
            }
          }
        }
      },
      { threshold: 0.3 }
    );

    // Observe after a short delay so DOM is ready
    const timeout = setTimeout(() => {
      for (const sectionId of sectionIds) {
        const el = document.getElementById(sectionId);
        if (el) observer.observe(el);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
      // Flush remaining section times
      for (const [id, start] of timers.entries()) {
        const seconds = (Date.now() - start) / 1000;
        trackSectionTime(id, seconds);
      }
    };
  }, []);

  // Analytics: track design likes (favorites toggled)
  useEffect(() => {
    const prev = prevFavoritesRef.current;
    // Find newly added favorites
    const added = favorites.filter((id) => !prev.includes(id));
    for (const id of added) {
      trackDesignLike(id);
    }
    prevFavoritesRef.current = favorites;
  }, [favorites]);

  const openLookbook = () => {
    setLookbookOpen(true);
    if (window.location.hash !== '#lookbook') {
      history.replaceState(null, '', window.location.pathname + window.location.search + '#lookbook');
    }
  };

  // Wrapper that also tracks analytics for design views
  const openDesignLightbox = (design: Design | null) => {
    setLightboxDesign(design);
    if (design) {
      trackDesignView(design.id);
      // Remember this piece so it shows in the "Recently Viewed" row.
      recordRecentlyViewed(design.id);
    }
  };

  // From Lookbook: admin clicks "Add design" — close lookbook, open admin panel
  const openAdminAddNew = () => {
    setEditingDesign(null);
    setLookbookOpen(false);
    setAdminOpen(true);
  };

  // From Lookbook: admin clicks edit on one of her custom designs
  const openAdminEdit = (d: Design) => {
    setEditingDesign(d);
    setLookbookOpen(false);
    setAdminOpen(true);
  };

  return (
    <ErrorBoundary>
    <div className="min-h-screen pb-16 md:pb-0 bg-cream-100 text-ink-800 transition-colors duration-500 dark:bg-ink-900 dark:text-cream-100">
      <ScrollProgress />
      <FloatingIcons />
      {/*
        Admin mode banner - visible only when Happiness is signed in.
        It's pinned to the very top with a known height that we publish as
        the `--admin-banner-h` CSS variable so the Navbar can sit cleanly
        below it (otherwise the gold strip would cover the wordmark).
      */}
      {admin && !bannerHidden && (
        <div
          ref={bannerRef}
          className="fixed inset-x-0 top-0 z-[60] flex items-center justify-center gap-2 bg-gradient-to-r from-bronze-600 via-bronze-500 to-bronze-600 px-3 py-1.5 pt-[max(env(safe-area-inset-top,0px),0.375rem)] text-[10px] font-medium uppercase tracking-[0.22em] text-cream-100 shadow-soft sm:gap-3 sm:px-4 sm:text-xs"
        >
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-cream-100" />
          <span className="hidden sm:inline">Edit Mode - tap any text or image to change it</span>
          <span className="sm:hidden">Edit Mode</span>
          <button
            type="button"
            onClick={() => {
              setEditingDesign(null);
              setAdminOpen(true);
            }}
            className="rounded-full border border-cream-100/40 px-2.5 py-0.5 text-[9px] transition-colors hover:bg-cream-100 hover:text-bronze-600 sm:py-0.5"
          >
            Add Design
          </button>
          <button
            type="button"
            onClick={() => setBannerHidden(true)}
            aria-label="Hide edit mode banner"
            className="ml-1 grid h-6 w-6 shrink-0 place-items-center rounded-full text-cream-100/80 transition-colors hover:bg-cream-100/15 hover:text-cream-100"
          >
            <XIcon size={12} />
          </button>
        </div>
      )}
      {/*
        When the banner has been dismissed for this session, show a tiny
        "Edit Mode" pill at the top-right corner so Happiness can still get
        back to the admin panel without losing the indicator that she's
        signed in.
      */}
      {admin && bannerHidden && (
        <button
          type="button"
          onClick={() => setBannerHidden(false)}
          className="fixed right-3 top-[max(env(safe-area-inset-top,0px),0.5rem)] z-[60] inline-flex items-center gap-1.5 rounded-full bg-bronze-500 px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.18em] text-cream-100 shadow-soft transition-transform hover:scale-105"
          title="Show edit-mode banner"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cream-100" />
          Edit
        </button>
      )}
      <Navbar onOpenLookbook={openLookbook} />
      <main>
        <AnnouncementBar />
        <Hero />
        <Marquee />
        <Collections
          designs={allDesigns}
          highlightIds={quizFilter}
          onOpen={openDesignLightbox}
          onOpenLookbook={openLookbook}
        />
        <RecentlyViewed designs={allDesigns} onOpen={openDesignLightbox} />
        <PressStrip />
        <About />
        <Craftsmanship />
        <Services />
        <WhatWeSew />
        <BookingCTA />
        <StyleQuiz onResult={(ids) => setQuizFilter(ids)} />
        <Testimonials />
        <Faq onOpenSizeGuide={() => setSizeGuideOpen(true)} />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <Chatbot />
      <MobileBottomNav onOpenLookbook={openLookbook} />
      <ScrollToTop />
      <Lightbox design={lightboxDesign} onClose={() => setLightboxDesign(null)} />
      <SizeGuide
        open={sizeGuideOpen}
        onClose={() => {
          setSizeGuideOpen(false);
          if (window.location.hash === '#size-guide') {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }}
      />
      <Lookbook
        open={lookbookOpen}
        designs={allDesigns}
        onClose={() => {
          setLookbookOpen(false);
          if (window.location.hash === '#lookbook') {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }}
        onOpenDesign={(d) => openDesignLightbox(d)}
        onAddNew={openAdminAddNew}
        onEditDesign={openAdminEdit}
      />
      <Suspense fallback={null}>
        <AdminDashboard
          open={adminOpen}
          editingDesign={editingDesign}
          onClose={() => {
            setAdminOpen(false);
            setEditingDesign(null);
            if (window.location.hash === '#admin') {
              history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          }}
        />
      </Suspense>
    </div>
    </ErrorBoundary>
  );
}
