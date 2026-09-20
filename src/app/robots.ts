import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/**
 * The whole site is meant to be indexed. The sitemap is advertised at the
 * canonical origin, not at whatever host served this file, so a crawler that
 * reaches a `.vercel.app` copy is still pointed at the custom domain (issue 10).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    // No `host:` directive — only Yandex reads it, and Next emits it as a full
    // URL where the directive is defined as a bare hostname.
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
