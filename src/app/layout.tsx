import type { Metadata } from "next";
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
