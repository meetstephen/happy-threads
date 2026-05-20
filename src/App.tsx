import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Collections from './components/Collections';
import About from './components/About';
import Services from './components/Services';
import StyleQuiz from './components/StyleQuiz';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Chatbot from './components/Chatbot';
import AddDesignPanel from './components/AddDesignPanel';
import { designs as staticDesigns } from './data/designs';
import type { Design } from './data/designs';
import { useCustomDesigns } from './context/CustomDesignsContext';

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

  // open admin via #admin URL hash too
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') setAdminOpen(true);
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

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
        <Contact />
      </main>
      <Footer onAdminClick={() => setAdminOpen(true)} />
      <FloatingWhatsApp />
      <Chatbot />
      <Lightbox design={lightboxDesign} onClose={() => setLightboxDesign(null)} />
      <AddDesignPanel
        open={adminOpen}
        onClose={() => {
          setAdminOpen(false);
          if (window.location.hash === '#admin') {
            history.replaceState(null, '', window.location.pathname);
          }
        }}
      />
    </div>
  );
}
