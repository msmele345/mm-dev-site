import { expect, test } from "@playwright/test";
import { parseRepoRef } from "@/lib/github";

test("resolves a curated github link into an owner/repo ref", () => {
  expect(parseRepoRef("https://github.com/msmele345/elevated-bpm")).toEqual({
    owner: "msmele345",
    repo: "elevated-bpm",
  });
});

test("tolerates trailing slashes and .git suffixes on the curated link", () => {
  expect(parseRepoRef("https://github.com/msmele345/terminal-one.git")).toEqual({
    owner: "msmele345",
    repo: "terminal-one",
  });
  expect(parseRepoRef("https://github.com/msmele345/telescope/")).toEqual({
    owner: "msmele345",
    repo: "telescope",
  });
});

test("has no ref for a project without a remote", () => {
  expect(parseRepoRef(undefined)).toBeNull();
});

test("has no ref for a link that is not a github repository", () => {
  expect(parseRepoRef("https://gitlab.com/msmele345/elevated-bpm")).toBeNull();
  expect(parseRepoRef("https://github.com/msmele345")).toBeNull();
  expect(parseRepoRef("not a url")).toBeNull();
});

const REF = { owner: "msmele345", repo: "elevated-bpm" };

/** Stands in for GitHub with the response shapes the real API returns. */
function fakeGithub(
  overrides: Record<string, () => Response> = {},
): { fetch: typeof globalThis.fetch; calls: string[] } {
  const calls: string[] = [];
  const routes: Record<string, () => Response> = {
    "/repos/msmele345/elevated-bpm": () =>
      Response.json({ pushed_at: "2026-08-22T17:16:50Z" }),
    "/repos/msmele345/elevated-bpm/commits": () =>
      new Response("[]", {
        headers: {
          "content-type": "application/json",
          link: '<https://api.github.com/repositories/1/commits?per_page=1&page=2>; rel="next", <https://api.github.com/repositories/1/commits?per_page=1&page=135>; rel="last"',
        },
      }),
    "/repos/msmele345/elevated-bpm/languages": () =>
      Response.json({ TypeScript: 750_000, CSS: 150_000, JavaScript: 100_000 }),
    ...overrides,
  };

  const fetch = (async (input: RequestInfo | URL) => {
    const url = new URL(String(input));
    calls.push(url.pathname);
    const route = routes[url.pathname];
    if (!route) return new Response("Not Found", { status: 404 });
    return route();
  }) as typeof globalThis.fetch;

  return { fetch, calls };
}

test("reports commit count, last push, and language mix for a repo", async () => {
  const { fetchRepoStats } = await import("@/lib/github");
  const github = fakeGithub();

  const stats = await fetchRepoStats(REF, { fetch: github.fetch });

  expect(stats).toEqual({
    commitCount: 135,
    lastPushedAt: "2026-08-22T17:16:50Z",
    languages: [
      { name: "TypeScript", share: 0.75 },
      { name: "CSS", share: 0.15 },
      { name: "JavaScript", share: 0.1 },
    ],
  });
});

test("reports no stats when the api rejects the request", async () => {
  const { fetchRepoStats } = await import("@/lib/github");
  const github = fakeGithub({
    "/repos/msmele345/elevated-bpm": () =>
      new Response("rate limited", { status: 403 }),
  });

  expect(await fetchRepoStats(REF, { fetch: github.fetch })).toBeNull();
});

test("reports no stats when the network fails, without throwing", async () => {
  const { fetchRepoStats } = await import("@/lib/github");
  const exploding = (async () => {
    throw new Error("ENOTFOUND api.github.com");
  }) as typeof globalThis.fetch;

  expect(await fetchRepoStats(REF, { fetch: exploding })).toBeNull();
});

test("gives up on a hung request instead of stalling the build", async () => {
  const { fetchRepoStats } = await import("@/lib/github");
  const hanging = ((_input: RequestInfo | URL, init?: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () =>
        reject(new Error("aborted")),
      );
    })) as typeof globalThis.fetch;

  expect(
    await fetchRepoStats(REF, { fetch: hanging, timeoutMs: 20 }),
  ).toBeNull();
});

test("sends the token when one is configured, and omits it when not", async () => {
  const { fetchRepoStats } = await import("@/lib/github");
  const seen: (string | null)[] = [];
  const recording = (async (input: RequestInfo | URL, init?: RequestInit) => {
    seen.push(new Headers(init?.headers).get("authorization"));
    return fakeGithub().fetch(input, init);
  }) as typeof globalThis.fetch;

  await fetchRepoStats(REF, { fetch: recording, token: "ghp_secret" });
  expect(seen).toEqual([
    "Bearer ghp_secret",
    "Bearer ghp_secret",
    "Bearer ghp_secret",
  ]);

  seen.length = 0;
  await fetchRepoStats(REF, { fetch: recording });
  expect(seen).toEqual([null, null, null]);
});

test("keys every request to the build, so a rebuild never reuses stale stats", async () => {
  const { fetchRepoStats } = await import("@/lib/github");
  const seen: (string | null)[] = [];
  const recording = (async (input: RequestInfo | URL, init?: RequestInit) => {
    seen.push(new Headers(init?.headers).get("x-enrichment-build"));
    return fakeGithub().fetch(input, init);
  }) as typeof globalThis.fetch;

  await fetchRepoStats(REF, { fetch: recording, buildKey: "build-1" });
  await fetchRepoStats(REF, { fetch: recording, buildKey: "build-2" });

  expect(seen).toEqual([
    "build-1",
    "build-1",
    "build-1",
    "build-2",
    "build-2",
    "build-2",
  ]);
});

test("counts a repo whose commit list fits on one page", async () => {
  const { fetchRepoStats } = await import("@/lib/github");
  // With per_page=1 GitHub only sends a Link header once there is a page 2,
  // so a brand-new repo's count has to come from the body.
  const github = fakeGithub({
    "/repos/msmele345/elevated-bpm/commits": () =>
      Response.json([{ sha: "abc123" }]),
  });

  const stats = await fetchRepoStats(REF, { fetch: github.fetch });

  expect(stats?.commitCount).toBe(1);
});

test("reports a repo with no commits as zero rather than guessing", async () => {
  const { fetchRepoStats } = await import("@/lib/github");
  const github = fakeGithub({
    "/repos/msmele345/elevated-bpm/commits": () => Response.json([]),
  });

  expect((await fetchRepoStats(REF, { fetch: github.fetch }))?.commitCount).toBe(0);
});
