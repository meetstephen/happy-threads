import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Collections from './components/Collections';
import About from './components/About';
import Services from './components/Services';
import StyleQuiz from './components/StyleQuiz';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import Newsletter from './components/Newsletter';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Chatbot from './components/Chatbot';
import { designs as staticDesigns } from './data/designs';
import type { Design } from './data/designs';
import { useCustomDesigns } from './context/CustomDesignsContext';
import { useAdminAuth } from './lib/auth';

// Admin panel is only opened via the hidden /#admin URL — load on demand
// so the bundle stays small for the 99% of visitors who never see it.
const AddDesignPanel = lazy(() => import('./components/AddDesignPanel'));

export default function App() {
  const [lightboxDesign, setLightboxDesign] = useState<Design | null>(null);
  const [quizFilter, setQuizFilter] = useState<string[] | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const { customDesigns } = useCustomDesigns();
  const { admin } = useAdminAuth();

  // merge: custom first (newest), then static catalog
  const allDesigns = useMemo(
    () => [...customDesigns, ...staticDesigns],
    [customDesigns]
  );

  // Open admin only when URL hash is #admin (no UI surface — Happiness
  // bookmarks the URL on her phone). This way visitors never see an
  // admin entry point.
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') setAdminOpen(true);
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
    if (found) setLightboxDesign(found);
  }, [allDesigns]);

  return (
    <div className="min-h-screen bg-cream-100 text-ink-800 transition-colors duration-500 dark:bg-ink-900 dark:text-cream-100">
      {/* Admin mode banner — visible only when Happiness is signed in */}
      {admin && (
        <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 bg-bronze-500 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-cream-100 sm:text-xs">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cream-100" />
          Edit Mode — tap any text or image to change it
          <button
            type="button"
            onClick={() => setAdminOpen(true)}
            className="ml-3 rounded-full border border-cream-100/40 px-2.5 py-0.5 text-[9px] transition-colors hover:bg-cream-100 hover:text-bronze-600"
          >
            Add Design
          </button>
        </div>
      )}
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Collections
          designs={allDesigns}
          highlightIds={quizFilter}
          onOpen={setLightboxDesign}
        />
        <About />
        <Services />
        <StyleQuiz onResult={(ids) => setQuizFilter(ids)} />
        <Testimonials />
        <Faq />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <Chatbot />
      <Lightbox design={lightboxDesign} onClose={() => setLightboxDesign(null)} />
      <Suspense fallback={null}>
        <AddDesignPanel
          open={adminOpen}
          onClose={() => {
            setAdminOpen(false);
            if (window.location.hash === '#admin') {
              history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          }}
        />
      </Suspense>
    </div>
  );
}
