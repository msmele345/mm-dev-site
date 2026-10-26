import { execFileSync } from "node:child_process";
import { accessSync, constants, lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import {
  AUTHORED_BARREL, AUTHORED_DIR, IDENTITIES_BARREL, IDENTITIES_DIR,
  camelCase, readRegistrationListing, renderRegistration,
} from "../../lib/generate-registration.ts";
import { collectShowcaseFilesystemFacts } from "./filesystem-facts.ts";
import { collectShowcaseFindings } from "./readiness.ts";
import type { Project } from "./schema";

type PlannedFile = { path: string; content: string };
type AuthoredPair = { fileSlug: string; recordSlug: string; project: Project };
type Selection = { published: string[]; featured: string[] };
type Provenance = { path: string; revision: string };
type CreateInput = {
  root: string;
  slug: string;
  options: readonly string[];
  selection: Selection;
  authoredPairs: readonly AuthoredPair[];
};

const RESERVED_NAMES = new Set([
  "arguments", "await", "break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "enum", "eval", "export", "extends", "false", "finally", "for", "function", "if", "implements", "import", "in", "instanceof", "interface", "let", "new", "null", "package", "private", "protected", "public", "return", "static", "super", "switch", "this", "throw", "true", "try", "typeof", "var", "void", "while", "with", "yield", "authoredProjects", "authoredProjectFiles",
]);

function parseOptions(args: readonly string[]) {
  let title: string | undefined;
  let source: string | undefined;
  let dryRun = false;
  for (let index = 0; index < args.length; index++) {
    const option = args[index];
    if (option === "--dry-run" && !dryRun) dryRun = true;
    else if ((option === "--title" && title === undefined) || (option === "--source" && source === undefined)) {
      const value = args[++index];
      if (value === undefined || value.startsWith("--")) throw new Error(`${option} requires a value`);
      if (option === "--title") title = value;
      else source = value;
    } else throw new Error(`Unknown or repeated create option "${option}"`);
  }
  if (!title?.trim()) throw new Error("--title requires a nonblank title");
  if (source !== undefined && !source.trim()) throw new Error("--source requires a repository path");
  return { title, source, dryRun };
}

function sourceRevision(root: string, source: string, recordedRevision?: string): Provenance {
  const path = resolve(root, source);
  try {
    const revision = execFileSync("git", ["-C", path, "rev-parse", "--verify", recordedRevision ? `${recordedRevision}^{commit}` : "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
    if (!revision || (recordedRevision && revision !== recordedRevision)) throw new Error("missing revision");
    return { path, revision };
  } catch {
    throw new Error(`Source repository ${JSON.stringify(source)} must have a readable Git revision`);
  }
}

function starterProject(slug: string, title: string): Project {
  return {
    slug, title, draft: true, pitch: "",
    tile: { motif: "", displayFace: "", palette: { ground: "", panel: "", ink: "", mute: "", accent: "" } },
    story: [
      { kind: "problem", heading: "", body: "" },
      { kind: "build", heading: "", body: "" },
      { kind: "result", heading: "", body: "" },
    ],
    links: {}, stack: [], screenshots: [],
  };
}

function reviewNotes(project: Project, provenance?: Provenance): string {
  return `# ${JSON.stringify(project.title)} review notes\n\n${provenance ? `Source repository: ${JSON.stringify(provenance.path)}\n\nSource revision: \`${provenance.revision}\`\n` : "Source repository: not recorded\n"}\n- [ ] Review source-grounded copy.\n- [ ] Review tile and case-study artwork.\n`;
}

function authoredSource(project: Project): string {
  return `import type { Project } from "../schema";\n\nexport const ${camelCase(project.slug)}: Project = ${JSON.stringify(project, null, 2)};\n`;
}

function recordedProvenance(root: string, project: Project, source: string): Provenance | undefined {
  const path = `docs/project-review/${project.slug}.md`;
  preflightParents(root, path, false);
  if (!status(root, path)?.isFile()) return undefined;
  const notes = readFileSync(join(root, path), "utf8");
  const revision = notes.match(/\nSource revision: `([a-f0-9]{40}|[a-f0-9]{64})`\n/)?.[1];
  if (!revision) return undefined;
  const provenance = { path: resolve(root, source), revision };
  if (notes !== reviewNotes(project, provenance)) return undefined;
  const authored = `${AUTHORED_DIR}/${project.slug}.ts`;
  preflightParents(root, authored, false);
  if (!status(root, authored)?.isFile() || readFileSync(join(root, authored), "utf8") !== authoredSource(project)) return undefined;
  return sourceRevision(root, source, revision);
}

function starterFiles(project: Project, provenance?: Provenance): PlannedFile[] {
  const { slug } = project;
  const identity = `${IDENTITIES_DIR}/${slug}`;
  return [
    { path: `${AUTHORED_DIR}/${slug}.ts`, content: authoredSource(project) },
    { path: `${identity}/Tile.tsx`, content: `// onboarding:unfinished\nimport Link from "next/link";\nimport TileMeta, { tilePaletteStyle } from "@/components/tiles/TileMeta";\nimport type { EnrichedProject } from "@/content/projects/enrichment";\nimport "./identity.css";\n\nexport default function Tile({ project, index }: { project: EnrichedProject; index: number }) {\n  const tile = project.tile;\n  if (!tile) return null;\n\n  return (\n    <Link className="chameleon-tile onboarding-${slug}-tile" href={\`/work/\${project.slug}\`} style={tilePaletteStyle(tile.palette)}>\n      <div className="onboarding-${slug}-tile__art" aria-hidden="true">\n        <span data-anim>UNFINISHED</span>\n      </div>\n      <span className="visually-hidden">Unfinished artwork. </span>\n      <TileMeta project={project} index={index} classPrefix="onboarding-${slug}-tile" />\n    </Link>\n  );\n}\n` },
    { path: `${identity}/Artwork.tsx`, content: `// onboarding:unfinished\nimport "./identity.css";\n\nexport default function Artwork() {\n  return (\n    <>\n      <div className="case-motif onboarding-${slug}-artwork" aria-hidden="true">\n        <span>UNFINISHED</span>\n      </div>\n      <span className="visually-hidden">Unfinished artwork</span>\n    </>\n  );\n}\n` },
    { path: `${identity}/identity.css`, content: `/* onboarding:unfinished */\n.onboarding-${slug}-tile__art { display: grid; min-height: 17rem; place-items: center; background: #171717; color: #fff; border: 1px dashed #fff; }\n.onboarding-${slug}-tile__art [data-anim] { animation: onboarding-${slug}-starter-pulse 4s ease-in-out infinite; }\n.tile-motion[data-crescendo="true"] .onboarding-${slug}-tile__art [data-anim] { animation-duration: 1s; }\n.onboarding-${slug}-tile__meta { display: grid; gap: 0.75rem; }\n.onboarding-${slug}-tile__meta strong { color: #fff; font-family: var(--font-display), sans-serif; font-size: clamp(1.8rem, 5vw, 3.4rem); line-height: 0.9; }\n.onboarding-${slug}-tile__index, .onboarding-${slug}-tile__go { color: #fff; }\n.onboarding-${slug}-tile__pitch { color: #ddd; }\n.onboarding-${slug}-artwork { display: grid; place-items: center; background: #171717; color: #fff; }\n@keyframes onboarding-${slug}-starter-pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }\n@media (prefers-reduced-motion: reduce) { .onboarding-${slug}-tile__art [data-anim] { opacity: 1; } }\n` },
    { path: `public/projects/${slug}/.gitkeep`, content: "" },
    { path: `docs/project-review/${slug}.md`, content: reviewNotes(project, provenance) },
  ];
}

function status(root: string, path: string) {
  return lstatSync(join(root, path), { throwIfNoEntry: false });
}

function preflightParents(root: string, file: string, needsWrite: boolean) {
  let parent = dirname(file);
  let writableParent: string | undefined;
  while (parent !== ".") {
    const entry = status(root, parent);
    if (entry && !entry.isDirectory()) throw new Error(`${parent}: expected a directory`);
    if (entry && writableParent === undefined) writableParent = parent;
    parent = dirname(parent);
  }
  if (needsWrite) accessSync(writableParent === undefined ? root : join(root, writableParent), constants.W_OK | constants.X_OK);
}

function preflightFiles(root: string, files: readonly PlannedFile[]): PlannedFile[] {
  const missing: PlannedFile[] = [];
  for (const file of files) {
    const entry = status(root, file.path);
    preflightParents(root, file.path, !entry);
    if (!entry) missing.push(file);
    else if (!entry.isFile() || readFileSync(join(root, file.path), "utf8") !== file.content) {
      throw new Error(`${file.path}: already exists with different content`);
    }
  }
  return missing;
}

function registrationPlan(root: string, listing: Parameters<typeof renderRegistration>[0]): PlannedFile[] {
  const generated = renderRegistration(listing);
  const files = [
    { path: AUTHORED_BARREL, content: generated.authored },
    { path: IDENTITIES_BARREL, content: generated.identities },
  ];
  const changed: PlannedFile[] = [];
  for (const file of files) {
    const existing = status(root, file.path);
    if (existing && !existing.isFile()) throw new Error(`${file.path}: expected a generated file`);
    const needsWrite = !existing || readFileSync(join(root, file.path), "utf8") !== file.content;
    preflightParents(root, file.path, needsWrite);
    if (needsWrite) {
      if (existing) accessSync(join(root, file.path), constants.W_OK);
      changed.push(file);
    }
  }
  return changed;
}

function printDiff(root: string, files: readonly PlannedFile[]) {
  for (const file of files) {
    const before = status(root, file.path) ? readFileSync(join(root, file.path), "utf8").split("\n") : [];
    const after = file.content.split("\n");
    const lengths = Array.from({ length: before.length + 1 }, () => Array<number>(after.length + 1).fill(0));
    for (let left = before.length - 1; left >= 0; left--) {
      for (let right = after.length - 1; right >= 0; right--) {
        lengths[left][right] = before[left] === after[right] ? lengths[left + 1][right + 1] + 1 : Math.max(lengths[left + 1][right], lengths[left][right + 1]);
      }
    }
    console.log(`--- ${file.path}\n+++ ${file.path}`);
    let left = 0;
    let right = 0;
    while (left < before.length || right < after.length) {
      if (left < before.length && right < after.length && before[left] === after[right]) { left++; right++; }
      else if (right < after.length && (left === before.length || lengths[left][right + 1] >= lengths[left + 1][right])) console.log(`+${after[right++]}`);
      else console.log(`-${before[left++]}`);
    }
  }
}

function writeFiles(root: string, files: readonly PlannedFile[], exclusive: boolean) {
  for (const file of files) {
    mkdirSync(dirname(join(root, file.path)), { recursive: true });
    writeFileSync(join(root, file.path), file.content, exclusive ? { flag: "wx" } : undefined);
  }
}

export function syncProjects(root: string, dryRun: boolean): number {
  const registration = registrationPlan(root, readRegistrationListing(root));
  if (registration.length === 0) console.log("Registration is already current.");
  else if (dryRun) printDiff(root, registration);
  else {
    writeFiles(root, registration, false);
    console.log(`Updated ${registration.map((file) => file.path).join(", ")}`);
  }
  return 0;
}

export function createProject({ root, slug, options, selection, authoredPairs }: CreateInput): number {
  const { title, source, dryRun } = parseOptions(options);
  const name = camelCase(slug);
  if (RESERVED_NAMES.has(name)) throw new Error(`Project "${slug}": generated identifier "${name}" cannot be used`);
  if (selection.published.includes(slug) || selection.featured.includes(slug)) throw new Error(`Project "${slug}": slug is already in use in selection.json`);
  if (authoredPairs.some((entry) => entry.recordSlug === slug && entry.fileSlug !== slug)) throw new Error(`Project "${slug}": slug is already in use by another authored record`);

  const project = starterProject(slug, title);
  const provenance = source === undefined ? undefined : recordedProvenance(root, project, source) ?? sourceRevision(root, source);
  const files = starterFiles(project, provenance);
  for (const directory of [`${IDENTITIES_DIR}/${slug}`, `public/projects/${slug}`]) {
    const existing = status(root, directory);
    if (!existing) continue;
    if (!existing.isDirectory()) throw new Error(`${directory}: expected a directory`);
    const expected = new Set(files.filter((file) => dirname(file.path) === directory).map((file) => file.path.slice(directory.length + 1)));
    for (const entry of readdirSync(join(root, directory))) {
      if (!expected.has(entry)) throw new Error(`${directory}/${entry}: slug is already in use`);
    }
  }
  const missing = preflightFiles(root, files);
  const listing = readRegistrationListing(root);
  const authored = listing.authored.includes(slug) ? listing.authored : [...listing.authored, slug];
  const identities = listing.identities.filter((entry) => entry.slug !== slug);
  identities.push({ slug, files: ["Tile.tsx", "Artwork.tsx", "identity.css"] });
  const registration = registrationPlan(root, { authored, identities });

  const existingPairs = authoredPairs.filter((entry) => entry.fileSlug !== slug);
  const facts = collectShowcaseFilesystemFacts(root, existingPairs);
  const findings = collectShowcaseFindings({
    projects: [...existingPairs.map((entry) => entry.project), project],
    publishedSlugs: selection.published,
    featuredSlugs: selection.featured,
    ...facts,
    authoredFiles: [...(facts.authoredFiles ?? []).filter((entry) => entry.fileSlug !== slug), { fileSlug: slug, recordSlug: slug }],
    identityDirectories: [...(facts.identityDirectories ?? []).filter((entry) => entry.slug !== slug), { slug, complete: true, unfinished: true }],
    generatedRegistrationMatches: true,
  }).filter((finding) => finding.blocksBuild);
  if (findings.length) throw new Error(findings.map((finding) => `${finding.slug} ${finding.subject}: ${finding.message}`).join("\n"));

  if (missing.length === 0 && registration.length === 0) {
    console.log(`Project "${slug}" already exists.`);
    return 0;
  }
  if (dryRun) {
    for (const file of missing) console.log(`Create ${file.path}`);
    printDiff(root, registration);
  } else {
    writeFiles(root, missing, true);
    writeFiles(root, registration, false);
    console.log(`Created project "${slug}" as unpublished and unfeatured.`);
    for (const file of missing) console.log(`Created ${file.path}`);
    for (const file of registration) console.log(`Updated ${file.path}`);
  }
  return 0;
}
