import { motion, useScroll } from 'framer-motion';

/**
 * A thin, fixed reading-progress bar pinned to the top of the viewport.
 * Its transform is written directly by Framer Motion; avoiding a spring keeps
 * it in step with the page and removes an extra animation that continues after
 * every scroll gesture.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: scrollYProgress }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[65] h-[3px] origin-left bg-gradient-to-r from-bronze-600 via-gold-500 to-bronze-400"
    />
  );
}
