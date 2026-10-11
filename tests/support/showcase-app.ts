import { appendFileSync, copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createTransmissionApp } from "./transmission-app";

// Reuse the isolated production-app harness: copied sources, local GitHub
// stand-in, and shared dependencies. No production content is rewritten.
export function createShowcaseApp() {
  return createTransmissionApp();
}

export function writeFeaturedSelection(dir: string, slugs: readonly string[]) {
  const file = join(dir, "src/content/projects/catalog.ts");
  const source = readFileSync(file, "utf8");
  const selection = /const WALL_SLUGS = \[[\s\S]*?\] as const;/;
  if (!selection.test(source)) throw new Error("Featured selection fixture could not find WALL_SLUGS");
  writeFileSync(file, source.replace(selection, `const WALL_SLUGS = ${JSON.stringify(slugs)} as const;`));
}

/** A fifth prepared identity for selection geometry, not the later bespoke-art onboarding proof. */
export function addPreparedFixtureProject(dir: string) {
  const catalogue = join(dir, "src/content/projects/catalog.ts");
  let source = readFileSync(catalogue, "utf8");
  source = source.replace("  elevatedBpm,", '  { ...telescope, slug: "orbit-lab", title: "Orbit Lab", pitch: "A prepared fifth project for layout verification.", links: {} },\n  elevatedBpm,');
  source = source.replace("const CASE_STUDY_SLUGS = [", 'const CASE_STUDY_SLUGS = [\n  "orbit-lab",');
  writeFileSync(catalogue, source);
  const registry = join(dir, "src/components/showcase/registry.ts");
  writeFileSync(registry, readFileSync(registry, "utf8").replace(
    "createShowcaseRegistry([",
    'createShowcaseRegistry([\n  { slug: "orbit-lab", Tile: TelescopeTile, CaseStudyArtwork: TelescopeArtwork },',
  ));
}

export function writePublishedSelection(dir: string, slugs: readonly string[]) {
  const file = join(dir, "src/content/projects/catalog.ts");
  const source = readFileSync(file, "utf8");
  const selection = /const CASE_STUDY_SLUGS = \[[\s\S]*?\] as const;/;
  if (!selection.test(source)) throw new Error("Publication fixture could not find CASE_STUDY_SLUGS");
  writeFileSync(file, source.replace(selection, `const CASE_STUDY_SLUGS = ${JSON.stringify(slugs)} as const;`));
}

const SYNTHETIC_SOURCES = join(process.cwd(), "tests/support/synthetic-identity");

/** A complete, never-shipped project record with its own art direction. */
export function syntheticProject() {
  return {
    title: "Signal Loom",
    slug: "signal-loom",
    pitch: "A synthetic project that weaves loose signals into one readable fabric.",
    draft: true,
    tile: {
      motif: "woven signal",
      displayFace: "Bebas Neue",
      palette: { ground: "#120a1f", panel: "#1d1230", ink: "#f6efff", mute: "#a394bd", accent: "#ff5ad1" },
    },
    story: [
      { kind: "problem", heading: "Loose threads everywhere", body: "Signals arrive unordered, and nobody can read the pattern they make." },
      { kind: "build", heading: "A loom for signals", body: "Eight warp threads hold the order while a single weft carries each new signal across." },
      { kind: "result", heading: "Cloth you can read", body: "The fixture fabric holds its pattern from the first thread to the selvedge." },
    ],
    screenshots: [
      {
        src: "/projects/signal-loom/plate.svg",
        alt: "Draft plate of eight violet warp threads crossed by a single pale weft.",
        caption: "Draft plate — the loom at rest. Replace with a live capture.",
      },
    ],
    // No stand-in serves this remote: enrichment fails and curated content must carry the page.
    links: {
      repo: "https://github.com/msmele345/signal-loom",
      demo: "https://signal-loom.example.com",
    } as { repo?: string; demo?: string },
    stack: ["TypeScript", "Canvas", "Web Audio"],
  };
}

function replaceOnce(file: string, anchor: string, replacement: string) {
  const source = readFileSync(file, "utf8");
  if (!source.includes(anchor)) throw new Error(`Synthetic identity fixture could not find "${anchor}" in ${file}`);
  writeFileSync(file, source.replace(anchor, replacement));
}

/**
 * Onboard a brand-new bespoke identity into an isolated app through the
 * documented extension points only: a content record, a published slug, tile
 * and case-study artwork with their styles, local imagery, and one registry
 * line. `publish`/`register` let a test leave a step out.
 */
export function addSyntheticIdentity(
  dir: string,
  { project = syntheticProject() as unknown, publish = true, register = true } = {},
) {
  writeFileSync(
    join(dir, "src/content/projects/signal-loom.ts"),
    `import type { Project } from "./schema";\nexport const signalLoom: Project = ${JSON.stringify(project, null, 2)};\n`,
  );
  const catalogue = join(dir, "src/content/projects/catalog.ts");
  replaceOnce(catalogue, 'import { elevatedBpm } from "./elevated-bpm";', 'import { elevatedBpm } from "./elevated-bpm";\nimport { signalLoom } from "./signal-loom";');
  replaceOnce(catalogue, "  soundCity,\n];", "  soundCity,\n  signalLoom,\n];");
  if (publish) {
    replaceOnce(catalogue, "const CASE_STUDY_SLUGS = [", `const CASE_STUDY_SLUGS = [\n  ${JSON.stringify((project as { slug: string }).slug)},`);
  }

  mkdirSync(join(dir, "public/projects/signal-loom"), { recursive: true });
  copyFileSync(join(SYNTHETIC_SOURCES, "plate.svg"), join(dir, "public/projects/signal-loom/plate.svg"));
  copyFileSync(join(SYNTHETIC_SOURCES, "SignalLoomTile.tsx"), join(dir, "src/components/tiles/SignalLoomTile.tsx"));
  copyFileSync(join(SYNTHETIC_SOURCES, "SignalLoomArtwork.tsx"), join(dir, "src/components/showcase/SignalLoomArtwork.tsx"));
  appendFileSync(join(dir, "src/app/globals.css"), readFileSync(join(SYNTHETIC_SOURCES, "signal-loom.css"), "utf8"));

  if (register) {
    const registry = join(dir, "src/components/showcase/registry.ts");
    replaceOnce(registry, 'import { createShowcaseRegistry } from "./registration";', 'import SignalLoomTile from "@/components/tiles/SignalLoomTile";\nimport { SignalLoomArtwork } from "./SignalLoomArtwork";\nimport { createShowcaseRegistry } from "./registration";');
    replaceOnce(registry, "createShowcaseRegistry([", 'createShowcaseRegistry([\n  { slug: "signal-loom", Tile: SignalLoomTile, CaseStudyArtwork: SignalLoomArtwork },');
  }
}
