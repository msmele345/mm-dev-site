import type { Metadata, Viewport } from "next";
import { Bebas_Neue, IBM_Plex_Mono } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { socialMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import "./globals.css";

const display = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const body = IBM_Plex_Mono({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${site.wordmark}`,
  },
  description: site.description,
  ...socialMetadata({
    title: site.title,
    description: site.description,
    path: "/",
  }),
  // Emits the <link rel="alternate"> that makes the feed discoverable to readers.
  alternates: {
    types: { "application/rss+xml": site.feedPath },
  },
};

/**
 * Tells the browser chrome — Android address bar, iOS PWA status bar — the
 * page is ink-black, so it stops painting a light strip above a dark site.
 * Kept in step with `--color-ink` in globals.css.
 */
export const viewport: Viewport = {
  themeColor: "#08090b",
  // Without this the page is letterboxed inside the safe area and every
  // env(safe-area-inset-*) resolves to 0 — which would make the inset on
  // `body` in globals.css do nothing on the exact hardware it targets.
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
