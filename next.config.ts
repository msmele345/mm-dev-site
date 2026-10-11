import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { currentTransmission } from "./src/content/current-transmission";
import { listCaseStudySlugs, listProjects, listWallProjects } from "./src/content/projects/catalog";
import { validateShowcaseContent } from "./src/content/projects/readiness";
import { validateTransmissionEditorial } from "./src/lib/current-transmission";

// The editorial enforcement point: Next loads this config for both dev
// and build, before type checking or page rendering. Mistyped editorial edits
// therefore fail with the exact content field ahead of generic type diagnostics.
validateTransmissionEditorial(currentTransmission);

// The same enforcement point for the showcase: an incomplete or contradictory
// catalogue, publication list, or featured selection stops dev and build with
// the offending slug and field. Local files only — a missing remote or an
// unreachable GitHub is never a readiness failure (ADR 0004). A published
// project with no registered presentation fails where its art is resolved.
validateShowcaseContent({
  projects: listProjects(),
  publishedSlugs: listCaseStudySlugs(),
  assetExists: publicFileExists,
});
// Called for its checks alone: duplicate, unknown, or unpublished featured slugs throw.
listWallProjects();

/**
 * Whether a root-relative path names a file under `public/`, matching case
 * exactly: a mis-cased path resolves on a case-insensitive development disk
 * and then 404s on the deployed, case-sensitive one.
 */
function publicFileExists(src: string): boolean {
  let directory = join(process.cwd(), "public");
  for (const segment of src.split("/").filter(Boolean)) {
    if (!statSync(directory, { throwIfNoEntry: false })?.isDirectory()) return false;
    if (!readdirSync(directory).includes(segment)) return false;
    directory = join(directory, segment);
  }
  return statSync(directory, { throwIfNoEntry: false })?.isFile() ?? false;
}

/**
 * Seed the per-build enrichment cache key (ADR 0004).
 *
 * Next's Data Cache survives between builds — Vercel restores it across
 * deployments — so build-time GitHub stats would freeze at whatever the first
 * build fetched, and the scheduled rebuild would keep rebaking them. Every
 * enrichment request carries this value as a header, which changes the cache
 * key once per build while leaving the pages statically prerendered.
 *
 * Set here, in the parent build process, so every static-generation worker
 * inherits the same value and a repo is still fetched only once per build.
 */
process.env.ENRICHMENT_BUILD_ID ??=
  process.env.VERCEL_DEPLOYMENT_ID ?? String(Date.now());

const nextConfig: NextConfig = {
  // Blog posts are in-repo .mdx files (ADR 0005).
  pageExtensions: ["ts", "tsx", "mdx"],
};

/**
 * Wrap with MDX support. Plugins are declared as string names (with
 * serializable options) because the build runs on Turbopack, which cannot
 * receive JavaScript functions.
 */
const withMDX = createMDX({
  options: {
    // remark-frontmatter lifts the YAML block out of the markdown so it is
    // never rendered as content; remark-mdx-frontmatter re-exports it as a
    // `frontmatter` constant on the compiled module.
    remarkPlugins: [
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
    ],
    rehypePlugins: [
      ["rehype-pretty-code", { theme: "min-dark", keepBackground: false }],
    ],
  },
});

export default withMDX(nextConfig);
