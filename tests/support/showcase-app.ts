import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { telescope } from "@/content/projects/authored/telescope";
import { AUTHORED_DIR, IDENTITIES_DIR, camelCase, syncRegistration } from "@/lib/generate-registration";
import { createTransmissionApp } from "./transmission-app";

// Reuse the isolated production-app harness: copied sources, local GitHub
// stand-in, and shared dependencies. No production content is rewritten.
export function createShowcaseApp() {
  return createTransmissionApp();
}

type Selection = { published: readonly string[]; featured: readonly string[] };

/** Read-validate-write the copied selection data, as an owner editing it by hand would. */
function updateSelection(dir: string, change: (selection: Selection) => Partial<Selection>) {
  const file = join(dir, "src/content/projects/selection.json");
  const selection = JSON.parse(readFileSync(file, "utf8")) as Selection;
  if (!Array.isArray(selection.published) || !Array.isArray(selection.featured)) {
    throw new Error(`Selection fixture ${file} must list "published" and "featured" slugs`);
  }
  writeFileSync(file, `${JSON.stringify({ ...selection, ...change(selection) }, null, 2)}\n`);
}

export function writeFeaturedSelection(dir: string, slugs: readonly string[]) {
  updateSelection(dir, () => ({ featured: slugs }));
}

/** Write an authored record the way an owner would: its own file, exported under the camelCase slug. */
export function writeAuthoredRecord(dir: string, file: string, project: unknown) {
  writeFileSync(
    join(dir, AUTHORED_DIR, `${file}.ts`),
    `import type { Project } from "../schema";\nexport const ${camelCase(file)}: Project = ${JSON.stringify(project, null, 2)};\n`,
  );
}

/** A fifth prepared identity for selection geometry, not the later bespoke-art onboarding proof. */
export function addPreparedFixtureProject(dir: string, overrides: Record<string, unknown> = {}) {
  writeAuthoredRecord(dir, "orbit-lab", {
    ...telescope,
    slug: "orbit-lab",
    title: "Orbit Lab",
    pitch: "A prepared fifth project for layout verification.",
    links: {},
    ...overrides,
  });
  // Prepared, not bespoke: the identity directory re-exports telescope's art.
  const identity = join(dir, IDENTITIES_DIR, "orbit-lab");
  mkdirSync(identity);
  writeFileSync(join(identity, "Tile.tsx"), 'export { default } from "../telescope/Tile";\n');
  writeFileSync(join(identity, "Artwork.tsx"), 'export { default } from "../telescope/Artwork";\n');
  syncRegistration(dir);
  updateSelection(dir, ({ published }) => ({ published: ["orbit-lab", ...published] }));
}

export function writePublishedSelection(dir: string, slugs: readonly string[]) {
  updateSelection(dir, () => ({ published: slugs }));
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

/**
 * Onboard a brand-new bespoke identity into an isolated app through the
 * documented extension points only: an authored record, local imagery, an
 * identity directory (tile, case-study artwork, and their stylesheet), the
 * generated registration, and a published slug. `publish`/`register` let a
 * test leave a step out. Files keep the `signal-loom` name even when a test
 * overrides the record's slug, so a broken slug never clobbers a real project.
 */
export function addSyntheticIdentity(
  dir: string,
  { project = syntheticProject() as unknown, publish = true, register = true } = {},
) {
  writeAuthoredRecord(dir, "signal-loom", project);
  mkdirSync(join(dir, "public/projects/signal-loom"), { recursive: true });
  copyFileSync(join(SYNTHETIC_SOURCES, "plate.svg"), join(dir, "public/projects/signal-loom/plate.svg"));
  if (register) {
    const identity = join(dir, IDENTITIES_DIR, "signal-loom");
    mkdirSync(identity);
    for (const file of ["Tile.tsx", "Artwork.tsx", "identity.css"]) {
      copyFileSync(join(SYNTHETIC_SOURCES, "signal-loom", file), join(identity, file));
    }
  }
  syncRegistration(dir);
  if (publish) {
    const slug = (project as { slug: string }).slug;
    updateSelection(dir, ({ published }) => ({ published: [slug, ...published] }));
  }
}
