import { elevatedBpm } from "./elevated-bpm";
import {
  siteEnricher,
  type Enriched,
  type EnrichedProject,
} from "./enrichment";
import { soundCity } from "./sound-city";
import { terminalOne } from "./terminal-one";
import { telescope } from "./telescope";
import { listRailProjects } from "./rail";
import type { Project, RailProject } from "./schema";

const projects: readonly Project[] = [
  elevatedBpm,
  terminalOne,
  telescope,
  soundCity,
];

/** Published routes survive wall rotation; draft copy is an independent review flag. */
const CASE_STUDY_SLUGS = [
  "elevated-bpm",
  "terminal-one",
  "telescope",
  "sound-city",
] as const;
/** Edit this ordered selection to rotate the wall; retain authored records and published slugs. */
const WALL_SLUGS = [
  "elevated-bpm",
  "terminal-one",
  "telescope",
  "sound-city",
] as const;

export function listProjects(): readonly Project[] {
  return projects;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function listCaseStudySlugs(): readonly string[] {
  return CASE_STUDY_SLUGS;
}

export function listWallProjects(): readonly Project[] {
  const selected = new Set<string>();
  return WALL_SLUGS.map((slug) => {
    if (selected.has(slug)) {
      throw new Error(`Featured selection "${slug}": duplicate slug; select each project only once`);
    }
    selected.add(slug);
    const project = getProject(slug);
    if (!project) {
      throw new Error(`Featured selection "${slug}": unknown project; use an authored catalogue slug`);
    }
    if (!listCaseStudySlugs().includes(slug)) {
      throw new Error(`Featured selection "${slug}": no published case-study destination; publish it before featuring`);
    }
    return project;
  });
}

/**
 * Curated content with build-time GitHub stats layered on (ADR 0004).
 * Surfaces read through these so enrichment is never a per-surface concern.
 */
export async function getEnrichedProject(
  slug: string,
): Promise<EnrichedProject | undefined> {
  const project = getProject(slug);
  return project ? siteEnricher().enrichProject(project) : undefined;
}

export function listEnrichedWallProjects(): Promise<readonly EnrichedProject[]> {
  return siteEnricher().enrichProjects(listWallProjects());
}

/**
 * The more-projects rail, enriched through the same build-time path as the
 * wall. Rail entries with no remote come back with `stats: null`, which the
 * card renders as its ordinary state.
 */
export function listEnrichedRailProjects(): Promise<
  readonly Enriched<RailProject>[]
> {
  return siteEnricher().enrichProjects(listRailProjects());
}
