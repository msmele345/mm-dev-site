import { expect, test } from "@playwright/test";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { chmodSync, cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, readlinkSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
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
  for (const file of ["scripts/project.mjs", "scripts/registration.mjs", "src/content/projects/project-command.ts", "src/content/projects/project-create.ts", "src/content/projects/readiness.ts", "src/content/projects/filesystem-facts.ts", "src/content/projects/schema.ts", "src/lib/generate-registration.ts"]) {
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
  return command(root, "check", checkedSlug);
}

function command(root: string, ...args: string[]) {
  return spawnSync("npm", ["run", "project", "--", ...args], { cwd: root, encoding: "utf8" });
}

function hash(root: string): string {
  const digest = createHash("sha256");
  const visit = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const path = join(directory, entry.name);
      digest.update(relative(root, path));
      if (entry.isSymbolicLink()) digest.update("symlink").update(readlinkSync(path));
      else if (entry.isDirectory()) { digest.update("directory"); visit(path); }
      else digest.update("file").update(readFileSync(path));
    }
  };
  visit(root);
  return digest.digest("hex");
}

test("create prepares an unpublished project with unfinished presentation", () => {
  const root = fixture();
  try {
    const selection = readFileSync(join(root, "src/content/projects/selection.json"), "utf8");
    const result = spawnSync("npm", ["run", "project", "--", "create", "nova-loom", "--title", "Nova Loom"], { cwd: root, encoding: "utf8" });
    expect(result.status, result.stderr).toBe(0);
    expect(readFileSync(join(root, "src/content/projects/selection.json"), "utf8")).toBe(selection);
    const report = check(root, "nova-loom");
    expect(report.status, report.stderr).toBe(0);
    expect(report.stdout).toContain("Stage: authored");
    expect(report.stdout).toContain("Content ready: no");
    expect(report.stdout).toContain("Presentation registered: yes");
    expect(report.stdout).toContain("Presentation finished: no");
    expect(report.stdout).toContain("pitch: must be a non-empty string");
    expect(report.stdout).toContain("screenshots: must include at least one image");
    const record = JSON.parse(execFileSync(process.execPath, ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "--input-type=module", "-e", 'import { novaLoom } from "./src/content/projects/authored/nova-loom.ts"; console.log(JSON.stringify(novaLoom))'], { cwd: root, encoding: "utf8" }));
    expect(record).toEqual({
      slug: "nova-loom", title: "Nova Loom", draft: true, pitch: "",
      tile: { motif: "", displayFace: "", palette: { ground: "", panel: "", ink: "", mute: "", accent: "" } },
      story: [
        { kind: "problem", heading: "", body: "" },
        { kind: "build", heading: "", body: "" },
        { kind: "result", heading: "", body: "" },
      ], links: {}, stack: [], screenshots: [],
    });
    for (const file of ["Tile.tsx", "Artwork.tsx", "identity.css"]) {
      const content = readFileSync(join(root, "src/components/showcase/identities/nova-loom", file), "utf8");
      expect(content).toContain("onboarding:unfinished");
      if (file !== "identity.css") expect(content).toContain("UNFINISHED");
    }
    expect(readFileSync(join(root, "src/components/showcase/identities/nova-loom/Tile.tsx"), "utf8")).toContain("TileMeta");
    expect(readFileSync(join(root, "src/components/showcase/identities/nova-loom/Tile.tsx"), "utf8")).toContain('aria-hidden="true"');
    expect(readFileSync(join(root, "public/projects/nova-loom/.gitkeep"), "utf8")).toBe("");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("create dry run shows new files and both registration diffs without creating directories", () => {
  const root = fixture();
  try {
    const before = hash(root);
    const result = command(root, "create", "nova-loom", "--title", "Nova Loom", "--dry-run");
    expect(result.status, result.stderr).toBe(0);
    for (const path of ["src/content/projects/authored/nova-loom.ts", "src/components/showcase/identities/nova-loom/Tile.tsx", "src/components/showcase/identities/nova-loom/Artwork.tsx", "src/components/showcase/identities/nova-loom/identity.css", "public/projects/nova-loom/.gitkeep", "docs/project-review/nova-loom.md"]) expect(result.stdout).toContain(path);
    expect(result.stdout).toContain('import { novaLoom } from "./authored/nova-loom"');
    expect(result.stdout).toContain('import NovaLoomTile from "./identities/nova-loom/Tile"');
    expect(hash(root)).toBe(before);
    expect(existsSync(join(root, "src/components/showcase/identities/nova-loom"))).toBe(false);
    expect(existsSync(join(root, "public/projects/nova-loom"))).toBe(false);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("create retries safely and never overwrites edited work", () => {
  const root = fixture();
  try {
    const args = ["create", "nova-loom", "--title", "Nova Loom"];
    const created = command(root, ...args);
    expect(created.status, created.stderr).toBe(0);
    const before = hash(root);
    const repeat = command(root, ...args);
    expect(repeat.status, repeat.stderr).toBe(0);
    expect(repeat.stdout).toContain("already exists");
    expect(hash(root)).toBe(before);

    rmSync(join(root, "src/components/showcase/identities/nova-loom/Artwork.tsx"));
    const resumed = command(root, ...args);
    expect(resumed.status, resumed.stderr).toBe(0);
    expect(hash(root)).toBe(before);

    rmSync(join(root, "src/content/projects/authored/nova-loom.ts"));
    rmSync(join(root, "src/content/projects/authored.generated.ts"));
    rmSync(join(root, "src/components/showcase/identities.generated.ts"));
    const resumedBeforeRegistration = command(root, ...args);
    expect(resumedBeforeRegistration.status, resumedBeforeRegistration.stderr).toBe(0);
    expect(hash(root)).toBe(before);

    writeFileSync(join(root, "src/components/showcase/identities/nova-loom/Tile.tsx"), "owner edits\n");
    const edited = hash(root);
    const conflict = command(root, ...args);
    expect(conflict.status).not.toBe(0);
    expect(conflict.stderr).toContain("different content");
    expect(hash(root)).toBe(edited);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("an identical create and current sync need no write access", () => {
  const root = fixture();
  const directories = [
    "src/content/projects/authored", "src/content/projects", "src/components/showcase/identities/nova-loom",
    "src/components/showcase", "public/projects/nova-loom", "docs/project-review",
  ];
  try {
    const created = command(root, "create", "nova-loom", "--title", "Nova Loom");
    expect(created.status, created.stderr).toBe(0);
    for (const dir of directories) chmodSync(join(root, dir), 0o555);
    const before = hash(root);
    const repeat = command(root, "create", "nova-loom", "--title", "Nova Loom");
    expect(repeat.status, repeat.stderr).toBe(0);
    expect(repeat.stdout).toContain("already exists");
    const sync = command(root, "sync");
    expect(sync.status, sync.stderr).toBe(0);
    expect(sync.stdout).toContain("already current");
    expect(hash(root)).toBe(before);
  } finally {
    for (const dir of directories) if (existsSync(join(root, dir))) chmodSync(join(root, dir), 0o755);
    rmSync(root, { recursive: true, force: true });
  }
});

test("create validates arguments, identifier names, and title before changing the checkout", () => {
  const root = fixture();
  try {
    const before = hash(root);
    for (const args of [
      ["create", "UPPER", "--title", "Title"], ["create", "../outside", "--title", "Title"],
      ["create", "1-project", "--title", "Title"], ["create", "class", "--title", "Title"],
      ["create", "const", "--title", "Title"], ["create", "await", "--title", "Title"],
      ["create", "default", "--title", "Title"], ["create", "authored-projects", "--title", "Title"],
      ["create", "nova-loom", "--title", "   "], ["create", "nova-loom"],
      ["create", "nova-loom", "--title", "Title", "--title", "Again"],
      ["create", "nova-loom", "--title", "Title", "--source", "--dry-run"],
      ["create", "nova-loom", "--title", "Title", "--unknown"],
    ]) {
      const result = command(root, ...args);
      expect(result.status, args.join(" ")).not.toBe(0);
      expect(hash(root), args.join(" ")).toBe(before);
    }
    expect(existsSync(join(root, "src/components/showcase/identities/nova-loom"))).toBe(false);
    expect(existsSync(join(root, "public/projects/nova-loom"))).toBe(false);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("create stops for occupied files, directories, slugs, and symlinks without side effects", () => {
  const root = fixture();
  try {
    const assertRefusal = () => {
      const before = hash(root);
      const result = command(root, "create", "nova-loom", "--title", "Nova Loom");
      expect(result.status).not.toBe(0);
      expect(hash(root)).toBe(before);
      expect(existsSync(join(root, "src/content/projects/authored/nova-loom.ts"))).toBe(false);
    };
    mkdirSync(join(root, "src/components/showcase/identities/nova-loom"));
    writeFileSync(join(root, "src/components/showcase/identities/nova-loom/extra.txt"), "owner work");
    assertRefusal();
    rmSync(join(root, "src/components/showcase/identities/nova-loom"), { recursive: true });

    mkdirSync(join(root, "public/projects/nova-loom"));
    writeFileSync(join(root, "public/projects/nova-loom/.gitkeep"), "owner work");
    assertRefusal();
    rmSync(join(root, "public/projects/nova-loom"), { recursive: true });

    symlinkSync("/nonexistent/identity", join(root, "src/components/showcase/identities/nova-loom"));
    assertRefusal();
    rmSync(join(root, "src/components/showcase/identities/nova-loom"));

    writeFileSync(join(root, "src/content/projects/selection.json"), JSON.stringify({ published: ["nova-loom"], featured: [] }));
    assertRefusal();
    writeFileSync(join(root, "src/content/projects/selection.json"), JSON.stringify({ published: [], featured: [] }));
    writeProject(root, project({ slug: "nova-loom" }), "src/content/projects/authored/other-name.ts");
    assertRefusal();
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("create rejects a generated identifier collision before writes", () => {
  const root = fixture();
  try {
    writeProject(root, project({ slug: "alpha1" }), "src/content/projects/authored/alpha1.ts");
    const before = hash(root);
    const result = command(root, "create", "alpha-1", "--title", "Alpha One");
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('both generate the name "alpha1"');
    expect(hash(root)).toBe(before);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("create refuses when the prospective application has a build-blocking finding", () => {
  const root = fixture();
  try {
    writeProject(root, project({ pitch: "" }));
    writeFileSync(join(root, "src/content/projects/selection.json"), JSON.stringify({ published: [slug], featured: [] }));
    const before = hash(root);
    const result = command(root, "create", "nova-loom", "--title", "Nova Loom");
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("signal-loom pitch: must be a non-empty string");
    expect(hash(root)).toBe(before);
    expect(existsSync(join(root, "src/components/showcase/identities/nova-loom"))).toBe(false);
    expect(existsSync(join(root, "public/projects/nova-loom"))).toBe(false);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("create records the source path and exact revision without importing copy", () => {
  const root = fixture();
  try {
    const revision = execFileSync("git", ["-C", source, "rev-parse", "--verify", "HEAD"], { encoding: "utf8" }).trim();
    const result = command(root, "create", "nova-loom", "--title", 'Nova "Loom"', "--source", source);
    expect(result.status, result.stderr).toBe(0);
    const notes = readFileSync(join(root, "docs/project-review/nova-loom.md"), "utf8");
    expect(notes).toContain(source);
    expect(notes).toContain(revision);
    const report = check(root, "nova-loom");
    expect(report.status, report.stderr).toBe(0);
    expect(report.stdout).toContain("pitch: must be a non-empty string");

    const before = hash(root);
    const invalid = command(root, "create", "another-project", "--title", "Another", "--source", "/no/such/repository");
    expect(invalid.status).not.toBe(0);
    expect(invalid.stderr).toContain("readable Git revision");
    expect(hash(root)).toBe(before);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("an identical create preserves its original source revision when the source advances", () => {
  const root = fixture();
  const sourceRepo = mkdtempSync(join(tmpdir(), "project-source-"));
  const git = (...args: string[]) => execFileSync("git", ["-C", sourceRepo, "-c", "user.name=Fixture", "-c", "user.email=fixture@example.test", "-c", "commit.gpgsign=false", ...args], { stdio: "ignore" });
  try {
    git("init", "-q");
    git("commit", "--allow-empty", "-qm", "First revision");
    const args = ["create", "nova-loom", "--title", "Nova Loom", "--source", sourceRepo];
    const created = command(root, ...args);
    expect(created.status, created.stderr).toBe(0);
    const notes = readFileSync(join(root, "docs/project-review/nova-loom.md"), "utf8");
    git("commit", "--allow-empty", "-qm", "Second revision");
    const before = hash(root);
    const repeat = command(root, ...args);
    expect(repeat.status, repeat.stderr).toBe(0);
    expect(repeat.stdout).toContain("already exists");
    expect(readFileSync(join(root, "docs/project-review/nova-loom.md"), "utf8")).toBe(notes);
    expect(hash(root)).toBe(before);

    const alteredNotes = notes.replace(/Source revision: `[a-f0-9]{40,64}`/, `Source revision: \`${"0".repeat(40)}\``);
    writeFileSync(join(root, "docs/project-review/nova-loom.md"), alteredNotes);
    const altered = hash(root);
    const invalidRetry = command(root, ...args);
    expect(invalidRetry.status).not.toBe(0);
    expect(invalidRetry.stderr).toContain("readable Git revision");
    expect(hash(root)).toBe(altered);
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(sourceRepo, { recursive: true, force: true });
  }
});

test("an existing review note cannot make a nonexistent source repository valid", () => {
  const root = fixture();
  try {
    const sourceRepo = join(root, "missing-source-repository");
    mkdirSync(join(root, "docs/project-review"), { recursive: true });
    writeFileSync(join(root, "docs/project-review/nova-loom.md"), `# "Nova Loom" review notes\n\nSource repository: ${JSON.stringify(sourceRepo)}\n\nSource revision: \`${"0".repeat(40)}\`\n\n- [ ] Review source-grounded copy.\n- [ ] Review tile and case-study artwork.\n`);
    const before = hash(root);
    const result = command(root, "create", "nova-loom", "--title", "Nova Loom", "--source", sourceRepo);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("readable Git revision");
    expect(hash(root)).toBe(before);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("sync previews and regenerates registration, then becomes a no-op", () => {
  const root = fixture();
  try {
    writeProject(root, project({ slug: "new-project" }), "src/content/projects/authored/new-project.ts");
    const before = hash(root);
    const preview = command(root, "sync", "--dry-run");
    expect(preview.status, preview.stderr).toBe(0);
    expect(preview.stdout).toContain('+import { newProject } from "./authored/new-project"');
    expect(hash(root)).toBe(before);
    const changed = command(root, "sync");
    expect(changed.status, changed.stderr).toBe(0);
    expect(changed.stdout).toContain("authored.generated.ts");
    const synced = hash(root);
    const repeat = command(root, "sync");
    expect(repeat.status, repeat.stderr).toBe(0);
    expect(repeat.stdout).toContain("already current");
    expect(hash(root)).toBe(synced);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

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
