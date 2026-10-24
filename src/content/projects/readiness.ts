import type { Project, StoryKind } from "./schema";

export const ROUTE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type IdentityReadiness = {
  slug: string;
  complete: boolean;
  unfinished: boolean;
  unfinishedFiles?: readonly string[];
};

export type ShowcaseContent = {
  projects: readonly Project[];
  publishedSlugs: readonly string[];
  featuredSlugs?: readonly string[];
  assetExists: (src: string) => boolean;
  authoredFiles?: readonly { fileSlug: string; recordSlug: string | undefined }[];
  identityDirectories?: readonly IdentityReadiness[];
  generatedRegistrationMatches?: boolean;
  generatedRegistrationError?: string;
};

export type ShowcaseFinding = {
  slug: string;
  subject: string;
  message: string;
  blocksBuild: boolean;
  gate: "content" | "presentation-registered" | "presentation-finished" | null;
};

const STORY_KINDS: readonly StoryKind[] = ["problem", "build", "result"];
const PALETTE_FIELDS = ["ground", "panel", "ink", "mute", "accent"] as const;
const HEX_COLOUR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
type Fields = Record<string, unknown>;

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim() === "";
}

function fieldsOf(value: unknown): Fields | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Fields : undefined;
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
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") &&
    !/[\s\\?#]/.test(value) && !value.split("/").includes("..");
}

export function collectShowcaseFindings(input: ShowcaseContent): ShowcaseFinding[] {
  const findings: ShowcaseFinding[] = [];
  const add = (slug: string, subject: string, message: string, blocksBuild: boolean, gate: ShowcaseFinding["gate"] = "content") => {
    findings.push({ slug, subject, message, blocksBuild, gate });
  };
  const authored = new Map<string, Fields>();
  const buildBlockedSlugs = new Set(input.publishedSlugs);
  const validateRecord = (project: Fields, slug: string, blocksBuild: boolean) => {
    const requireText = (value: unknown, subject: string) => {
      if (isBlank(value)) add(slug, subject, "must be a non-empty string", blocksBuild);
    };
    requireText(project.title, "title");
    requireText(project.pitch, "pitch");
    if (typeof project.draft !== "boolean") add(slug, "draft", "must be true or false", blocksBuild);
    const stack = Array.isArray(project.stack) ? project.stack : [];
    if (stack.length === 0) add(slug, "stack", "must list at least one label", blocksBuild);
    stack.forEach((item, index) => requireText(item, `stack[${index}]`));
    const tile = fieldsOf(project.tile);
    if (!tile) add(slug, "tile", "must define the tile identity", blocksBuild);
    else {
      requireText(tile.motif, "tile.motif");
      requireText(tile.displayFace, "tile.displayFace");
      const palette = fieldsOf(tile.palette) ?? {};
      for (const field of PALETTE_FIELDS) {
        if (typeof palette[field] !== "string" || !HEX_COLOUR.test(palette[field] as string)) {
          add(slug, `tile.palette.${field}`, "must be a hex colour", blocksBuild);
        }
      }
      if (palette.steps !== undefined) {
        const steps = Array.isArray(palette.steps) ? palette.steps : [];
        if (steps.length !== 4) add(slug, "tile.palette.steps", "must list four hex colours", blocksBuild);
        steps.forEach((step, index) => {
          if (typeof step !== "string" || !HEX_COLOUR.test(step)) add(slug, `tile.palette.steps[${index}]`, "must be a hex colour", blocksBuild);
        });
      }
    }
    const story = (Array.isArray(project.story) ? project.story : []).map((section) => fieldsOf(section) ?? {});
    if (story.length !== STORY_KINDS.length || STORY_KINDS.some((kind, index) => story[index].kind !== kind)) {
      add(slug, "story", "must contain problem, build, and result sections in that order", blocksBuild);
    }
    for (const section of story) {
      requireText(section.heading, `story.${String(section.kind)}.heading`);
      requireText(section.body, `story.${String(section.kind)}.body`);
    }
    const screenshots = Array.isArray(project.screenshots) ? project.screenshots : [];
    if (screenshots.length === 0) add(slug, "screenshots", "must include at least one image or labeled draft plate", blocksBuild);
    screenshots.forEach((entry, index) => {
      const shot = fieldsOf(entry) ?? {};
      const src = shot.src;
      if (!isLocalAssetPath(src)) add(slug, `screenshots[${index}].src`, "must be a root-relative path to a local asset in public/", blocksBuild);
      else if (!input.assetExists(src)) add(slug, `screenshots[${index}].src`, `"${src}" does not resolve to a file in public/`, blocksBuild);
      requireText(shot.alt, `screenshots[${index}].alt`);
      requireText(shot.caption, `screenshots[${index}].caption`);
    });
    const links = fieldsOf(project.links) ?? {};
    for (const field of ["repo", "demo"] as const) {
      if (links[field] !== undefined && !isHttpsUrl(links[field])) add(slug, `links.${field}`, "must be an absolute HTTPS URL", blocksBuild);
    }
  };

  input.projects.forEach((entry, index) => {
    const project = fieldsOf(entry) ?? {};
    const rawSlug = project.slug;
    const slug = typeof rawSlug === "string" && rawSlug ? rawSlug : `catalogue-position-${index + 1}`;
    const blocksBuild = buildBlockedSlugs.has(slug);
    if (typeof rawSlug !== "string" || !ROUTE_SLUG.test(rawSlug)) {
      add(slug, "slug", "must be a lowercase kebab-case route segment", true);
    }
    if (typeof rawSlug === "string" && authored.has(rawSlug)) {
      add(rawSlug, "slug", "duplicate catalogue slug; every authored project needs its own slug", true);
    }
    if (typeof rawSlug === "string") authored.set(rawSlug, project);
    validateRecord(project, slug, blocksBuild);
  });

  const projectSlugs = new Set(input.projects.map((entry) => fieldsOf(entry)?.slug).filter((slug): slug is string => typeof slug === "string"));
  for (const file of input.authoredFiles ?? []) {
    if (file.recordSlug === undefined) {
      add(file.fileSlug, `authored/${file.fileSlug}.ts`, "has no matching catalogue record", buildBlockedSlugs.has(file.fileSlug), null);
    }
  }
  const recordSlugs = new Set((input.authoredFiles ?? []).map(({ recordSlug }) => recordSlug));
  for (const entry of input.projects) {
    const slug = fieldsOf(entry)?.slug;
    if (typeof slug === "string" && input.authoredFiles?.length && !recordSlugs.has(slug)) {
      add(slug, "authored file", "filename must match the record slug", buildBlockedSlugs.has(slug));
    }
  }
  for (const identity of input.identityDirectories ?? []) {
    if (!projectSlugs.has(identity.slug)) {
      add(identity.slug, "identity directory", "has no matching catalogue record", buildBlockedSlugs.has(identity.slug), null);
    }
  }
  for (const file of input.authoredFiles ?? []) {
    if (file.recordSlug !== undefined && file.fileSlug !== file.recordSlug) {
      add(file.recordSlug, `authored/${file.fileSlug}.ts`, `filename must match record slug "${file.recordSlug}"`, buildBlockedSlugs.has(file.recordSlug));
    }
  }

  const identityMap = new Map((input.identityDirectories ?? []).map((identity) => [identity.slug, identity]));
  const published = new Set<string>();
  for (const slug of input.publishedSlugs) {
    if (published.has(slug)) {
      add(slug, "published", "duplicate slug; publish each case study only once", true, null);
      continue;
    }
    published.add(slug);
    if (!authored.has(slug)) add(slug, "published", "unknown project; use an authored catalogue slug", true, null);
  }

  if (input.identityDirectories) {
    for (const entry of input.projects) {
      const slug = fieldsOf(entry)?.slug;
      if (typeof slug !== "string") continue;
      const isPublished = published.has(slug);
      const identity = identityMap.get(slug);
      if (!identity?.complete) add(slug, "presentation", "missing presentation registration", isPublished, "presentation-registered");
      if (identity?.unfinished) {
        const files = identity.unfinishedFiles?.length ? ` in ${identity.unfinishedFiles.join(", ")}` : "";
        add(slug, "presentation", `contains onboarding:unfinished marker${files}`, isPublished, "presentation-finished");
      }
      if (input.generatedRegistrationMatches === false) {
        const cause = input.generatedRegistrationError ?? "does not match authored files and identity directories; run npm run registration";
        add(slug, "generated registration", cause, isPublished, "presentation-registered");
      }
    }
  }

  const selected = new Set<string>();
  for (const slug of input.featuredSlugs ?? []) {
    if (selected.has(slug)) {
      add(slug, "featured", "duplicate slug; select each project only once", true, null);
      continue;
    }
    selected.add(slug);
    if (!authored.has(slug)) add(slug, "featured", "unknown project; use an authored catalogue slug", true, null);
    if (!published.has(slug)) add(slug, "featured", "no published case-study destination; publish it before featuring", true, null);
  }
  return findings;
}

/** Build guard. Unpublished findings remain visible to the check command without blocking the site. */
export function validateShowcaseContent(input: ShowcaseContent): void {
  const blocking = collectShowcaseFindings(input).filter((finding) => finding.blocksBuild);
  if (blocking.length) {
    throw new Error(blocking.map(({ slug, subject, message }) => {
      if (subject === "published") return `Published case study "${slug}": ${message}`;
      if (subject === "featured") return `Featured selection "${slug}": ${message}`;
      if (subject === "presentation" && message === "missing presentation registration") return `Showcase "${slug}": ${message}`;
      if (subject === "presentation") return `Showcase "${slug}": ${subject} ${message}`;
      if (subject === "slug" && message.startsWith("duplicate")) return `Project "${slug}": ${message}`;
      if (subject === "slug" && message.startsWith("must be") && slug.startsWith("catalogue-position-")) {
        return `Project at catalogue position ${slug.slice("catalogue-position-".length)}: slug ${message}`;
      }
      if (subject === "slug" && message.startsWith("must be")) return `Project "${slug}": slug ${message}`;
      if (subject === "identity directory") return `Showcase "${slug}": ${message}`;
      if (subject === "authored file") return `Project "${slug}": ${message}`;
      if (subject === "generated registration") return `Showcase "${slug}": ${message}`;
      return `Project "${slug}": ${subject} ${message}`;
    }).join("\n"));
  }
}
