import { expect, test } from "@playwright/test";
import { createEnricher } from "@/content/projects/enrichment";
import type { Project } from "@/content/projects/schema";

const curated = {
  title: "Elevated BPM",
  slug: "elevated-bpm",
  pitch: "A hardware-styled groovebox for making techno.",
  draft: true,
  story: [],
  screenshots: [],
  links: { repo: "https://github.com/msmele345/elevated-bpm" },
  stack: ["Tone.js"],
} as const satisfies Project;

const noRemote: Project = {
  ...curated,
  title: "Scholar",
  slug: "scholar",
  links: {},
};

function fakeGithub(status = 200) {
  const calls: string[] = [];
  const fetch = (async (input: RequestInfo | URL) => {
    const url = new URL(String(input));
    calls.push(url.pathname);
    if (status !== 200) return new Response("nope", { status });
    if (url.pathname.endsWith("/commits")) {
      return new Response("[]", {
        headers: {
          "content-type": "application/json",
          link: '<https://x/commits?per_page=1&page=135>; rel="last"',
        },
      });
    }
    if (url.pathname.endsWith("/languages")) {
      return Response.json({ TypeScript: 900_000, CSS: 100_000 });
    }
    return Response.json({ pushed_at: "2026-08-22T17:16:50Z" });
  }) as typeof globalThis.fetch;
  return { fetch, calls };
}

test("layers live stats onto curated content without changing it", async () => {
  const github = fakeGithub();
  const enricher = createEnricher({ fetch: github.fetch, token: "t", warn: () => {} });

  const enriched = await enricher.enrichProject(curated);

  expect(enriched.stats).toEqual({
    commitCount: 135,
    lastPushedAt: "2026-08-22T17:16:50Z",
    languages: [
      { name: "TypeScript", share: 0.9 },
      { name: "CSS", share: 0.1 },
    ],
  });
  expect(enriched.title).toBe("Elevated BPM");
  expect(enriched.pitch).toBe(curated.pitch);
  expect(enriched.links).toEqual(curated.links);
});

test("a project without a remote renders from curated content alone", async () => {
  const github = fakeGithub();
  const enricher = createEnricher({ fetch: github.fetch, token: "t", warn: () => {} });

  const enriched = await enricher.enrichProject(noRemote);

  expect(enriched.stats).toBeNull();
  expect(enriched.title).toBe("Scholar");
  expect(github.calls).toEqual([]);
});

test("an api failure warns and falls back to curated content", async () => {
  const warnings: string[] = [];
  const github = fakeGithub(403);
  const enricher = createEnricher({
    fetch: github.fetch,
    token: "t",
    warn: (message) => warnings.push(message),
  });

  const enriched = await enricher.enrichProject(curated);

  expect(enriched.stats).toBeNull();
  expect(enriched.title).toBe("Elevated BPM");
  expect(warnings.join("\n")).toMatch(/msmele345\/elevated-bpm/);
});

test("a missing token warns once instead of failing the build", async () => {
  const warnings: string[] = [];
  const github = fakeGithub();
  const enricher = createEnricher({
    fetch: github.fetch,
    token: undefined,
    warn: (message) => warnings.push(message),
  });

  await enricher.enrichProjects([curated, { ...curated, slug: "other" }]);

  expect(warnings.filter((w) => /GITHUB_TOKEN/.test(w))).toHaveLength(1);
});

test("fetches each repo once per build, however many surfaces show it", async () => {
  const github = fakeGithub();
  const enricher = createEnricher({ fetch: github.fetch, token: "t", warn: () => {} });

  const [wall, caseStudy] = await Promise.all([
    enricher.enrichProject(curated),
    enricher.enrichProject(curated),
  ]);
  await enricher.enrichProject(curated);

  expect(github.calls).toHaveLength(3);
  expect(wall.stats).toEqual(caseStudy.stats);
});
