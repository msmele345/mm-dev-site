import type { Project } from "../schema";

export const terminalOne = {
  title: "Terminal One",
  slug: "terminal-one",
  pitch:
    "A personal desktop app that tracks a stock and options portfolio and suggests options trades, with the reasoning behind each one. Think trading-floor terminal crossed with a late-night slot machine.",
  invitation: "Pull the lever",
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
      heading: "A second opinion you can check",
      body: "Terminal One is built for one person: a self-directed options trader who wants a fast second opinion they can trust, and a record of how those suggestions actually play out. A suggestion only helps if you can see why it was made.",
    },
    {
      kind: "build",
      heading: "Fixed rules, neon screen",
      body: "A server does the work. It follows fixed rules rather than AI, so the same market data always produces the same suggestions, and each one lists the signals behind it. The server runs all the time, so the nightly check happens even when the laptop is closed. The desktop app is the neon screen on top, with three views: a portfolio console, a slot machine that runs the engine, and a trade ledger. Prices are 15 minutes delayed, and the app never places a real trade.",
    },
    {
      kind: "result",
      heading: "Pull the lever, keep the ledger",
      body: "After each market close, and whenever you pull the lever, the app ranks a short list of trade ideas and explains each one. Every idea goes into a paper ledger, a practice record of how it would have done. Trades you actually make can be marked as taken, which builds a real track record next to the practice one. Advisory only. Not financial advice.",
    },
  ],
  screenshots: [
    {
      src: "/projects/terminal-one/console.svg",
      alt: "Portfolio console with AAPL and NVDA quotes, a delayed advisory notice, and a pull lever control.",
      caption: "The portfolio console. Delayed quotes, advisory only.",
    },
    {
      src: "/projects/terminal-one/ledger.svg",
      alt: "Paper and taken ledger with SPY, QQQ, and NVDA rows, rank, state, and a why-this-trade note.",
      caption: "The paper and taken ledger.",
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
