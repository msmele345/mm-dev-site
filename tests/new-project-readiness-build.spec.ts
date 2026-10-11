import { expect, test } from "@playwright/test";
import { rmSync, writeFileSync } from "node:fs";
import {
  addSyntheticIdentity,
  createShowcaseApp,
  syntheticProject,
  writeFeaturedSelection,
  writePublishedSelection,
} from "./support/showcase-app";
import { runTransmissionBuild } from "./support/transmission-app";

const PRODUCTION = ["elevated-bpm", "terminal-one", "telescope", "sound-city"];
const FEATURED = [...PRODUCTION, "signal-loom"];
const plate = syntheticProject().screenshots[0];
const story = syntheticProject().story;

type Fixture = {
  name: string;
  error: string;
  project?: Record<string, unknown>;
  publish?: boolean;
  register?: boolean;
  featured?: readonly string[];
  published?: readonly string[];
};

// Production-shaped apps: the real catalogue plus one new identity that is
// wrong in exactly one way. Each must stop `npm run build`, not just a validator.
const fixtures: Fixture[] = [
  { name: "a blank title", project: { title: "  " }, error: 'Project "signal-loom": title must be a non-empty string' },
  { name: "a missing pitch", project: { pitch: undefined }, error: 'Project "signal-loom": pitch must be a non-empty string' },
  { name: "an empty stack", project: { stack: [] }, error: 'Project "signal-loom": stack must list at least one label' },
  {
    name: "a blank narrative body",
    project: { story: story.map((section) => (section.kind === "build" ? { ...section, body: "" } : section)) },
    error: 'Project "signal-loom": story.build.body must be a non-empty string',
  },
  {
    name: "a missing image description",
    project: { screenshots: [{ ...plate, alt: "" }] },
    error: 'Project "signal-loom": screenshots[0].alt must be a non-empty string',
  },
  {
    name: "an unresolved local image",
    project: { screenshots: [{ ...plate, src: "/projects/signal-loom/missing.svg" }] },
    error: 'Project "signal-loom": screenshots[0].src "/projects/signal-loom/missing.svg" does not resolve to a file in public/',
  },
  {
    name: "a mis-cased local image",
    project: { screenshots: [{ ...plate, src: "/projects/signal-loom/Plate.svg" }] },
    error: 'Project "signal-loom": screenshots[0].src "/projects/signal-loom/Plate.svg" does not resolve to a file in public/',
  },
  {
    name: "a non-HTTPS repository link",
    project: { links: { repo: "http://github.com/msmele345/signal-loom" } },
    error: 'Project "signal-loom": links.repo must be an absolute HTTPS URL',
  },
  { name: "a placeholder demo link", project: { links: { demo: "#" } }, error: 'Project "signal-loom": links.demo must be an absolute HTTPS URL' },
  {
    name: "an invalid route slug",
    project: { slug: "Signal Loom" },
    publish: false,
    featured: PRODUCTION,
    error: 'Project "Signal Loom": slug must be a lowercase kebab-case route segment',
  },
  {
    name: "a duplicate catalogue slug",
    project: { slug: "telescope" },
    publish: false,
    featured: PRODUCTION,
    error: 'Project "telescope": duplicate catalogue slug; every authored project needs its own slug',
  },
  {
    name: "a published slug nobody authored",
    published: [...PRODUCTION, "signal-loom", "signal-loon"],
    error: 'Published case study "signal-loon": unknown project; use an authored catalogue slug',
  },
  {
    name: "a case study published twice",
    published: [...PRODUCTION, "signal-loom", "signal-loom"],
    error: 'Published case study "signal-loom": duplicate slug; publish each case study only once',
  },
  { name: "a featured project that was never published", publish: false, error: 'Featured selection "signal-loom": no published case-study destination' },
  { name: "a missing presentation registration", register: false, error: 'Showcase "signal-loom": missing presentation registration' },
];

for (const { name, error, project, publish, register, featured = FEATURED, published } of fixtures) {
  test(`the real build rejects ${name} with the slug and problem named`, async ({}, info) => {
    test.setTimeout(180_000);
    const dir = createShowcaseApp();
    try {
      addSyntheticIdentity(dir, { project: { ...syntheticProject(), ...project }, publish, register });
      if (published) writePublishedSelection(dir, published);
      writeFeaturedSelection(dir, featured);
      const result = await runTransmissionBuild(dir);
      writeFileSync(info.outputPath("build.log"), result.output);
      expect(result.signal).toBeNull();
      expect(result.exitCode).toBe(1);
      expect(result.output).toContain(error);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
}
