import { useEffect, useState } from 'react';

// ─── Singleton scroll listener (RAF-throttled) ─────────────────────────────
// ONE global passive listener feeds every hook consumer via a subscriber set.
// No matter how many components call useScrollY / useNearBottom, the browser
// fires exactly one scroll listener and one rAF callback per animation frame.
//
// Before this change: 5 separate window.scroll listeners (Navbar, FloatingWhatsApp ×2,
// ScrollToTop, Chatbot via useNearBottom) each called setState on every scroll event,
// causing a waterfall of React re-renders that manifested as visual instability.

type ScrollFn = (y: number) => void;
const _subs = new Set<ScrollFn>();
let _y = typeof window !== 'undefined' ? window.scrollY : 0;
let _pending = false;

function _tick() {
  _pending = false;
  _y = window.scrollY;
  // React 18 automatic batching: all setState calls inside a rAF callback
  // are batched into ONE render cycle, so N components = 1 render pass.
  _subs.forEach((fn) => fn(_y));
}

if (typeof window !== 'undefined') {
  window.addEventListener(
    'scroll',
    () => {
      if (_pending) return;
      _pending = true;
      requestAnimationFrame(_tick);
    },
    { passive: true }
  );
}

// ─── Hooks ─────────────────────────────────────────────────────────────────

/**
 * Returns window.scrollY, updated at most once per animation frame via the
 * shared singleton listener. All scroll-dependent components must use this
 * instead of their own window.scroll event listeners.
 */
export function useScrollY(): number {
  const [y, setY] = useState(_y);

  useEffect(() => {
    // Sync immediately in case a scroll happened before this component mounted.
    setY(window.scrollY);
    _subs.add(setY);
    return () => {
      _subs.delete(setY);
    };
  }, []);

  return y;
}

/**
 * Returns true when the user has scrolled within `threshold` px of the
 * document's bottom. Used to auto-hide floating buttons near the footer.
 */
export function useNearBottom(threshold = 180): boolean {
  const y = useScrollY();
  if (typeof window === 'undefined') return false;
  return y + window.innerHeight >= document.documentElement.scrollHeight - threshold;
}
