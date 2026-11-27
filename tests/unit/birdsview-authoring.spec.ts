import { expect, test } from "@playwright/test";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getProject, listAuthoredFileRecords, listCaseStudySlugs, listProjects } from "@/content/projects/catalog";
import { collectShowcaseFilesystemFacts } from "@/content/projects/filesystem-facts";
import { collectShowcaseFindings } from "@/content/projects/readiness";
import selection from "@/content/projects/selection.json";

const ROOT = process.cwd();

test("birdsview passes project check with content ready and presentation registered", () => {
  const result = spawnSync("npm", ["run", "project", "--", "check", "birdsview"], {
    cwd: ROOT,
    encoding: "utf8",
  });

  expect(result.status, result.stderr || result.stdout).toBe(0);
  expect(result.stdout).toContain("Project: birdsview");
  expect(result.stdout).toContain("Content ready: yes");
  expect(result.stdout).toContain("Presentation registered: yes");

  const findings = collectShowcaseFindings({
    projects: listProjects(),
    publishedSlugs: listCaseStudySlugs(),
    featuredSlugs: selection.featured,
    ...collectShowcaseFilesystemFacts(ROOT, listAuthoredFileRecords()),
  }).filter((finding) => finding.slug === "birdsview");

  expect(findings.filter((finding) => finding.gate === "content")).toEqual([]);
  expect(findings.filter((finding) => finding.gate === "presentation-registered")).toEqual([]);
});

test("birdsview authored record carries source-grounded metadata, story, and links", () => {
  const project = getProject("birdsview");
  expect(project).toBeDefined();
  if (!project) return;

  expect(project.title).toBe("Birdsview");
  expect(project.slug).toBe("birdsview");
  expect(project.invitation.trim().length).toBeGreaterThan(0);
  expect(project.pitch.trim().length).toBeGreaterThan(0);

  expect(project.links.demo).toBe("https://birdsview-ochre.vercel.app");
  expect(project.links.repo).toBeUndefined();

  expect(project.tile?.displayFace).toBe("Libre Caslon Display");
  expect(project.tile?.palette).toEqual({
    ground: "#070e16",
    panel: "#0b141d",
    ink: "#f4eedf",
    mute: "#abb8bf",
    accent: "#45ffd0",
  });

  expect(project.stack).toEqual(
    expect.arrayContaining([
      "TypeScript",
      "React 19",
      "Vite",
      "CesiumJS",
      "Zod",
      "Vitest",
      "Playwright",
      "Vercel",
    ]),
  );

  expect(project.story.map((section) => section.kind)).toEqual(["problem", "build", "result"]);
  const resultSection = project.story.find((section) => section.kind === "result");
  expect(resultSection?.body).toMatch(/in development|release one/i);
  expect(resultSection?.body).toMatch(/day\/night lighting/i);
  expect(resultSection?.body).toMatch(/cloud/i);
  expect(resultSection?.body).toMatch(/quiz/i);
});

test("birdsview has at least two visitor-facing SVG plates under public/projects/birdsview", () => {
  const project = getProject("birdsview");
  expect(project).toBeDefined();
  if (!project) return;

  expect(project.screenshots.length).toBeGreaterThanOrEqual(2);

  for (const shot of project.screenshots) {
    expect(shot.src).toMatch(/^\/projects\/birdsview\/[^/]+\.svg$/);
    expect(shot.alt.trim().length).toBeGreaterThan(0);
    expect(shot.caption.trim().length).toBeGreaterThan(0);
    expect(shot.alt).not.toMatch(/draft plate|replace with a live capture/i);
    expect(shot.caption).not.toMatch(/draft plate|replace with a live capture/i);

    const filePath = join(ROOT, "public", shot.src);
    expect(existsSync(filePath), `Expected SVG plate at ${filePath}`).toBe(true);
    const svg = readFileSync(filePath, "utf8");
    expect(svg.trimStart().startsWith("<svg")).toBe(true);
    expect(svg).toContain("</svg>");
    expect(svg).not.toMatch(/draft plate|replace with a live capture/i);
  }
});
