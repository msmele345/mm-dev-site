import { site } from "@/lib/site";

type OgType = "website" | "article";

type SocialPage<T extends OgType> = {
  title: string;
  description: string;
  path: string;
  /** `article` for posts and case studies; the site's other pages are pages. */
  type?: T;
  /** Article-only: the post's publication date and tags. */
  publishedTime?: string;
  tags?: readonly string[];
};

/**
 * The resolved Open Graph and Twitter block for one page. Typed structurally
 * rather than as `Metadata` so the Open Graph kind stays a literal — Next's
 * `OpenGraph` is a discriminated union, and a widened `type` matches no member.
 */
export type SocialTags<T extends OgType> = {
  openGraph: {
    type: T;
    title: string;
    description: string;
    url: string;
    siteName: string;
    locale: string;
    publishedTime?: string;
    tags?: readonly string[];
  };
  twitter: {
    card: "summary_large_image";
    title: string;
    description: string;
  };
};

/**
 * Next resolves metadata by replacing an object wholesale, not by merging into
 * it — a page that sets `twitter: { title }` drops the root's
 * `card: "summary_large_image"` and its link preview silently shrinks to a
 * thumbnail. Every page builds its social block here, so the card type and the
 * site name are each stated exactly once (issue 07).
 */
export function socialMetadata<T extends OgType = "website">({
  title,
  description,
  path,
  type,
  publishedTime,
  tags,
}: SocialPage<T>): SocialTags<T> {
  return {
    openGraph: {
      type: (type ?? "website") as T,
      title,
      description,
      url: path,
      siteName: site.wordmark,
      locale: "en_US",
      ...(publishedTime ? { publishedTime } : {}),
      ...(tags ? { tags } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
