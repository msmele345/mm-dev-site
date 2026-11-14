import type { Project } from "../schema";

export const telescope = {
  title: "Telescope",
  slug: "telescope",
  pitch:
    "A web planetarium that shows roughly 9,000 real stars as they look from your US zip code, right now. Look around, speed up time, and follow a constellation into its mythology.",
  invitation: "Explore the sky",
  draft: false,
  tile: {
    motif: "star field",
    displayFace: "Bebas Neue",
    palette: {
      ground: "#030711",
      panel: "#09152b",
      ink: "#eef6ff",
      mute: "#8da7c7",
      accent: "#79c9ff",
    },
  },
  story: [
    {
      kind: "problem",
      heading: "The sky without the intimidation",
      body: "Textbook star charts are flat, planetarium software can feel heavy and intimidating, and phone apps often assume you already know what you’re looking at. Telescope starts with the sky itself: the stars over your town, ready to explore without an account.",
    },
    {
      kind: "build",
      heading: "Careful math under a 3D sky",
      body: "The math that works out where each star sits for your place and time lives in small, tested pieces of code, kept apart from the graphics. A 3D scene draws the result as a dome around you, with the Sun, Moon, and planets in their real positions, and stays smooth on mid-range laptops. Enter a US zip code for your own sky, drag to look around, and speed up time to watch the sky turn.",
    },
    {
      kind: "result",
      heading: "A real sky, ready to learn",
      body: "Click a star to see its name, brightness, and distance, then follow its constellation into its mythology and a lesson. Signing in is optional and lets you save favorites and mark lessons as read. A searchable list that works with a keyboard and screen reader sits alongside the 3D view. Matching the catalog against a second star survey raised the share of stars with a known distance from 34% to over 99%.",
    },
  ],
  screenshots: [
    {
      src: "/projects/telescope/sky.svg",
      alt: "Local sky at 22:14 with stars, Orion line art, a horizon, and compass headings.",
      caption: "The local sky and horizon.",
    },
    {
      src: "/projects/telescope/lesson.svg",
      alt: "Orion line art beside a constellation lesson panel and a read the myth control.",
      caption: "A constellation, then the lesson.",
    },
  ],
  links: {
    repo: "https://github.com/msmele345/telescope",
    demo: "https://www.my-telescope.dev",
  },
  stack: [
    "Next.js",
    "React",
    "Three.js",
    "React Three Fiber",
    "astronomy-engine",
    "Postgres",
  ],
} as const satisfies Project;
