"use client";

import {
  createContext,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

export const CrescendoContext = createContext<string | null>(null);

const HOLD_DELAY_MS = 350;

export default function ProjectWallMotion({ children }: { children: ReactNode }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    },
    [],
  );

  function slugFrom(target: EventTarget | null) {
    return target instanceof Element
      ? target.closest<HTMLElement>("[data-tile-slug]")?.dataset.tileSlug ?? null
      : null;
  }

  function cancelHold() {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
  }

  function handlePointerOver(event: PointerEvent<HTMLUListElement>) {
    if (event.pointerType === "mouse") setActiveSlug(slugFrom(event.target));
  }

  function handlePointerDown(event: PointerEvent<HTMLUListElement>) {
    if (event.pointerType === "mouse") return;
    const slug = slugFrom(event.target);
    if (!slug) return;
    cancelHold();
    holdTimer.current = setTimeout(() => setActiveSlug(slug), HOLD_DELAY_MS);
  }

  function handleFocus(event: FocusEvent<HTMLUListElement>) {
    setActiveSlug(slugFrom(event.target));
  }

  function handleBlur(event: FocusEvent<HTMLUListElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setActiveSlug(null);
  }

  return (
    <CrescendoContext.Provider value={activeSlug}>
      <ul
        className="project-wall__grid"
        onBlurCapture={handleBlur}
        onFocusCapture={handleFocus}
        onPointerCancel={() => { cancelHold(); setActiveSlug(null); }}
        onPointerDown={handlePointerDown}
        onPointerLeave={() => { cancelHold(); setActiveSlug(null); }}
        onPointerOver={handlePointerOver}
        onPointerUp={() => { cancelHold(); setActiveSlug(null); }}
      >
        {children}
      </ul>
    </CrescendoContext.Provider>
  );
}
