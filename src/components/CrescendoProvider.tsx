"use client";

import { createContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

/**
 * Shared active-tile state for the opening view. Both the Site intro index
 * rows and the Project wall tiles read and write the same `activeSlug`, so
 * only one tile crescendos at a time no matter which surface the pointer or
 * focus is on. See ADR 0006.
 */
export const CrescendoContext = createContext<string | null>(null);
export const CrescendoSetContext = createContext<Dispatch<SetStateAction<string | null>>>(() => {
  throw new Error("CrescendoSetContext used outside CrescendoProvider");
});

export default function CrescendoProvider({ children }: { children: ReactNode }) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  return (
    <CrescendoSetContext.Provider value={setActiveSlug}>
      <CrescendoContext.Provider value={activeSlug}>{children}</CrescendoContext.Provider>
    </CrescendoSetContext.Provider>
  );
}
