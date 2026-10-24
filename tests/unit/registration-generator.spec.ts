import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  AUTHORED_BARREL,
  AUTHORED_DIR,
  IDENTITIES_BARREL,
  IDENTITIES_DIR,
  readRegistrationListing,
  renderRegistration,
  syncRegistration,
} from "@/lib/generate-registration";

const complete = ["Artwork.tsx", "Tile.tsx", "identity.css"];

test("barrels are sorted by slug, headed as generated, and named from the slug", () => {
  const { authored, identities } = renderRegistration({
    authored: ["terminal-one", "elevated-bpm"],
    identities: [
      { slug: "terminal-one", files: complete },
      { slug: "elevated-bpm", files: complete },
    ],
  });

  expect(authored).toBe(`// Generated from src/content/projects/authored/ by \`npm run registration\`; do not edit.
import type { Project } from "./schema";
import { elevatedBpm } from "./authored/elevated-bpm";
import { terminalOne } from "./authored/terminal-one";

export const authoredProjects: readonly Project[] = [
  elevatedBpm,
  terminalOne,
];

export const authoredProjectFiles: readonly { fileSlug: string; project: Project }[] = [
  { fileSlug: "elevated-bpm", project: elevatedBpm },
  { fileSlug: "terminal-one", project: terminalOne },
];
`);
  expect(identities).toBe(`// Generated from src/components/showcase/identities/ by \`npm run registration\`; do not edit.
import type { ShowcasePresentation } from "./registration";
import ElevatedBpmArtwork from "./identities/elevated-bpm/Artwork";
import ElevatedBpmTile from "./identities/elevated-bpm/Tile";
import TerminalOneArtwork from "./identities/terminal-one/Artwork";
import TerminalOneTile from "./identities/terminal-one/Tile";

export const identities: readonly ShowcasePresentation[] = [
  { slug: "elevated-bpm", Tile: ElevatedBpmTile, CaseStudyArtwork: ElevatedBpmArtwork },
  { slug: "terminal-one", Tile: TerminalOneTile, CaseStudyArtwork: TerminalOneArtwork },
];
`);
});

test("output is a pure function of the listing, whatever order the disk returns", () => {
  const listing = {
    authored: ["sound-city", "telescope", "elevated-bpm"],
    identities: [
      { slug: "telescope", files: complete },
      { slug: "sound-city", files: [...complete].reverse() },
    ],
  };
  const reordered = {
    authored: [...listing.authored].reverse(),
    identities: [...listing.identities].reverse(),
  };
  expect(renderRegistration(reordered)).toEqual(renderRegistration(listing));
});

test("an empty listing still renders valid, headed barrels", () => {
  const { authored, identities } = renderRegistration({ authored: [], identities: [] });
  expect(authored).toContain("export const authoredProjects: readonly Project[] = [];\n");
  expect(authored).toContain("export const authoredProjectFiles: readonly { fileSlug: string; project: Project }[] = [\n];\n");
  expect(identities).toContain("export const identities: readonly ShowcasePresentation[] = [];\n");
  expect(authored.startsWith("// Generated from")).toBe(true);
});

for (const missing of ["Tile.tsx", "Artwork.tsx"]) {
  test(`an identity missing ${missing} is refused with the slug and file named`, () => {
    const files = complete.filter((file) => file !== missing);
    expect(() => renderRegistration({ authored: [], identities: [{ slug: "signal-loom", files }] }))
      .toThrow(`Identity "signal-loom": missing ${missing} in src/components/showcase/identities/signal-loom/`);
  });
}

test("names that cannot become a slug-derived export are refused, never mangled", () => {
  expect(() => renderRegistration({ authored: ["Signal Loom"], identities: [] }))
    .toThrow('Authored "Signal Loom": file name must be a lowercase kebab-case slug starting with a letter');
  expect(() => renderRegistration({ authored: [], identities: [{ slug: "3d-lab", files: complete }] }))
    .toThrow('Identity "3d-lab": directory name must be a lowercase kebab-case slug starting with a letter');
  expect(() => renderRegistration({ authored: ["a-b1", "a-b-1"], identities: [] }))
    .toThrow('Authored "a-b-1" and "a-b1" both generate the name "aB1"; rename one slug');
});

function tree() {
  const root = mkdtempSync(join(tmpdir(), "registration-"));
  mkdirSync(join(root, AUTHORED_DIR), { recursive: true });
  mkdirSync(join(root, IDENTITIES_DIR), { recursive: true });
  for (const slug of ["telescope", "elevated-bpm"]) {
    writeFileSync(join(root, AUTHORED_DIR, `${slug}.ts`), "");
    mkdirSync(join(root, IDENTITIES_DIR, slug));
    for (const file of complete) writeFileSync(join(root, IDENTITIES_DIR, slug, file), "");
  }
  // Finder litter is never a project.
  writeFileSync(join(root, AUTHORED_DIR, ".DS_Store"), "");
  writeFileSync(join(root, IDENTITIES_DIR, ".DS_Store"), "");
  return root;
}

test("syncing an unchanged tree twice is byte-identical and the second run changes nothing", () => {
  const root = tree();
  try {
    expect(syncRegistration(root)).toEqual([AUTHORED_BARREL, IDENTITIES_BARREL]);
    const first = [AUTHORED_BARREL, IDENTITIES_BARREL].map((file) => readFileSync(join(root, file)));
    expect(syncRegistration(root)).toEqual([]);
    const second = [AUTHORED_BARREL, IDENTITIES_BARREL].map((file) => readFileSync(join(root, file)));
    expect(second).toEqual(first);
    expect(readRegistrationListing(root).authored).toEqual(["elevated-bpm", "telescope"]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("an incomplete identity stops the sync before either barrel is written", () => {
  const root = tree();
  try {
    rmSync(join(root, IDENTITIES_DIR, "telescope", "Artwork.tsx"));
    expect(() => syncRegistration(root)).toThrow('Identity "telescope": missing Artwork.tsx');
    expect(readdirSync(join(root, "src/content/projects"))).not.toContain("authored.generated.ts");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("the checked-in barrels are exactly what the generator produces", () => {
  const expected = renderRegistration(readRegistrationListing(process.cwd()));
  expect(readFileSync(AUTHORED_BARREL, "utf8")).toBe(expected.authored);
  expect(readFileSync(IDENTITIES_BARREL, "utf8")).toBe(expected.identities);
});

test("every authored record loads under plain node and exports its camelCase slug", () => {
  const files = readdirSync(AUTHORED_DIR).filter((file) => file.endsWith(".ts"));
  expect(files.length).toBeGreaterThanOrEqual(4);
  for (const file of files) {
    const slug = file.replace(/\.ts$/, "");
    const exported = execFileSync(process.execPath, [
      "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON",
      "--input-type=module",
      "-e",
      `const m = await import(${JSON.stringify(join(process.cwd(), AUTHORED_DIR, file))});
       console.log(JSON.stringify(Object.entries(m).map(([name, record]) => [name, record.slug])));`,
    ], { encoding: "utf8" });
    const name = slug.replace(/-([a-z0-9])/g, (_, next: string) => next.toUpperCase());
    expect(JSON.parse(exported), file).toEqual([[name, slug]]);
  }
});
