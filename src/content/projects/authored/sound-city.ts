import type { Project } from "../schema";

export const soundCity = {
  title: "Sound City",
  slug: "sound-city",
  pitch:
    "A Chicago house and techno guide that helps you find smaller, underground shows. Every listing links to its source, and a person checks each change before it goes live.",
  invitation: "Find a show",
  draft: false,
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
      body: "Chicago’s house and techno nights are spread across venue calendars, Resident Advisor, ticket pages, promoters, and social posts. Finding the smaller and underground ones often means already knowing which venues, promoters, or artists to follow.",
    },
    {
      kind: "build",
      heading: "Find events widely, publish carefully",
      body: "Sound City checks a set of trusted sources, such as Resident Advisor and official venue calendars, for upcoming events. It doesn’t publish what it finds. Each find becomes a suggestion in a review queue, where a maintainer sees exactly what changed and accepts or rejects it. It reads only the sources it’s given rather than crawling the web, and nothing reaches the public listings without review.",
    },
    {
      kind: "result",
      heading: "Discovery with receipts",
      body: "Visitors get a dense feed of upcoming events, with recommendations tuned to the taste they set in their browser, no account needed. Each event shows its source link and when it was last verified, and venues come with notes on sound, crowd, and room size. The look borrows from Chicago warehouse clubs, so it feels local rather than generic.",
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
