import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { currentTransmission } from "./src/content/current-transmission";
import { listAuthoredFileRecords, listCaseStudySlugs, listProjects } from "./src/content/projects/catalog";
import selection from "./src/content/projects/selection.json";
import { validateShowcaseContent } from "./src/content/projects/readiness";
import { collectShowcaseFilesystemFacts } from "./src/content/projects/filesystem-facts";
import { validateTransmissionEditorial } from "./src/lib/current-transmission";

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

export default function config(): NextConfig {
  // The editorial enforcement point: Next loads this config for both dev
  // and build, before type checking or page rendering. Mistyped editorial edits
  // therefore fail with the exact content field ahead of generic type diagnostics.
  validateTransmissionEditorial(currentTransmission);

  // Keep readiness aligned with the command by deriving the same filesystem facts.
  const projects = listProjects();
  validateShowcaseContent({
    projects,
    publishedSlugs: listCaseStudySlugs(),
    featuredSlugs: selection.featured,
    ...collectShowcaseFilesystemFacts(process.cwd(), listAuthoredFileRecords()),
  });

  // Seed the per-build enrichment cache key (ADR 0004). Next's Data Cache
  // survives between builds, so each build needs a new value to refresh GitHub
  // stats. Setting it here lets all static-generation workers share one key.
  process.env.ENRICHMENT_BUILD_ID ??=
    process.env.VERCEL_DEPLOYMENT_ID ?? String(Date.now());
  return withMDX(nextConfig);
}
