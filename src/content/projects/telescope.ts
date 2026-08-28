import type { Project } from "./schema";

export const telescope = {
  title: "Telescope",
  slug: "telescope",
  pitch:
    "A shipped web planetarium that renders roughly 9,000 real stars for a visitor’s location and time — with a beautiful 3D sky and an accessible path into the same astronomy.",
  draft: true,
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
      body: "Textbook charts are flat, planetarium software can be heavy, and phone apps often assume the learner already knows what they are seeing. Telescope starts with the sky itself: personal, immediate, and explorable before an account is ever required.",
    },
    {
      kind: "build",
      heading: "Astronomy beneath a thin renderer",
      body: "Pure, unit-tested sky-math, time-controller, star-catalog, and zipcode modules do the hard work. React Three Fiber renders the result inside a celestial dome; astronomy-engine places the Sun, Moon, and planets. Instanced points keep roughly 9,000 Yale Bright Star Catalog objects fluid.",
    },
    {
      kind: "result",
      heading: "A real sky, ready to learn",
      body: "The shipped product supports location, time travel, constellation lessons, favorites, and a searchable keyboard- and screen-reader-friendly alternative to the 3D scene. A Hipparcos cross-match raised star-distance coverage from 34% to more than 99%.",
    },
  ],
  screenshots: [
    {
      src: "/projects/telescope/sky.svg",
      alt: "Draft plate of Telescope rendering a local night sky above a compass horizon.",
      caption: "Draft plate — the local sky and horizon. Replace with a live capture.",
    },
    {
      src: "/projects/telescope/lesson.svg",
      alt: "Draft plate of Telescope connecting constellation line art to a mythology lesson.",
      caption: "Draft plate — constellation discovery flowing into a lesson. Replace with a live capture.",
    },
  ],
  links: {
    repo: "https://github.com/msmele345/telescope",
    demo: "https://telescope.vercel.app",
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
