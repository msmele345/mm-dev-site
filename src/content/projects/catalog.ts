import { elevatedBpm } from "./elevated-bpm";
import { siteEnricher, type EnrichedProject } from "./enrichment";
import { soundCity } from "./sound-city";
import { terminalOne } from "./terminal-one";
import { telescope } from "./telescope";
import type { Project } from "./schema";

const projects: readonly Project[] = [
  elevatedBpm,
  terminalOne,
  telescope,
  soundCity,
];

const CASE_STUDY_SLUGS = [
  "elevated-bpm",
  "terminal-one",
  "telescope",
  "sound-city",
] as const;
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
  return WALL_SLUGS.map((slug) => getProject(slug)).filter(
    (project): project is Project => project !== undefined,
  );
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
