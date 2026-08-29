import type { MDXComponents } from "mdx/types";

/**
 * Global MDX component map. Post styling is CSS scoped under `.post`, so
 * nothing needs remapping yet; embeds are imported inside the posts that
 * use them.
 */
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
