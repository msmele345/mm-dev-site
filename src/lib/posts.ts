import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

/**
 * The post metadata contract (ADR 0005): frontmatter every `.mdx` post
 * must carry. Validation is loud at build time so a broken frontmatter
 * fails the deploy instead of quietly dropping the post.
 */
export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
};

export const POSTS_DIR = join(process.cwd(), "src", "content", "blog");

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const FRONTMATTER_BLOCK = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
const ISO_DATE_FIELD =
  /^date:\s*(?:"(\d{4}-\d{2}-\d{2})"|'(\d{4}-\d{2}-\d{2})'|(\d{4}-\d{2}-\d{2}))\s*(?:#.*)?$/m;

function isCalendarDate(value: string): boolean {
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(timestamp) &&
    new Date(timestamp).toISOString().slice(0, 10) === value
  );
}

/**
 * YAML reads an unquoted `date: 2026-08-27` as a Date object; accept that
 * or an explicit ISO string, and always store the yyyy-mm-dd form.
 */
function normalizeDate(value: unknown, frontmatter: string): string | null {
  const field = frontmatter.match(ISO_DATE_FIELD);
  const literal = field?.[1] ?? field?.[2] ?? field?.[3];
  if (!literal || !ISO_DATE.test(literal) || !isCalendarDate(literal)) {
    return null;
  }

  const parsed =
    value instanceof Date
      ? value.toISOString().slice(0, 10)
      : typeof value === "string"
        ? value
        : null;

  return parsed === literal ? literal : null;
}

function readPostMeta(slug: string, dir: string): PostMeta {
  const file = join(dir, `${slug}.mdx`);
  const source = readFileSync(file, "utf8");
  const { data } = matter(source);
  const frontmatter = source.match(FRONTMATTER_BLOCK)?.[1] ?? "";

  const fail = (why: string): never => {
    throw new Error(`${slug}.mdx frontmatter ${why}`);
  };

  if (typeof data.title !== "string" || data.title.trim() === "") {
    fail("needs a non-empty title");
  }
  const date =
    normalizeDate(data.date, frontmatter) ??
    fail("needs a valid calendar date as an ISO string (yyyy-mm-dd)");
  if (typeof data.summary !== "string" || data.summary.trim() === "") {
    fail("needs a non-empty summary");
  }
  if (
    !Array.isArray(data.tags) ||
    data.tags.some((tag: unknown) => typeof tag !== "string")
  ) {
    fail("needs tags as an array of strings");
  }

  return {
    slug,
    title: data.title,
    date,
    summary: data.summary,
    tags: data.tags,
  };
}

function readPosts(dir: string): PostMeta[] {
  const slugs = readdirSync(dir)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => name.slice(0, -4));

  return slugs
    .map((slug) => readPostMeta(slug, dir))
    .sort(
      (a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug),
    );
}

// Production content is static for the lifetime of a build or server instance.
// Hoisting it prevents every route consumer from rereading and reparsing all MDX.
const PRODUCTION_POSTS = readPosts(POSTS_DIR);

/** Every post in the directory, newest-first. Adding a file and rebuilding publishes it. */
export function listPosts(dir: string = POSTS_DIR): PostMeta[] {
  return dir === POSTS_DIR ? PRODUCTION_POSTS : readPosts(dir);
}

/** Human date for the chrome: 27 Aug 2026. UTC-pinned so it never drifts. */
export function formatPostDate(date: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
