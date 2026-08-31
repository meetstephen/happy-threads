import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useScrolledPast } from '../utils/scroll';

export default function ScrollToTop() {
  const visible = useScrolledPast(400);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          className="fixed bottom-[calc(9rem+env(safe-area-inset-bottom,0px))] right-4 z-30 grid h-10 w-10 place-items-center rounded-full bg-ink-800 text-cream-100 shadow-lg transition-colors hover:bg-bronze-500 md:bottom-24 md:right-6 dark:bg-cream-100 dark:text-ink-900"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
