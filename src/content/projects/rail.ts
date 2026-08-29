import type { RailProject } from "./schema";

/**
 * The more-projects rail: a hand-picked slice of the work beyond the four
 * featured projects. Curated deliberately — the rail is a selection, never a
 * dump of every public repo (ADR 0004, and the v1 scope in the wayfinder map).
 *
 * Order is the reading order on the page: the two projects with the most to
 * say first, then the lighter sketches, then the local-only work.
 *
 * Copy is grounded in each repo's own README or GitHub description; entries
 * with only a description are kept to a single sentence restating it rather
 * than inventing detail.
 */
const rail: readonly RailProject[] = [
  {
    title: "Interstellar Exchange",
    slug: "interstellar-exchange",
    pitch:
      "An electronic equities exchange: it reads a live quote feed off ActiveMQ, groups bids and asks by symbol, and executes eligible pairs at the midpoint of the spread.",
    links: { repo: "https://github.com/msmele345/interstellar-exchange" },
    stack: ["Java", "Spring Boot", "ActiveMQ", "Docker"],
  },
  {
    title: "Algorithm Cloud Processor",
    slug: "algorithm-cloud-processor",
    pitch:
      "A Spring Integration pipeline: Kafka in, typed transforms, MongoDB out, and anything that fails routed to a RabbitMQ error exchange.",
    links: { repo: "https://github.com/msmele345/algorithm-cloud-processor" },
    stack: [
      "Kotlin",
      "Spring Integration",
      "Spring Cloud Stream",
      "Kafka",
      "MongoDB",
    ],
  },
  {
    title: "Livequotes",
    slug: "livequotes",
    pitch:
      "The quote feed behind Interstellar Exchange: it generates bid/ask quotes, persists them, and routes them to JMS clients over ActiveMQ.",
    links: { repo: "https://github.com/msmele345/livequotes" },
    stack: ["Java", "Spring JMS", "ActiveMQ", "SQL Server"],
  },
  {
    title: "Screens",
    slug: "screens",
    pitch:
      "A concert image gallery — a React and TypeScript front end over a Spring Boot backend.",
    links: { repo: "https://github.com/msmele345/screens" },
    stack: ["TypeScript", "React", "Spring Boot"],
  },
  {
    title: "Buzzball",
    slug: "buzzball",
    pitch: "Advanced MLB metrics, put in front of the people who read them.",
    // The remote's casing is load-bearing: enrichment sends it to GitHub verbatim.
    links: { repo: "https://github.com/msmele345/Buzzball" },
    stack: ["TypeScript", "React", "Vite"],
  },
  {
    title: "Scholar",
    slug: "scholar",
    pitch:
      "A local-first workspace for Azure AI-103 and AZ-400 study — notes, progress, and practice attempts, persisted in the browser with no backend behind them.",
    links: {},
    unlinkedNote: "Not published — private repository",
    stack: ["React 19", "TypeScript", "Vite", "Vitest"],
  },
];

export function listRailProjects(): readonly RailProject[] {
  return rail;
}
