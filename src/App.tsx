import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import PressStrip from './components/PressStrip';
import Collections from './components/Collections';
import About from './components/About';
import Craftsmanship from './components/Craftsmanship';
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
import SizeGuide from './components/SizeGuide';
import Lookbook from './components/Lookbook';
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
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [lookbookOpen, setLookbookOpen] = useState(false);
  const { customDesigns } = useCustomDesigns();
  const { admin } = useAdminAuth();

  const allDesigns = useMemo(
    () => [...customDesigns, ...staticDesigns],
    [customDesigns]
  );

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
    if (found) setLightboxDesign(found);
  }, [allDesigns]);

  const openLookbook = () => {
    setLookbookOpen(true);
    if (window.location.hash !== '#lookbook') {
      history.replaceState(null, '', window.location.pathname + window.location.search + '#lookbook');
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
    <div className="min-h-screen bg-cream-100 text-ink-800 transition-colors duration-500 dark:bg-ink-900 dark:text-cream-100">
      {/* Admin mode banner — visible only when Happiness is signed in */}
      {admin && (
        <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 bg-bronze-500 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.25em] text-cream-100 sm:text-xs">
          <span className="h-2 w-2 animate-pulse rounded-full bg-cream-100" />
          Edit Mode — tap any text or image to change it
          <button
            type="button"
            onClick={() => {
              setEditingDesign(null);
              setAdminOpen(true);
            }}
            className="ml-3 rounded-full border border-cream-100/40 px-2.5 py-0.5 text-[9px] transition-colors hover:bg-cream-100 hover:text-bronze-600"
          >
            Add Design
          </button>
        </div>
      )}
      <Navbar onOpenLookbook={openLookbook} />
      <main>
        <Hero />
        <Marquee />
        <Collections
          designs={allDesigns}
          highlightIds={quizFilter}
          onOpen={setLightboxDesign}
          onOpenLookbook={openLookbook}
        />
        <PressStrip />
        <About />
        <Craftsmanship />
        <Services />
        <StyleQuiz onResult={(ids) => setQuizFilter(ids)} />
        <Testimonials />
        <Faq onOpenSizeGuide={() => setSizeGuideOpen(true)} />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <Chatbot />
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
        onOpenDesign={(d) => setLightboxDesign(d)}
        onAddNew={openAdminAddNew}
        onEditDesign={openAdminEdit}
      />
      <Suspense fallback={null}>
        <AddDesignPanel
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
  );
}
