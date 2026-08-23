import { expect, test } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ProjectStats from "@/components/ProjectStats";
import type { ProjectStats as Stats } from "@/content/projects/enrichment";

const stats: Stats = {
  commitCount: 135,
  // 02:00 UTC is the previous day in the Americas — the render must not drift.
  lastPushedAt: "2026-08-22T02:00:00Z",
  languages: [
    { name: "TypeScript", share: 0.75 },
    { name: "CSS", share: 0.15 },
    { name: "JavaScript", share: 0.1 },
  ],
};

const render = (props: Parameters<typeof ProjectStats>[0]) =>
  renderToStaticMarkup(createElement(ProjectStats, props));

test("renders nothing at all when a project has no live stats", () => {
  expect(render({ stats: null, variant: "case" })).toBe("");
  expect(render({ stats: null, variant: "tile" })).toBe("");
});

test("shows commit count, last-push date, and language mix on a case study", () => {
  const html = render({ stats, variant: "case" });

  expect(html).toContain("135");
  expect(html).toMatch(/datetime="2026-08-22T02:00:00Z"/i);
  expect(html).toContain("22 Aug 2026");
  expect(html).toContain("TypeScript");
  expect(html).toContain("75%");
  expect(html).toContain("CSS");
  expect(html).toContain("15%");
});

test("shows the same three stats in compact form on a tile", () => {
  const html = render({ stats, variant: "tile" });

  expect(html).toContain("135");
  expect(html).toMatch(/datetime="2026-08-22T02:00:00Z"/i);
  expect(html).toContain("22 Aug 2026");
  expect(html).toContain("TypeScript");
});

test("keeps the date stable regardless of the build machine's timezone", () => {
  const previous = process.env.TZ;
  try {
    process.env.TZ = "Pacific/Kiritimati"; // UTC+14
    expect(render({ stats, variant: "case" })).toContain("22 Aug 2026");
  } finally {
    process.env.TZ = previous;
  }
});

test("never rounds a present language away to nothing", () => {
  const html = render({
    stats: { ...stats, languages: [{ name: "Shell", share: 0.002 }] },
    variant: "case",
  });

  expect(html).toContain("Shell");
  expect(html).toContain("&lt;1%");
});

test("counts a single commit in the singular", () => {
  const one = { ...stats, commitCount: 1 };

  expect(render({ stats: one, variant: "tile" })).toContain("1 commit<");
  expect(render({ stats: one, variant: "case" })).toContain("<dd>1</dd>");
});

test("leaves out the language row when github detected none", () => {
  const html = render({ stats: { ...stats, languages: [] }, variant: "case" });

  expect(html).not.toContain("enrichment__chips");
  expect(html).toContain("135"); // the other two stats still show
});
