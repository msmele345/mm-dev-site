import type { Project } from "../schema";

export const soundCity = {
  title: "Sound City",
  slug: "sound-city",
  pitch:
    "A dark house and techno finder built on source-verified Chicago event data — from discovery and ingestion through a maintainer review queue before anything becomes public.",
  invitation: "Find a show",
  draft: true,
  tile: {
    motif: "club flyer",
    displayFace: "Bebas Neue",
    palette: {
      ground: "#08090b",
      panel: "#17171b",
      ink: "#f1eee8",
      mute: "#97949a",
      accent: "#ffb000",
    },
  },
  story: [
    {
      kind: "problem",
      heading: "A scene scattered across sources",
      body: "Chicago house and techno discovery is fragmented across venue calendars, Resident Advisor, ticketing pages, promoters, and social posts. Finding smaller nights often means already knowing which rooms, artists, and sources to watch.",
    },
    {
      kind: "build",
      heading: "Ingest broadly, publish carefully",
      body: "Next.js route handlers, Neon Postgres, and Drizzle model city-aware events, venues, artists, source evidence, and verification dates. Refresh targets produce reviewable suggestions; a maintainer accepts or rejects changes. The system avoids broad crawling and never turns a parser result directly into a public listing.",
    },
    {
      kind: "result",
      heading: "Discovery with receipts",
      body: "The product pairs a dense event finder with source links, last-verified timestamps, taste signals, venue context, and an auditable refresh queue. Its industrial warehouse interface stays specific to Chicago club culture while the data workflow protects trust.",
    },
  ],
  screenshots: [
    {
      src: "/projects/sound-city/queue.svg",
      alt: "Chicago review queue with Smartbar, Podlasie, and Spybar rows, source evidence, and accept or reject controls.",
      caption: "The review queue and its source trail.",
    },
    {
      src: "/projects/sound-city/events.svg",
      alt: "Tonight listing for Chicago with Smartbar at 23:00 and Podlasie Club at 22:00, both source verified.",
      caption: "The Chicago event finder.",
    },
  ],
  links: {
    repo: "https://github.com/msmele345/sound-city",
    demo: "https://sound-city-ten.vercel.app",
  },
  stack: ["Next.js", "React", "TypeScript", "Neon Postgres", "Drizzle ORM", "Vercel"],
} as const satisfies Project;
