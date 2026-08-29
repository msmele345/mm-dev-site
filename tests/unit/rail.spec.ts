import { expect, test } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import RailCard from "@/components/RailCard";
import { listRailEntries, listRailProjects } from "@/content/projects/rail";
import type { Enriched } from "@/content/projects/enrichment";
import type { RailProject } from "@/content/projects/schema";

const render = (project: Enriched<RailProject>) =>
  renderToStaticMarkup(createElement(RailCard, { project }));

test("the rail shows a curated selection, not every written entry", () => {
  const shown = listRailProjects();
  const written = listRailEntries();

  expect(shown.length).toBeGreaterThan(0);
  expect(written.length).toBeGreaterThan(shown.length);

  const writtenSlugs = new Set(written.map((entry) => entry.slug));
  for (const project of shown) {
    expect(writtenSlugs.has(project.slug)).toBe(true);
  }
});

test("every entry is written once and carries what a card needs", () => {
  const entries = listRailEntries();
  const slugs = entries.map((entry) => entry.slug);

  expect(new Set(slugs).size).toBe(slugs.length);
  for (const entry of entries) {
    expect(entry.title).not.toBe("");
    expect(entry.pitch).not.toBe("");
    expect(entry.stack.length).toBeGreaterThan(0);
  }
});

test("a card with a remote links out and names its destination", () => {
  const html = render({
    title: "Screens",
    slug: "screens",
    pitch: "A concert image gallery.",
    links: { repo: "https://github.com/msmele345/screens" },
    stack: ["TypeScript"],
    stats: null,
  });

  expect(html).toContain('href="https://github.com/msmele345/screens"');
  expect(html).toContain('rel="noreferrer"');
  expect(html).toContain("repository on GitHub");
});

/**
 * The rail's selection is configurable, so an entry with no remote has to be a
 * finished state rather than a broken card: no stats, no dead link, and a note
 * saying why (ADR 0004 — curated content stands on its own).
 */
test("a card with no remote renders complete, with no link and no stats", () => {
  const html = render({
    title: "Scholar",
    slug: "scholar",
    pitch: "A local-first workspace for Azure certification study.",
    links: {},
    unlinkedNote: "Not published",
    stack: ["React 19"],
    stats: null,
  });

  expect(html).toContain("Scholar");
  expect(html).toContain("A local-first workspace");
  expect(html).toContain("Not published");
  expect(html).not.toMatch(/<a[\s>]/);
  expect(html).not.toContain("enrichment");
});

test("an unlinked card with nothing to explain simply omits the note", () => {
  const html = render({
    title: "Quiet",
    slug: "quiet",
    pitch: "No remote, no explanation.",
    links: {},
    stack: ["Kotlin"],
    stats: null,
  });

  expect(html).not.toContain("rail-card__note");
  expect(html).not.toMatch(/<a[\s>]/);
});

test("stats ride along when the build found them", () => {
  const html = render({
    title: "Buzzball",
    slug: "buzzball",
    pitch: "Advanced MLB metrics.",
    links: { repo: "https://github.com/msmele345/Buzzball" },
    stack: ["TypeScript"],
    stats: {
      commitCount: 888,
      lastPushedAt: "2026-02-14T02:00:00Z",
      languages: [{ name: "TypeScript", share: 1 }],
    },
  });

  expect(html).toContain("888 commits");
  expect(html).toContain("14 Feb 2026");
});
