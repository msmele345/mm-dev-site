import {
  fetchRepoStats,
  parseRepoRef,
  type GithubClientOptions,
  type RepoStats,
} from "@/lib/github";
import type { Project } from "./schema";

/**
 * Enrichment (ADR 0004): build-time layering of live GitHub stats onto a
 * curated content file. Curated content stays the source of truth — stats
 * are additive, and their absence is a normal, fully-rendered state.
 *
 * Nothing here is allowed to fail a build. A missing remote, a missing
 * token, a rate limit, or an outage all resolve to `stats: null` plus a
 * warning on the build log.
 */

export type ProjectStats = RepoStats;

export type EnrichedProject = Project & {
  stats: ProjectStats | null;
};

export type EnricherOptions = GithubClientOptions & {
  warn?: (message: string) => void;
};

export type Enricher = {
  enrichProject: (project: Project) => Promise<EnrichedProject>;
  enrichProjects: (
    projects: readonly Project[],
  ) => Promise<readonly EnrichedProject[]>;
};

const WARN_PREFIX = "[enrichment]";

/**
 * Build an enricher over one GitHub configuration. Each instance memoises
 * per repo, so a repo shown on both the project wall and its case study
 * costs one round of API calls per build.
 */
export function createEnricher(options: EnricherOptions = {}): Enricher {
  const { warn = console.warn, ...client } = options;
  const inFlight = new Map<string, Promise<ProjectStats | null>>();
  let warnedAboutToken = false;

  function statsFor(project: Project): Promise<ProjectStats | null> {
    const ref = parseRepoRef(project.links.repo);
    if (!ref) return Promise.resolve(null);

    if (!client.token && !warnedAboutToken) {
      warnedAboutToken = true;
      warn(
        `${WARN_PREFIX} no GITHUB_TOKEN configured — falling back to unauthenticated requests, which GitHub rate-limits hard.`,
      );
    }

    const key = `${ref.owner}/${ref.repo}`;
    const cached = inFlight.get(key);
    if (cached) return cached;

    const pending = fetchRepoStats(ref, client).then((stats) => {
      if (!stats) {
        warn(
          `${WARN_PREFIX} no live stats for ${key} — "${project.title}" renders from curated content alone.`,
        );
      }
      return stats;
    });

    inFlight.set(key, pending);
    return pending;
  }

  async function enrichProject(project: Project): Promise<EnrichedProject> {
    return { ...project, stats: await statsFor(project) };
  }

  return {
    enrichProject,
    enrichProjects: (projects) => Promise.all(projects.map(enrichProject)),
  };
}

let shared: Enricher | undefined;

/**
 * The build's single enricher. Sharing one instance across the project wall
 * and every case study keeps enrichment to one round of API calls per repo
 * per build, and keeps the "no token" warning to one line of build log.
 */
export function siteEnricher(): Enricher {
  shared ??= createEnricher({
    token: process.env.GITHUB_TOKEN,
    baseUrl: process.env.GITHUB_API_BASE_URL,
  });
  return shared;
}
