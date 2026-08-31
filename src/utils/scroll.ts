import { useEffect, useState } from 'react';

// ─── Shared scroll signal ───────────────────────────────────────────────────
// Keep one passive, RAF-throttled browser listener. Consumers that only need a
// threshold must subscribe to a boolean condition rather than raw scrollY: a
// finger scroll can generate dozens of frames, while a threshold changes only
// once in either direction.

type ScrollFn = (y: number) => void;
const subscribers = new Set<ScrollFn>();
let currentY = typeof window !== 'undefined' ? window.scrollY : 0;
let framePending = false;

function publishScrollPosition() {
  framePending = false;
  currentY = window.scrollY;
  subscribers.forEach((subscriber) => subscriber(currentY));
}

if (typeof window !== 'undefined') {
  window.addEventListener(
    'scroll',
    () => {
      if (framePending) return;
      framePending = true;
      requestAnimationFrame(publishScrollPosition);
    },
    { passive: true }
  );
}

function isNearDocumentBottom(y: number, threshold: number): boolean {
  if (typeof window === 'undefined') return false;
  return y + window.innerHeight >= document.documentElement.scrollHeight - threshold;
}

/**
 * Returns whether the page has passed a fixed vertical threshold. The component
 * rerenders only when that boolean changes, not on every scroll frame.
 */
export function useScrolledPast(threshold: number): boolean {
  const [past, setPast] = useState(() => currentY > threshold);

  useEffect(() => {
    let previous = window.scrollY > threshold;
    setPast(previous);

    const update = (y: number) => {
      const next = y > threshold;
      if (next === previous) return;
      previous = next;
      setPast(next);
    };

    subscribers.add(update);
    return () => subscribers.delete(update);
  }, [threshold]);

  return past;
}

/**
 * Returns true when the visitor is within `threshold` pixels of the document
 * bottom. It updates only when the answer changes, and also responds to a
 * viewport resize.
 */
export function useNearBottom(threshold = 180): boolean {
  const [nearBottom, setNearBottom] = useState(() =>
    isNearDocumentBottom(currentY, threshold)
  );

  useEffect(() => {
    let previous = isNearDocumentBottom(window.scrollY, threshold);
    setNearBottom(previous);

    const update = (y: number) => {
      const next = isNearDocumentBottom(y, threshold);
      if (next === previous) return;
      previous = next;
      setNearBottom(next);
    };

    const onResize = () => update(window.scrollY);
    subscribers.add(update);
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      subscribers.delete(update);
      window.removeEventListener('resize', onResize);
    };
  }, [threshold]);

  return nearBottom;
}

/**
 * Raw scroll position is retained for future consumers that genuinely need it.
 * Prefer useScrolledPast/useNearBottom for UI visibility so scrolling does not
 * schedule React renders every frame.
 */
export function useScrollY(): number {
  const [y, setY] = useState(currentY);

  useEffect(() => {
    setY(window.scrollY);
    subscribers.add(setY);
    return () => subscribers.delete(setY);
  }, []);

  return y;
}
