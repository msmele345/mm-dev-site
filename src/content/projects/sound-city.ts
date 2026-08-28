import type { Project } from "./schema";

export const soundCity = {
  title: "Sound City",
  slug: "sound-city",
  pitch:
    "A dark house and techno finder built on source-verified Chicago event data — from discovery and ingestion through a maintainer review queue before anything becomes public.",
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
      alt: "Draft plate of the Sound City event review queue with source evidence.",
      caption: "Draft plate — the event review queue and source trail. Replace with a live capture.",
    },
    {
      src: "/projects/sound-city/events.svg",
      alt: "Draft plate of Sound City listing verified Chicago house and techno events.",
      caption: "Draft plate — the dense Chicago event finder. Replace with a live capture.",
    },
  ],
  links: {
    repo: "https://github.com/msmele345/sound-city",
    demo: "https://sound-city.vercel.app",
  },
  stack: ["Next.js", "React", "TypeScript", "Neon Postgres", "Drizzle ORM", "Vercel"],
} as const satisfies Project;
