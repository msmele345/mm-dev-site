"use client";

import { useContext, type ReactNode } from "react";
import { CrescendoContext } from "./ProjectWallMotion";
import { useTileMotion } from "./use-tile-motion";

/**
 * Wraps a chameleon tile and publishes its viewport visibility as
 * `data-in-view`, so tile CSS can pause ambient motion off-screen.
 * Kept tiny and tile-agnostic — issue 05 reuses this for all four tiles.
 * ProjectWallMotion owns the single active slug across hover, focus, and
 * tap-and-hold; this wrapper publishes that state for tile CSS.
 */
export default function TileMotion({
  children,
  slug,
}: {
  children: ReactNode;
  slug: string;
}) {
  const { ref, inView } = useTileMotion<HTMLDivElement>();
  const activeSlug = useContext(CrescendoContext);

  return (
    <div
      ref={ref}
      className="tile-motion"
      data-crescendo={activeSlug === slug}
      data-in-view={inView}
      data-tile-slug={slug}
    >
      {children}
    </div>
  );
}
