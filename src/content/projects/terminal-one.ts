import type { Project } from "./schema";

export const terminalOne = {
  title: "Terminal One",
  slug: "terminal-one",
  pitch:
    "A single-user desktop trading cockpit — NYSE-floor terminal crossed with a late-night slot machine — that monitors positions and runs a deterministic options-trade recommendation engine.",
  draft: true,
  tile: {
    motif: "trading terminal",
    displayFace: "IBM Plex Mono",
    palette: {
      ground: "#07080a",
      panel: "#10141a",
      ink: "#d7ffe3",
      mute: "#6f8a78",
      accent: "#39ff14",
    },
  },
  story: [
    {
      kind: "problem",
      heading: "Opinionated, and auditable",
      body: "Most trading UIs are either a spreadsheet or a slot-machine skin. Neither gives a self-directed options trader a second opinion they can audit line by line — or a record of how those calls actually play out.",
    },
    {
      kind: "build",
      heading: "Rules engine, neon thin client",
      body: "A Spring Boot service owns the deterministic recommendation engine, JWT auth, and Postgres. The Electron desktop is a neon thin client: Portfolio Console, Slot Machine, Paper/Taken Ledger. Market data is delayed; greeks and IV are computed in-house. It never routes a live order.",
    },
    {
      kind: "result",
      heading: "Pull the lever, keep the ledger",
      body: "EOD batch plus on-demand lever pulls emit ranked, explainable trades. Paper settlement and a mark-as-taken path build a real track record. Advisory only — not financial advice.",
    },
  ],
  screenshots: [
    {
      src: "/projects/terminal-one/console.svg",
      alt: "Draft plate of the Terminal One portfolio console with phosphor tickers.",
      caption: "Draft plate — console still. Replace with a live capture.",
    },
  ],
  links: {
    repo: "https://github.com/msmele345/terminal-one",
  },
  stack: [
    "Spring Boot",
    "Java 21",
    "Postgres",
    "Electron",
    "React",
    "TypeScript",
  ],
} as const satisfies Project;
