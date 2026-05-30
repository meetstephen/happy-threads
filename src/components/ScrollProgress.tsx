import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * A thin, fixed reading-progress bar pinned to the very top of the viewport.
 * It fills left-to-right as the visitor scrolls the page, using the house
 * bronze/gold gradient so it feels like part of the luxury palette.
 *
 * Notes:
 *  - `pointer-events-none` so it never intercepts taps/clicks on the content
 *    or the Navbar sitting just beneath it.
 *  - z-index sits above the Navbar, AnnouncementBar and the admin "Edit Mode"
 *    banner so the indicator is always visible at the very top edge without
 *    visually fighting them (it's only ~3px tall).
 *  - `useSpring` smooths the motion so the fill glides rather than jumps.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[65] h-[3px] origin-left bg-gradient-to-r from-bronze-600 via-gold-500 to-bronze-400"
    />
  );
}
