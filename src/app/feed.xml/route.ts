import { buildFeed } from "@/lib/feed";
import { listPosts } from "@/lib/posts";
import { site } from "@/lib/site";

// Posts are in-repo MDX (ADR 0005), so the feed is fully known at build time.
// Without this the handler would be treated as dynamic and rendered per request.
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(
    buildFeed(listPosts(), {
      url: site.url,
      title: site.blogTitle,
      description: site.blogDescription,
      author: site.author,
    }),
    {
      headers: {
        "content-type": "application/rss+xml; charset=utf-8",
        "cache-control": "public, max-age=0, s-maxage=3600, must-revalidate",
      },
    },
  );
}
