"use client";

import type { ReactNode } from "react";
import { useTileMotion } from "./use-tile-motion";

/**
 * Wraps a chameleon tile and publishes its viewport visibility as
 * `data-in-view`, so tile CSS can pause ambient motion off-screen.
 * Kept tiny and tile-agnostic — issue 05 reuses this for the other three
 * tiles. Crescendo stays one-at-a-time by construction: it is driven by
 * `:hover` / `:focus-visible`, which a user can only give to one tile.
 */
export default function TileMotion({ children }: { children: ReactNode }) {
  const { ref, inView } = useTileMotion<HTMLDivElement>();

  return (
    <div ref={ref} className="tile-motion" data-in-view={inView}>
      {children}
    </div>
  );
}
