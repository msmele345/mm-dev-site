import type { RailProject } from "./schema";

/**
 * Candidate entries for the more-projects rail, and the selection that is
 * actually shown.
 *
 * The two are deliberately separate. Curating the rail is an editorial act
 * that happens far more often than writing a new entry — the wall's four
 * projects are the site's fixed argument, while the rail is "what else there
 * is right now". Keeping a written entry around after it leaves the rail
 * means the next rotation is a one-line change to RAIL_SLUGS rather than
 * re-researching a repo from scratch.
 *
 * To change the rail: edit RAIL_SLUGS. Its order is the order on the page.
 *
 * Copy is grounded in each repo's own README, or — where a repo has none —
 * its GitHub description and build file, kept to a single sentence rather
 * than embellished into claims the sources do not make.
 */
const entries: readonly RailProject[] = [
  {
    title: "Screens",
    slug: "screens",
    pitch:
      "A concert image gallery — a React and TypeScript front end over a Spring Boot backend.",
    links: { repo: "https://github.com/msmele345/screens" },
    stack: ["TypeScript", "React", "Spring Boot"],
  },
  {
    title: "Feedback Listener",
    slug: "feedback-listener",
    pitch:
      "Consumes feedback messages off Azure Service Bus and persists them to Cosmos DB, with secrets held in Key Vault.",
    links: { repo: "https://github.com/msmele345/feedback-listener" },
    stack: ["Java", "Spring Boot", "Azure Service Bus", "Cosmos DB"],
  },
  {
    title: "Interstellar Exchange",
    slug: "interstellar-exchange",
    pitch:
      "An electronic equities exchange: it reads a live ActiveMQ quote feed and executes eligible bid/ask pairs at the midpoint of the spread.",
    links: { repo: "https://github.com/msmele345/interstellar-exchange" },
    stack: ["Java", "Spring Boot", "ActiveMQ", "Docker"],
  },
  {
    title: "Buzzball",
    slug: "buzzball",
    pitch: "Advanced MLB metrics — a React and TypeScript front end over them.",
    // The remote's casing is load-bearing: enrichment sends it to GitHub verbatim.
    links: { repo: "https://github.com/msmele345/Buzzball" },
    stack: ["TypeScript", "React", "Vite"],
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
];

/** The rail, in page order. Edit this to rotate what the rail shows. */
const RAIL_SLUGS = [
  "screens",
  "feedback-listener",
  "interstellar-exchange",
  "buzzball",
] as const;

export function listRailEntries(): readonly RailProject[] {
  return entries;
}

export function listRailProjects(): readonly RailProject[] {
  return RAIL_SLUGS.map((slug) =>
    entries.find((entry) => entry.slug === slug),
  ).filter((entry): entry is RailProject => entry !== undefined);
}
