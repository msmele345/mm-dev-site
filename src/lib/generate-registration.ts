import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Generated registration (ADR 0007).
 *
 * Each project owns `authored/<slug>.ts` and `identities/<slug>/`. Two barrels
 * are derived from those listings and checked in, so registration stays
 * explicit and reviewable while nobody hand-edits an import list. Output is a
 * pure function of the listing: sorted by slug, byte-identical on every run.
 *
 * Self-contained (Node built-ins only) so plain `node` can load it through
 * native type stripping without a TypeScript runner.
 */
export const AUTHORED_DIR = "src/content/projects/authored";
export const IDENTITIES_DIR = "src/components/showcase/identities";
export const AUTHORED_BARREL = "src/content/projects/authored.generated.ts";
export const IDENTITIES_BARREL = "src/components/showcase/identities.generated.ts";

const IDENTITY_FILES = ["Tile.tsx", "Artwork.tsx"] as const;
// The route-slug rule, plus a leading letter so every name is a valid identifier.
const NAMEABLE_SLUG = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

export type IdentityListing = { slug: string; files: readonly string[] };
export type RegistrationListing = {
  authored: readonly string[];
  identities: readonly IdentityListing[];
};

function header(dir: string) {
  return `// Generated from ${dir}/ by \`npm run registration\`; do not edit.\n`;
}

/** `elevated-bpm` → `elevatedBpm`, the export name of `authored/elevated-bpm.ts`. */
export function camelCase(slug: string): string {
  return slug.replace(/-([a-z0-9])/g, (_, next: string) => next.toUpperCase());
}

function pascalCase(slug: string): string {
  const name = camelCase(slug);
  return name[0].toUpperCase() + name.slice(1);
}

// Code-unit order, never locale order, so every machine sorts the same way.
function sortedSlugs(slugs: readonly string[]): string[] {
  return [...slugs].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

function checkNames(kind: string, entry: string, slugs: readonly string[]) {
  const names = new Map<string, string>();
  for (const slug of slugs) {
    if (!NAMEABLE_SLUG.test(slug)) {
      throw new Error(`${kind} "${slug}": ${entry} name must be a lowercase kebab-case slug starting with a letter`);
    }
    const name = camelCase(slug);
    const taken = names.get(name);
    if (taken) throw new Error(`${kind} "${taken}" and "${slug}" both generate the name "${name}"; rename one slug`);
    names.set(name, slug);
  }
}

function list(declaration: string, entries: readonly string[]) {
  return entries.length === 0
    ? `${declaration} = [];\n`
    : `${declaration} = [\n${entries.map((entry) => `  ${entry},\n`).join("")}];\n`;
}

/** Render both barrels, refusing anything that would silently omit or substitute art. */
export function renderRegistration(listing: RegistrationListing): { authored: string; identities: string } {
  const authoredSlugs = sortedSlugs(listing.authored);
  checkNames("Authored", "file", authoredSlugs);

  const identities = new Map(listing.identities.map((identity) => [identity.slug, identity.files]));
  const identitySlugs = sortedSlugs([...identities.keys()]);
  checkNames("Identity", "directory", identitySlugs);
  for (const slug of identitySlugs) {
    for (const file of IDENTITY_FILES) {
      if (!identities.get(slug)!.includes(file)) {
        throw new Error(`Identity "${slug}": missing ${file} in ${IDENTITIES_DIR}/${slug}/; add it or remove the directory`);
      }
    }
  }

  const authored =
    header(AUTHORED_DIR) +
    'import type { Project } from "./schema";\n' +
    authoredSlugs.map((slug) => `import { ${camelCase(slug)} } from "./authored/${slug}";\n`).join("") +
    "\n" +
    list("export const authoredProjects: readonly Project[]", authoredSlugs.map(camelCase));

  const presentation =
    header(IDENTITIES_DIR) +
    'import type { ShowcasePresentation } from "./registration";\n' +
    identitySlugs
      .map((slug) => {
        const name = pascalCase(slug);
        return `import ${name}Artwork from "./identities/${slug}/Artwork";\nimport ${name}Tile from "./identities/${slug}/Tile";\n`;
      })
      .join("") +
    "\n" +
    list(
      "export const identities: readonly ShowcasePresentation[]",
      identitySlugs.map((slug) => {
        const name = pascalCase(slug);
        return `{ slug: "${slug}", Tile: ${name}Tile, CaseStudyArtwork: ${name}Artwork }`;
      }),
    );

  return { authored, identities: presentation };
}

function isDirectory(path: string) {
  return statSync(path, { throwIfNoEntry: false })?.isDirectory() ?? false;
}

/** Authored `*.ts` files and identity directories; anything else (e.g. `.DS_Store`) is not a project. */
export function readRegistrationListing(root: string): RegistrationListing {
  const authoredDir = join(root, AUTHORED_DIR);
  const identitiesDir = join(root, IDENTITIES_DIR);
  const authored = isDirectory(authoredDir)
    ? readdirSync(authoredDir)
        .filter((file) => file.endsWith(".ts") && !file.endsWith(".d.ts") && !isDirectory(join(authoredDir, file)))
        .map((file) => file.slice(0, -".ts".length))
    : [];
  const identities = isDirectory(identitiesDir)
    ? readdirSync(identitiesDir)
        .filter((entry) => isDirectory(join(identitiesDir, entry)))
        .map((slug) => ({ slug, files: readdirSync(join(identitiesDir, slug)) }))
    : [];
  return { authored: sortedSlugs(authored), identities };
}

/**
 * Rewrite whichever barrels differ from the generator's output. Everything is
 * rendered before the first write, so a refused listing leaves both untouched.
 * Returns the repository-relative paths that changed.
 */
export function syncRegistration(root: string): string[] {
  const { authored, identities } = renderRegistration(readRegistrationListing(root));
  const changed: string[] = [];
  for (const [file, source] of [[AUTHORED_BARREL, authored], [IDENTITIES_BARREL, identities]] as const) {
    const path = join(root, file);
    if (existsSync(path) && readFileSync(path, "utf8") === source) continue;
    writeFileSync(path, source);
    changed.push(file);
  }
  return changed;
}
