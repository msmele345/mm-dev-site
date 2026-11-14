"use client";

import {
  useContext,
  useEffect,
  useRef,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { CrescendoContext, CrescendoSetContext } from "@/components/CrescendoProvider";

// Re-export so existing TileMotion imports keep working.
export { CrescendoContext };

const HOLD_DELAY_MS = 350;

export default function ProjectWallMotion({ children }: { children: ReactNode }) {
  const setActiveSlug = useContext(CrescendoSetContext);
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
  );
}
