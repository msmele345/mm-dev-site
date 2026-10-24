import { expect, test } from "@playwright/test";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";

const source = process.cwd();
const slug = "signal-loom";
const authored = `src/content/projects/authored/${slug}.ts`;
const identity = `src/components/showcase/identities/${slug}`;

function project(overrides: Record<string, unknown> = {}) {
  return {
    title: "Signal Loom", slug, pitch: "A signal weaving experiment.", draft: true,
    tile: { motif: "woven signal", displayFace: "Bebas Neue", palette: {
      ground: "#120a1f", panel: "#1d1230", ink: "#f6efff", mute: "#a394bd", accent: "#ff5ad1",
    } },
    story: [
      { kind: "problem", heading: "Loose threads", body: "Signals arrive unordered." },
      { kind: "build", heading: "A loom", body: "Threads are woven." },
      { kind: "result", heading: "Cloth", body: "The fabric holds." },
    ],
    screenshots: [{ src: "/projects/signal-loom/plate.svg", alt: "Draft plate of the loom.", caption: "Draft plate of the loom." }],
    links: {}, stack: ["TypeScript"], ...overrides,
  };
}

function writeProject(root: string, record = project(), file = authored) {
  const fileSlug = file.split("/").at(-1)!.slice(0, -3);
  const name = fileSlug.replace(/-([a-z0-9])/g, (_, letter: string) => letter.toUpperCase());
  writeFileSync(join(root, file), `export const ${name} = ${JSON.stringify(record)};\n`);
}

function fixture(): string {
  const root = mkdtempSync(join(tmpdir(), "showcase-check-"));
  for (const file of ["scripts/project.mjs", "scripts/registration.mjs", "src/content/projects/project-command.ts", "src/content/projects/readiness.ts", "src/content/projects/filesystem-facts.ts", "src/content/projects/schema.ts", "src/lib/generate-registration.ts"]) {
    mkdirSync(join(root, file, ".."), { recursive: true });
    cpSync(join(source, file), join(root, file));
  }
  // The repository's own script, without "type": "module", exactly as maintainers run it.
  const { scripts } = JSON.parse(readFileSync(join(source, "package.json"), "utf8"));
  writeFileSync(join(root, "package.json"), JSON.stringify({ scripts: { project: scripts.project } }));
  mkdirSync(join(root, "src/content/projects/authored"), { recursive: true });
  mkdirSync(join(root, identity), { recursive: true });
  mkdirSync(join(root, "public/projects/signal-loom"), { recursive: true });
  writeProject(root);
  writeFileSync(join(root, identity, "Tile.tsx"), "export default function Tile() {}\n");
  writeFileSync(join(root, identity, "Artwork.tsx"), "export default function Artwork() {}\n");
  writeFileSync(join(root, "public/projects/signal-loom/plate.svg"), "<svg/>\n");
  writeFileSync(join(root, "src/content/projects/selection.json"), JSON.stringify({ published: [], featured: [] }));
  execFileSync(process.execPath, ["scripts/registration.mjs"], { cwd: root });
  return root;
}

function check(root: string, checkedSlug = slug) {
  return spawnSync("npm", ["run", "project", "--", "check", checkedSlug], { cwd: root, encoding: "utf8" });
}

function hash(root: string): string {
  const digest = createHash("sha256");
  const visit = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      else digest.update(relative(root, path)).update(readFileSync(path));
    }
  };
  visit(root);
  return digest.digest("hex");
}

test("check reports authored, published, and featured stages with independent gates and leaves files unchanged", () => {
  const root = fixture();
  try {
    const before = hash(root);
    const authoredResult = check(root);
    expect(authoredResult.status, authoredResult.stderr).toBe(0);
    expect(authoredResult.stdout).toContain("Stage: authored");
    expect(authoredResult.stdout).toContain("Content ready: yes");
    expect(authoredResult.stdout).toContain("Presentation registered: yes");
    expect(authoredResult.stdout).toContain("Presentation finished: yes");
    expect(authoredResult.stderr).not.toContain("MODULE_TYPELESS_PACKAGE_JSON");
    expect(hash(root)).toBe(before);

    writeFileSync(join(root, "src/content/projects/selection.json"), JSON.stringify({ published: [slug], featured: [] }));
    const publishedResult = check(root);
    expect(publishedResult.status, publishedResult.stderr).toBe(0);
    expect(publishedResult.stdout).toContain("Stage: published");
    expect(publishedResult.stdout).toContain("Presentation registered: yes");
    expect(publishedResult.stdout).toContain("Presentation finished: yes");

    writeFileSync(join(root, "src/content/projects/selection.json"), JSON.stringify({ published: [slug], featured: [slug] }));
    const featuredBefore = hash(root);
    const featuredResult = check(root);
    expect(featuredResult.status, featuredResult.stderr).toBe(0);
    expect(featuredResult.stdout).toContain("Stage: featured");
    expect(hash(root)).toBe(featuredBefore);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("incomplete unpublished work reports every field and gate, and fixing one field removes only its finding", () => {
  const root = fixture();
  try {
    writeProject(root, project({ title: "", pitch: "" }));
    writeFileSync(join(root, identity, "Tile.tsx"), "// onboarding:unfinished\n");
    const before = hash(root);
    const result = check(root);
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain("Content ready: no");
    expect(result.stdout).toContain("Presentation registered: yes");
    expect(result.stdout).toContain("Presentation finished: no");
    expect(result.stdout).toContain("title: must be a non-empty string");
    expect(result.stdout).toContain("pitch: must be a non-empty string");
    expect(result.stdout).toContain("Tile.tsx");
    expect(hash(root)).toBe(before);

    writeProject(root, project({ pitch: "" }));
    const after = check(root);
    expect(after.stdout).not.toContain("title: must be a non-empty string");
    expect(after.stdout).toContain("pitch: must be a non-empty string");
    expect(after.stdout).toContain("Tile.tsx");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("published unfeatured project reports missing presentation and stale registration separately", () => {
  const root = fixture();
  try {
    writeFileSync(join(root, "src/content/projects/selection.json"), JSON.stringify({ published: [slug], featured: [] }));
    rmSync(join(root, identity), { recursive: true });
    const before = hash(root);
    const result = check(root);
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain("Stage: published");
    expect(result.stdout).toContain("Presentation registered: no");
    expect(result.stdout).toContain("Presentation finished: no");
    expect(result.stdout).toContain("missing presentation registration");
    expect(result.stdout).toContain("generated registration");
    expect(hash(root)).toBe(before);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("check reports mismatched authored names even with unrelated files in the directory", () => {
  const root = fixture();
  try {
    rmSync(join(root, authored));
    writeProject(root, project(), "src/content/projects/authored/wrong-name.ts");
    writeFileSync(join(root, "src/content/projects/authored/.DS_Store"), "ignored");
    execFileSync(process.execPath, ["scripts/registration.mjs"], { cwd: root });
    const result = check(root);
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain("Content ready: no");
    expect(result.stdout).toContain("authored/wrong-name.ts: filename must match record slug");
    expect(result.stdout).not.toContain("authored/(missing).ts");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("an identity directory named for no record is reported beside the project it should serve", () => {
  const root = fixture();
  try {
    cpSync(join(root, identity), join(root, "src/components/showcase/identities/signal-loon"), { recursive: true });
    rmSync(join(root, identity), { recursive: true });
    execFileSync(process.execPath, ["scripts/registration.mjs"], { cwd: root });
    const result = check(root);
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain("Presentation registered: no");
    expect(result.stdout).toContain("- presentation: missing presentation registration");
    expect(result.stdout).toContain("Catalogue findings:");
    expect(result.stdout).toContain('- "signal-loon" identity directory: has no matching catalogue record');
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("invalid registration names remain visible beside the authored relationship finding", () => {
  const root = fixture();
  try {
    rmSync(join(root, authored));
    writeProject(root, project(), "src/content/projects/authored/bad_name.ts");
    const result = check(root);
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain("authored/bad_name.ts: filename must match record slug");
    expect(result.stdout).toContain("generated registration");
    expect(result.stdout).toContain("bad_name");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("a source file without its expected record export fails with a file-specific message", () => {
  const root = fixture();
  try {
    writeFileSync(join(root, authored), "export const unrelated = {};\n");
    const before = hash(root);
    const result = check(root);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("authored/signal-loom.ts");
    expect(result.stderr).toContain("signalLoom");
    expect(hash(root)).toBe(before);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("an unpublished authored addition can be incomplete without blocking the published project unless registration is stale", () => {
  const root = fixture();
  try {
    writeFileSync(join(root, "src/content/projects/selection.json"), JSON.stringify({ published: [slug], featured: [] }));
    writeFileSync(join(root, "src/content/projects/authored/new-project.ts"), "export const newProject = { slug: 'new-project' };\n");
    const stale = check(root);
    expect(stale.status, stale.stderr).toBe(0);
    expect(stale.stdout).toContain("generated registration");
    execFileSync(process.execPath, ["scripts/registration.mjs"], { cwd: root });
    const current = check(root);
    expect(current.status, current.stderr).toBe(0);
    expect(current.stdout).not.toContain("Findings:");
    expect(current.stdout).toContain("Content ready: yes");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("a featured project reports each closed gate under its featured stage", () => {
  const root = fixture();
  try {
    writeProject(root, project({ title: "" }));
    writeFileSync(join(root, identity, "Artwork.tsx"), "// onboarding:unfinished\n");
    writeFileSync(join(root, "src/content/projects/selection.json"), JSON.stringify({ published: [slug], featured: [slug] }));
    const before = hash(root);
    const result = check(root);
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain("Stage: featured");
    expect(result.stdout).toContain("Content ready: no");
    expect(result.stdout).toContain("Presentation registered: yes");
    expect(result.stdout).toContain("Presentation finished: no");
    expect(result.stdout).toContain("- title: must be a non-empty string");
    expect(result.stdout).toContain(`- presentation: contains onboarding:unfinished marker in ${identity}/Artwork.tsx`);
    expect(hash(root)).toBe(before);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("a featured project that was never published names the missing relationship", () => {
  const root = fixture();
  try {
    writeFileSync(join(root, "src/content/projects/selection.json"), JSON.stringify({ published: [], featured: [slug] }));
    const result = check(root);
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain("Stage: featured");
    expect(result.stdout).toContain("- featured: no published case-study destination; publish it before featuring");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("draft copy, a labeled draft plate, no remote links, and unreachable enrichment are valid", () => {
  const root = fixture();
  try {
    writeFileSync(join(root, "src/content/projects/selection.json"), JSON.stringify({ published: [slug], featured: [slug] }));
    const result = spawnSync("npm", ["run", "project", "--", "check", slug], {
      cwd: root,
      encoding: "utf8",
      env: { ...process.env, GITHUB_TOKEN: "", GITHUB_API_BASE_URL: "http://127.0.0.1:9" },
    });
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain("Content ready: yes");
    expect(result.stdout).toContain("Presentation registered: yes");
    expect(result.stdout).toContain("Presentation finished: yes");
    expect(result.stdout).not.toContain("Findings:");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("check rejects invalid slugs, unknown projects, and malformed selection without changing files", () => {
  const root = fixture();
  try {
    const before = hash(root);
    const invalid = check(root, "Signal Loom");
    expect(invalid.status).not.toBe(0);
    expect(invalid.stderr).toContain("Invalid project slug");
    const unknown = check(root, "missing-project");
    expect(unknown.status).not.toBe(0);
    expect(unknown.stderr).toContain("unknown project");
    expect(hash(root)).toBe(before);

    writeFileSync(join(root, "src/content/projects/selection.json"), JSON.stringify({ published: "bad", featured: [] }));
    const malformed = check(root);
    expect(malformed.status).not.toBe(0);
    expect(malformed.stderr).toContain("selection.json");
    expect(malformed.stderr).toContain("published");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("the entrypoint explains how to enable native TypeScript stripping", () => {
  const root = fixture();
  try {
    const result = spawnSync(process.execPath, ["--no-experimental-strip-types", "scripts/project.mjs", "check", slug], { cwd: root, encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("native TypeScript type stripping");
  } finally { rmSync(root, { recursive: true, force: true }); }
});
