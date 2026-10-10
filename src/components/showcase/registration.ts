import type { ComponentType } from "react";
import type { EnrichedProject } from "@/content/projects/enrichment";

export type ShowcasePresentation = {
  slug: string;
  Tile: ComponentType<{ project: EnrichedProject; index: number; displayClassName?: string }>;
  CaseStudyArtwork: ComponentType<{ project: EnrichedProject }>;
};

/** Explicit identities only: callers must never silently omit or substitute art. */
export function createShowcaseRegistry(entries: readonly ShowcasePresentation[]) {
  const registrations = new Map<string, ShowcasePresentation>();
  for (const entry of entries) {
    if (registrations.has(entry.slug)) {
      throw new Error(`Showcase "${entry.slug}": duplicate presentation registration`);
    }
    for (const field of ["Tile", "CaseStudyArtwork"] as const) {
      if (!entry[field]) throw new Error(`Showcase "${entry.slug}": missing ${field}`);
    }
    registrations.set(entry.slug, entry);
  }
  return {
    get(slug: string): ShowcasePresentation {
      const presentation = registrations.get(slug);
      if (!presentation) throw new Error(`Showcase "${slug}": missing presentation registration`);
      return presentation;
    },
  };
}
