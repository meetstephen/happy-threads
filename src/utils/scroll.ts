import { useEffect, useState } from 'react';

/**
 * Returns true when the user has scrolled within `threshold` px of the
 * document's bottom. Used to auto-hide the floating WhatsApp / Chat buttons
 * so they don't cover the footer.
 */
export function useNearBottom(threshold = 180): boolean {
  const [nearBottom, setNearBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      setNearBottom(scrolled >= total - threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [threshold]);

  return nearBottom;
}
