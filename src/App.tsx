import { useState } from 'react';
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
import { designs } from './data/designs';
import type { Design } from './data/designs';

export default function App() {
  const [lightboxDesign, setLightboxDesign] = useState<Design | null>(null);
  const [quizFilter, setQuizFilter] = useState<string[] | null>(null);

  return (
    <div className="min-h-screen bg-cream-100 text-ink-800 transition-colors duration-500 dark:bg-ink-900 dark:text-cream-100">
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Collections
          designs={designs}
          highlightIds={quizFilter}
          onOpen={setLightboxDesign}
        />
        <About />
        <Services />
        <StyleQuiz onResult={(ids) => setQuizFilter(ids)} />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <Lightbox design={lightboxDesign} onClose={() => setLightboxDesign(null)} />
    </div>
  );
}
