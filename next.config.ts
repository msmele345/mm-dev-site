import type { NextConfig } from "next";
import createMDX from "@next/mdx";

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
