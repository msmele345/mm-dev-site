import { expect, test } from "@playwright/test";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import {
  addSyntheticIdentity,
  createShowcaseApp,
  syntheticProject,
  writeFeaturedSelection,
  writePublishedSelection,
} from "./support/showcase-app";
import { buildTransmissionApp, runTransmissionBuild } from "./support/transmission-app";

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

test("an unfinished record that is neither published nor featured does not block the build", async ({}, info) => {
  test.setTimeout(180_000);
  const dir = createShowcaseApp();
  try {
    addSyntheticIdentity(dir, {
      project: { ...syntheticProject(), title: "", pitch: "", story: [], screenshots: [], stack: [] },
      publish: false,
      register: false,
    });
    writeFileSync(info.outputPath("build.log"), await buildTransmissionApp(dir));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("a published identity with an unfinished marker fails the build", async ({}, info) => {
  test.setTimeout(180_000);
  const dir = createShowcaseApp();
  try {
    addSyntheticIdentity(dir);
    const tile = `${dir}/src/components/showcase/identities/signal-loom/Tile.tsx`;
    writeFileSync(tile, `${readFileSync(tile, "utf8")}\n/* onboarding:unfinished */\n`);
    const result = await runTransmissionBuild(dir);
    writeFileSync(info.outputPath("build.log"), result.output);
    expect(result.exitCode).toBe(1);
    expect(result.output).toContain('Showcase "signal-loom": presentation contains onboarding:unfinished marker');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("a published project with stale generated registration fails the build", async ({}, info) => {
  test.setTimeout(180_000);
  const dir = createShowcaseApp();
  try {
    addSyntheticIdentity(dir);
    const barrel = `${dir}/src/components/showcase/identities.generated.ts`;
    writeFileSync(barrel, `${readFileSync(barrel, "utf8")}\n// stale\n`);
    const result = await runTransmissionBuild(dir);
    writeFileSync(info.outputPath("build.log"), result.output);
    expect(result.exitCode).toBe(1);
    expect(result.output).toContain('Showcase "signal-loom": does not match authored files and identity directories; run npm run registration');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("an authored filename that disagrees with its record slug fails the build", async ({}, info) => {
  test.setTimeout(180_000);
  const dir = createShowcaseApp();
  try {
    addSyntheticIdentity(dir, { project: { ...syntheticProject(), slug: "signal-loon" } });
    const result = await runTransmissionBuild(dir);
    writeFileSync(info.outputPath("build.log"), result.output);
    expect(result.exitCode).toBe(1);
    expect(result.output).toContain('Project "signal-loon": authored/signal-loom.ts filename must match record slug "signal-loon"');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
