import type { Project, StoryKind } from "./schema";

/**
 * Readiness for the authored catalogue and its published case studies.
 *
 * Checks local content only — never a remote, a token, or GitHub (ADR 0004).
 * Runs before type checking, so every value is treated as unknown: a blanked
 * or mistyped field must name its project and field, not surface as a generic
 * type diagnostic. The featured selection is checked where it is read
 * (`listWallProjects`), and presentation registration where it is resolved.
 */
export type ShowcaseContent = {
  projects: readonly Project[];
  publishedSlugs: readonly string[];
  /** Whether a root-relative `/…` path exists under `public/`. */
  assetExists: (src: string) => boolean;
};

const STORY_KINDS: readonly StoryKind[] = ["problem", "build", "result"];
const PALETTE_FIELDS = ["ground", "panel", "ink", "mute", "accent"] as const;
const ROUTE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX_COLOUR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

type Fields = Record<string, unknown>;

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim() === "";
}

function fieldsOf(value: unknown): Fields | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Fields) : undefined;
}

function isHttpsUrl(value: unknown): boolean {
  if (typeof value !== "string" || !/^https:\/\/[^/\s]/i.test(value) || /\s/.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

function isLocalAssetPath(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !/[\s\\?#]/.test(value) &&
    !value.split("/").includes("..")
  );
}

function validateProject(project: Fields, label: string, assetExists: ShowcaseContent["assetExists"]) {
  const fail = (problem: string): never => {
    throw new Error(`${label}: ${problem}`);
  };
  const requireText = (value: unknown, field: string) => {
    if (isBlank(value)) fail(`${field} must be a non-empty string`);
  };

  requireText(project.title, "title");
  requireText(project.pitch, "pitch");
  if (typeof project.draft !== "boolean") fail("draft must be true or false");

  const stack = Array.isArray(project.stack) ? project.stack : [];
  if (stack.length === 0) fail("stack must list at least one label");
  stack.forEach((item, index) => requireText(item, `stack[${index}]`));

  const tile = fieldsOf(project.tile) ?? fail("tile must define the tile identity");
  requireText(tile.motif, "tile.motif");
  requireText(tile.displayFace, "tile.displayFace");
  const palette = fieldsOf(tile.palette) ?? {};
  const requireColour = (value: unknown, field: string) => {
    if (typeof value !== "string" || !HEX_COLOUR.test(value)) fail(`${field} must be a hex colour`);
  };
  for (const field of PALETTE_FIELDS) requireColour(palette[field], `tile.palette.${field}`);
  if (palette.steps !== undefined) {
    const steps = Array.isArray(palette.steps) ? palette.steps : [];
    if (steps.length !== 4) fail("tile.palette.steps must list four hex colours");
    steps.forEach((step, index) => requireColour(step, `tile.palette.steps[${index}]`));
  }

  const story = (Array.isArray(project.story) ? project.story : []).map((section) => fieldsOf(section) ?? {});
  if (story.length !== STORY_KINDS.length || STORY_KINDS.some((kind, index) => story[index].kind !== kind)) {
    fail("story must contain problem, build, and result sections in that order");
  }
  for (const section of story) {
    requireText(section.heading, `story.${section.kind}.heading`);
    requireText(section.body, `story.${section.kind}.body`);
  }

  const screenshots = Array.isArray(project.screenshots) ? project.screenshots : [];
  if (screenshots.length === 0) fail("screenshots must include at least one image or labeled draft plate");
  screenshots.forEach((entry, index) => {
    const shot = fieldsOf(entry) ?? {};
    const src = shot.src;
    if (!isLocalAssetPath(src)) {
      return fail(`screenshots[${index}].src must be a root-relative path to a local asset in public/`);
    }
    if (!assetExists(src)) fail(`screenshots[${index}].src "${src}" does not resolve to a file in public/`);
    requireText(shot.alt, `screenshots[${index}].alt`);
    requireText(shot.caption, `screenshots[${index}].caption`);
  });

  // Remotes are optional (a missing one is a complete state), but never malformed.
  const links = fieldsOf(project.links) ?? {};
  for (const field of ["repo", "demo"] as const) {
    if (links[field] !== undefined && !isHttpsUrl(links[field])) {
      fail(`links.${field} must be an absolute HTTPS URL`);
    }
  }
}

/** Reject incomplete or contradictory local configuration with the slug and field named. */
export function validateShowcaseContent({ projects, publishedSlugs, assetExists }: ShowcaseContent): void {
  const authored = new Set<string>();
  projects.forEach((entry, index) => {
    const project = fieldsOf(entry) ?? {};
    const slug = project.slug;
    const label = isBlank(slug) ? `Project at catalogue position ${index + 1}` : `Project "${slug}"`;
    if (typeof slug !== "string" || !ROUTE_SLUG.test(slug)) {
      throw new Error(`${label}: slug must be a lowercase kebab-case route segment`);
    }
    if (authored.has(slug)) {
      throw new Error(`${label}: duplicate catalogue slug; every authored project needs its own slug`);
    }
    authored.add(slug);
    validateProject(project, label, assetExists);
  });

  const published = new Set<string>();
  for (const slug of publishedSlugs) {
    if (published.has(slug)) {
      throw new Error(`Published case study "${slug}": duplicate slug; publish each case study only once`);
    }
    published.add(slug);
    if (!authored.has(slug)) {
      throw new Error(`Published case study "${slug}": unknown project; use an authored catalogue slug`);
    }
  }
}
