/**
 * GitHub API client for build-time enrichment (ADR 0004).
 *
 * The only place the site knows GitHub's HTTP shape. Everything here is
 * best-effort: a caller gets stats or `null`, never a rejection, so a rate
 * limit or an outage can never fail a build.
 */

export type RepoRef = {
  owner: string;
  repo: string;
};

/**
 * Resolve a curated content file's `links.repo` into an owner/repo ref.
 * Anything that is not a github.com repository link — including a project
 * with no remote at all — resolves to `null` and is simply never enriched.
 */
export function parseRepoRef(repoUrl: string | undefined): RepoRef | null {
  if (!repoUrl) return null;

  let url: URL;
  try {
    url = new URL(repoUrl);
  } catch {
    return null;
  }

  if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
    return null;
  }

  const [owner, repo, ...rest] = url.pathname.split("/").filter(Boolean);
  if (!owner || !repo || rest.length > 0) return null;

  return { owner, repo: repo.replace(/\.git$/, "") };
}

export type LanguageShare = {
  name: string;
  /** Fraction of the repo's bytes, 0–1. */
  share: number;
};

export type RepoStats = {
  commitCount: number;
  /** ISO-8601 timestamp of the repo's last push. */
  lastPushedAt: string;
  /** Largest language first. */
  languages: readonly LanguageShare[];
};

export type GithubClientOptions = {
  fetch?: typeof globalThis.fetch;
  token?: string;
  baseUrl?: string;
  /** Per-request ceiling, so a hung GitHub can never stall a build. */
  timeoutMs?: number;
  /**
   * A value that changes once per build. Next's Data Cache persists between
   * builds — Vercel restores it across deployments — so without this, the
   * scheduled rebuild would keep rebaking the first build's stats forever.
   * Sending it as a request header keeps the pages statically prerendered;
   * `cache: "no-store"` would also refetch, but turns them dynamic, and
   * ADR 0004 rules out a runtime GitHub dependency.
   */
  buildKey?: string;
};

const DEFAULT_BASE_URL = "https://api.github.com";
const DEFAULT_TIMEOUT_MS = 8_000;

/**
 * Fetch the three live stats ADR 0004 layers onto curated content.
 * Returns `null` rather than throwing on any failure.
 */
export async function fetchRepoStats(
  ref: RepoRef,
  options: GithubClientOptions = {},
): Promise<RepoStats | null> {
  const get = githubGetter(options);
  const base = `/repos/${ref.owner}/${ref.repo}`;

  const [repo, commits, languages] = await Promise.all([
    get(base),
    get(`${base}/commits?per_page=1`),
    get(`${base}/languages`),
  ]);

  if (!repo || !commits || !languages) return null;

  const lastPushedAt = (await readJson<{ pushed_at?: string }>(repo))?.pushed_at;
  if (!lastPushedAt) return null;

  return {
    commitCount: await commitCount(commits),
    lastPushedAt,
    languages: languageShares(
      (await readJson<Record<string, number>>(languages)) ?? {},
    ),
  };
}

function githubGetter(options: GithubClientOptions) {
  const doFetch = options.fetch ?? globalThis.fetch;
  const baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const buildKey = options.buildKey ?? process.env.ENRICHMENT_BUILD_ID ?? "local";
  const token = options.token;

  return async (path: string): Promise<Response | null> => {
    try {
      const response = await doFetch(`${baseUrl}${path}`, {
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          accept: "application/vnd.github+json",
          "x-github-api-version": "2022-11-28",
          "x-enrichment-build": buildKey,
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
      });
      return response.ok ? response : null;
    } catch {
      return null;
    }
  };
}

async function readJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

/**
 * GitHub has no commit-count endpoint. Asking for a single commit per page
 * makes the `rel="last"` page number the commit count — but that header only
 * appears once there is a second page, so a repo with one commit (or none)
 * has to be counted from the body instead.
 */
async function commitCount(response: Response): Promise<number> {
  const last = response.headers
    .get("link")
    ?.match(/[?&]page=(\d+)>;\s*rel="last"/);
  if (last) return Number(last[1]);

  const page = await readJson<unknown[]>(response);
  return Array.isArray(page) ? page.length : 0;
}

function languageShares(bytes: Record<string, number>): readonly LanguageShare[] {
  const total = Object.values(bytes).reduce((sum, value) => sum + value, 0);
  if (total <= 0) return [];

  return Object.entries(bytes)
    .map(([name, value]) => ({ name, share: value / total }))
    .sort((a, b) => b.share - a.share);
}
