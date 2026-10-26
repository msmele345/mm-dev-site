import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { collectShowcaseFilesystemFacts } from "./filesystem-facts.ts";
import { collectShowcaseFindings, ROUTE_SLUG } from "./readiness.ts";
import { camelCase } from "../../lib/generate-registration.ts";
import { createProject, syncProjects } from "./project-create.ts";
import type { Project } from "./schema";

const root = process.cwd();

export async function runProjectCommand(args: readonly string[]): Promise<number> {
  const [operation, slug] = args;
  if (operation === "sync") {
    if (args.length > 2 || (args[1] !== undefined && args[1] !== "--dry-run")) {
      throw new Error("Usage: npm run project -- sync [--dry-run]");
    }
    return syncProjects(root, args[1] === "--dry-run");
  }
  if (operation !== "check" && operation !== "create") {
    console.error("Usage: npm run project -- check <slug> | create <slug> --title <title> [--source <path>] [--dry-run] | sync [--dry-run]");
    return 1;
  }
  if (!slug || !ROUTE_SLUG.test(slug)) {
    console.error(`Invalid project slug "${slug ?? ""}". Use a lowercase kebab-case route segment.`);
    return 1;
  }

  if (operation === "check" && args.length !== 2) throw new Error("Usage: npm run project -- check <slug>");
  const selection = readSelection();
  const authoredFiles = await readdir(join(root, "src/content/projects/authored"));
  const projectFiles = authoredFiles.filter((file) => file.endsWith(".ts") && !file.endsWith(".d.ts"));
  const authoredPairs = await Promise.all(projectFiles.map(async (file) => {
    const fileSlug = file.slice(0, -".ts".length);
    const authoredModule = await import(pathToFileURL(join(root, "src/content/projects/authored", file)).href);
    const project = authoredModule[camelCase(fileSlug)];
    if (!isProject(project)) {
      throw new Error(`authored/${file}: expected a project record exported as "${camelCase(fileSlug)}"`);
    }
    return { fileSlug, recordSlug: project.slug, project };
  }));
  const projects = authoredPairs.map(({ project }) => project);
  if (operation === "create") {
    return createProject({ root, slug, options: args.slice(2), selection, authoredPairs });
  }
  const project = projects.find((entry) => entry.slug === slug);
  if (!project) {
    console.error(`Project "${slug}": unknown project; author src/content/projects/authored/${slug}.ts first.`);
    return 1;
  }
  const facts = collectShowcaseFilesystemFacts(root, authoredPairs);
  const findings = collectShowcaseFindings({ projects, publishedSlugs: selection.published, featuredSlugs: selection.featured, ...facts });
  const projectFindings = findings.filter((finding) => finding.slug === slug);
  const published = selection.published.includes(slug);
  const featured = selection.featured.includes(slug);
  const stage = featured ? "featured" : published ? "published" : "authored";
  const contentReady = !projectFindings.some((finding) => finding.gate === "content");
  const identity = facts.identityDirectories?.find((entry) => entry.slug === slug);
  const registered = Boolean(identity?.complete) && facts.generatedRegistrationMatches !== false;
  const finished = Boolean(identity?.complete) && !identity?.unfinished;
  console.log(`Project: ${slug}`);
  console.log(`Stage: ${stage}`);
  console.log(`Content ready: ${contentReady ? "yes" : "no"}`);
  console.log(`Presentation registered: ${registered ? "yes" : "no"}`);
  console.log(`Presentation finished: ${finished ? "yes" : "no"}`);
  if (projectFindings.length) {
    console.log("Findings:");
    for (const finding of projectFindings) console.log(`- ${finding.subject}: ${finding.message}`);
  }
  // Orphaned files and unknown references belong to no record, so no single check would show them.
  const authoredSlugs = new Set(projects.map((entry) => entry.slug));
  const catalogueFindings = findings.filter((finding) => !authoredSlugs.has(finding.slug));
  if (catalogueFindings.length) {
    console.log("Catalogue findings:");
    for (const finding of catalogueFindings) console.log(`- "${finding.slug}" ${finding.subject}: ${finding.message}`);
  }
  return 0;
}

function readSelection(): { published: string[]; featured: string[] } {
  const file = "src/content/projects/selection.json";
  let value: unknown;
  try {
    value = JSON.parse(readFileSync(join(root, file), "utf8"));
  } catch (error) {
    throw new Error(`${file}: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${file}: expected an object with published and featured slug arrays`);
  }
  const selection = value as Record<string, unknown>;
  for (const field of ["published", "featured"] as const) {
    if (!Array.isArray(selection[field]) || !selection[field].every((entry: unknown) => typeof entry === "string")) {
      throw new Error(`${file}: ${field} must be an array of project slugs`);
    }
  }
  return selection as { published: string[]; featured: string[] };
}

function isProject(value: unknown): value is Project {
  return typeof value === "object" && value !== null && typeof (value as { slug?: unknown }).slug === "string";
}
