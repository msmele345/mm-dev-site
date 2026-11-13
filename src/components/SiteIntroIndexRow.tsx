"use client";

import Link from "next/link";
import { useContext, useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { CrescendoSetContext } from "@/components/CrescendoProvider";

/**
 * A Site intro index row that drives its tile's crescendo. Mouse hover and
 * keyboard focus set the shared active slug; touch pointers deliberately do
 * nothing here so a tap navigates as today (ADR 0006).
 */
export default function SiteIntroIndexRow({
  slug,
  href,
  accent,
  children,
}: {
  slug: string;
  href: string;
  accent: string;
  children: ReactNode;
}) {
  const setActiveSlug = useContext(CrescendoSetContext);
  // A real tap fires focus after pointerup; remember that the last pointer was
  // touch so the resulting focus does not activate the tile.
  const lastPointerWasTouch = useRef(false);

  function handlePointerOver(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === "mouse") {
      lastPointerWasTouch.current = false;
      setActiveSlug(slug);
    }
  }

  function handlePointerLeave(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType === "mouse") setActiveSlug(null);
  }

  function handlePointerDown(event: PointerEvent<HTMLAnchorElement>) {
    lastPointerWasTouch.current = event.pointerType !== "mouse";
  }

  function handleFocus() {
    if (lastPointerWasTouch.current) return;
    setActiveSlug(slug);
  }

  function handleBlur() {
    lastPointerWasTouch.current = false;
    setActiveSlug(null);
  }

  return (
    <Link
      href={href}
      style={{ "--project-accent": accent } as CSSProperties}
      onPointerOver={handlePointerOver}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
    </Link>
  );
}
