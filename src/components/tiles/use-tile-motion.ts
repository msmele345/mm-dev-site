"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Motion-state primitive shared by every chameleon tile (ADR 0006).
 *
 * Static vs ambient vs crescendo is pure CSS (`prefers-reduced-motion`,
 * `:hover`, `:focus-visible`); the only JavaScript a tile needs is this
 * IntersectionObserver, which flips `inView` so CSS can pause ambient
 * animation while the tile is off-screen and resume on re-entry.
 */
export function useTileMotion<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  // Assume off-screen until the observer's first callback proves otherwise,
  // so a below-the-fold tile never animates before it is seen.
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
