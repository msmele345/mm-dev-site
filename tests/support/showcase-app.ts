import { readFileSync, writeFileSync } from "node:fs";
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
