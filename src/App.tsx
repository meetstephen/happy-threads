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

// Admin panel is only opened via the hidden /#admin URL — load on demand
// so the bundle stays small for the 99% of visitors who never see it.
const AddDesignPanel = lazy(() => import('./components/AddDesignPanel'));

export default function App() {
  const [lightboxDesign, setLightboxDesign] = useState<Design | null>(null);
  const [quizFilter, setQuizFilter] = useState<string[] | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const { customDesigns } = useCustomDesigns();

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
