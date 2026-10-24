import { expect, test } from "@playwright/test";
import { collectShowcaseFindings, validateShowcaseContent, type ShowcaseContent } from "@/content/projects/readiness";
import type { Project } from "@/content/projects/schema";

function readyProject(overrides: Record<string, unknown> = {}): Project {
  return {
    title: "Signal Loom",
    slug: "signal-loom",
    pitch: "A synthetic project that weaves signals.",
    draft: true,
    tile: {
      motif: "woven signal",
      displayFace: "Bebas Neue",
      palette: { ground: "#120a1f", panel: "#1d1230", ink: "#f6efff", mute: "#a394bd", accent: "#ff5ad1" },
    },
    story: [
      { kind: "problem", heading: "Loose threads", body: "Signals arrive unordered." },
      { kind: "build", heading: "A loom", body: "Threads are woven into a fabric." },
      { kind: "result", heading: "Cloth", body: "The fabric holds." },
    ],
    screenshots: [
      { src: "/projects/signal-loom/plate.svg", alt: "Draft plate of the loom.", caption: "Draft plate — the loom." },
    ],
    links: {},
    stack: ["TypeScript"],
    ...overrides,
  } as Project;
}

function content(projects: readonly Project[], overrides: Partial<ShowcaseContent> = {}): ShowcaseContent {
  return {
    projects,
    publishedSlugs: projects.map((project) => project.slug),
    assetExists: () => true,
    ...overrides,
  };
}

const validate = (overrides: Record<string, unknown>) => () =>
  validateShowcaseContent(content([readyProject(overrides)]));

test("a complete record with no remote, draft copy, and a labeled draft plate is ready", () => {
  expect(() => validateShowcaseContent(content([readyProject()]))).not.toThrow();
  expect(validate({ links: { repo: "https://github.com/msmele345/signal-loom", demo: "https://loom.example.com" } })).not.toThrow();
  // Authored but neither published nor featured: a legitimate resting state.
  expect(() => validateShowcaseContent(content([readyProject()], { publishedSlugs: [] }))).not.toThrow();
});

for (const [name, overrides, error] of [
  ["a blank title", { title: " \t" }, 'Project "signal-loom": title must be a non-empty string'],
  ["a missing pitch", { pitch: undefined }, 'Project "signal-loom": pitch must be a non-empty string'],
  ["a missing draft flag", { draft: undefined }, 'Project "signal-loom": draft must be true or false'],
  [
    "an incomplete step quad",
    { tile: { ...readyProject().tile, palette: { ...readyProject().tile!.palette, steps: ["#fff", "#fff"] } } },
    'Project "signal-loom": tile.palette.steps must list four hex colours',
  ],
  ["an empty stack", { stack: [] }, 'Project "signal-loom": stack must list at least one label'],
  ["a blank stack label", { stack: ["React", ""] }, 'Project "signal-loom": stack[1] must be a non-empty string'],
  ["a missing tile identity", { tile: undefined }, 'Project "signal-loom": tile must define the tile identity'],
  ["a blank motif", { tile: { ...readyProject().tile, motif: "" } }, 'Project "signal-loom": tile.motif must be a non-empty string'],
  ["a blank display face", { tile: { ...readyProject().tile, displayFace: " " } }, 'Project "signal-loom": tile.displayFace must be a non-empty string'],
  [
    "a non-hex palette colour",
    { tile: { ...readyProject().tile, palette: { ...readyProject().tile!.palette, accent: "hotpink" } } },
    'Project "signal-loom": tile.palette.accent must be a hex colour',
  ],
  [
    "a non-hex step colour",
    { tile: { ...readyProject().tile, palette: { ...readyProject().tile!.palette, steps: ["#fff", "#fff", "red", "#fff"] } } },
    'Project "signal-loom": tile.palette.steps[2] must be a hex colour',
  ],
  ["a missing narrative section", { story: readyProject().story.slice(0, 2) }, 'Project "signal-loom": story must contain problem, build, and result sections in that order'],
  ["a reordered narrative", { story: [...readyProject().story].reverse() }, 'Project "signal-loom": story must contain problem, build, and result sections in that order'],
  [
    "a blank story heading",
    { story: readyProject().story.map((section) => (section.kind === "build" ? { ...section, heading: "" } : section)) },
    'Project "signal-loom": story.build.heading must be a non-empty string',
  ],
  [
    "a blank story body",
    { story: readyProject().story.map((section) => (section.kind === "result" ? { ...section, body: "\n" } : section)) },
    'Project "signal-loom": story.result.body must be a non-empty string',
  ],
  ["no reviewable image", { screenshots: [] }, 'Project "signal-loom": screenshots must include at least one image or labeled draft plate'],
  ["a blank image description", { screenshots: [{ ...readyProject().screenshots[0], alt: "" }] }, 'Project "signal-loom": screenshots[0].alt must be a non-empty string'],
  ["a blank caption", { screenshots: [{ ...readyProject().screenshots[0], caption: " " }] }, 'Project "signal-loom": screenshots[0].caption must be a non-empty string'],
  [
    "a remote image source",
    { screenshots: [{ ...readyProject().screenshots[0], src: "https://example.com/plate.png" }] },
    'Project "signal-loom": screenshots[0].src must be a root-relative path to a local asset in public/',
  ],
  [
    "an escaping image source",
    { screenshots: [{ ...readyProject().screenshots[0], src: "/projects/../../secret.svg" }] },
    'Project "signal-loom": screenshots[0].src must be a root-relative path to a local asset in public/',
  ],
  ["a non-HTTPS repository", { links: { repo: "http://github.com/msmele345/signal-loom" } }, 'Project "signal-loom": links.repo must be an absolute HTTPS URL'],
  ["a placeholder demo", { links: { demo: "#" } }, 'Project "signal-loom": links.demo must be an absolute HTTPS URL'],
  ["an executable demo", { links: { demo: "javascript:alert(1)" } }, 'Project "signal-loom": links.demo must be an absolute HTTPS URL'],
  ["a blank repository", { links: { repo: "" } }, 'Project "signal-loom": links.repo must be an absolute HTTPS URL'],
  ["a route slug with spaces", { slug: "Signal Loom" }, 'Project "Signal Loom": slug must be a lowercase kebab-case route segment'],
  ["a nested route slug", { slug: "signal/loom" }, 'Project "signal/loom": slug must be a lowercase kebab-case route segment'],
] as const) {
  test(`${name} names the project and field`, () => {
    expect(validate(overrides)).toThrow(error);
  });
}

test("a record with no usable slug is identified by its catalogue position", () => {
  expect(() => validateShowcaseContent(content([readyProject(), readyProject({ slug: "" })], { publishedSlugs: [] })))
    .toThrow("Project at catalogue position 2: slug must be a lowercase kebab-case route segment");
});

test("duplicate catalogue slugs name the repeated project", () => {
  expect(() => validateShowcaseContent(content([readyProject(), readyProject({ title: "Impostor" })])))
    .toThrow('Project "signal-loom": duplicate catalogue slug; every authored project needs its own slug');
});

test("an unresolved local image names the project, field, and path", () => {
  expect(() => validateShowcaseContent(content([readyProject()], { assetExists: () => false })))
    .toThrow('Project "signal-loom": screenshots[0].src "/projects/signal-loom/plate.svg" does not resolve to a file in public/');
});

test("published references must name an authored project exactly once", () => {
  expect(() => validateShowcaseContent(content([readyProject()], { publishedSlugs: ["ghost"] })))
    .toThrow('Published case study "ghost": unknown project; use an authored catalogue slug');
  expect(() => validateShowcaseContent(content([readyProject()], { publishedSlugs: ["signal-loom", "signal-loom"] })))
    .toThrow('Published case study "signal-loom": duplicate slug; publish each case study only once');
});

test("an unfinished record may rest in the catalogue until it is published", () => {
  const unfinished = readyProject({ title: "", story: [], screenshots: [], tile: undefined, links: { demo: "#" } });
  expect(() => validateShowcaseContent(content([unfinished], { publishedSlugs: [] }))).not.toThrow();
  expect(() => validateShowcaseContent(content([unfinished])))
    .toThrow('Project "signal-loom": title must be a non-empty string');
});

test("collects independent content and selection findings in one pass", () => {
  const findings = collectShowcaseFindings(content([
    readyProject({ title: "", slug: "signal-loom" }),
    readyProject({ slug: "signal-loom" }),
  ], { publishedSlugs: ["ghost", "signal-loom", "signal-loom"] }));

  expect(findings.map(({ slug, subject, message }) => ({ slug, subject, message }))).toEqual([
    { slug: "signal-loom", subject: "title", message: "must be a non-empty string" },
    { slug: "signal-loom", subject: "slug", message: "duplicate catalogue slug; every authored project needs its own slug" },
    { slug: "ghost", subject: "published", message: "unknown project; use an authored catalogue slug" },
    { slug: "signal-loom", subject: "published", message: "duplicate slug; publish each case study only once" },
  ]);
});

test("validation reports every collected finding together", () => {
  expect(() => validateShowcaseContent(content([readyProject({ title: "", pitch: "" })])))
    .toThrow('Project "signal-loom": title must be a non-empty string\nProject "signal-loom": pitch must be a non-empty string');
});

test("build validation allows incomplete unpublished work while the collector reports it", () => {
  const draft = readyProject({ title: "" });
  const input = content([draft], {
    publishedSlugs: [],
    identityDirectories: [{ slug: "signal-loom", complete: true, unfinished: true }],
    generatedRegistrationMatches: true,
  });
  expect(collectShowcaseFindings(input).some((finding) => finding.subject === "title" && !finding.blocksBuild)).toBe(true);
  expect(() => validateShowcaseContent(input)).not.toThrow();
});

test("published readiness gates are independent", () => {
  const project = readyProject();
  const unregistered = collectShowcaseFindings(content([project], {
    identityDirectories: [{ slug: "signal-loom", complete: false, unfinished: false }],
  }));
  expect(unregistered.some((finding) => finding.gate === "presentation-registered")).toBe(true);

  const unfinished = collectShowcaseFindings(content([project], {
    identityDirectories: [{ slug: "signal-loom", complete: true, unfinished: true }],
  }));
  expect(unfinished.some((finding) => finding.gate === "presentation-finished")).toBe(true);

  const contentUnready = collectShowcaseFindings(content([readyProject({ pitch: "" })], {
    identityDirectories: [{ slug: "signal-loom", complete: true, unfinished: false }],
  }));
  expect(contentUnready.some((finding) => finding.gate === "content")).toBe(true);
  expect(contentUnready.some((finding) => finding.gate === "presentation-registered")).toBe(false);
});

test("featured-selection rules join the same finding collection", () => {
  const findings = collectShowcaseFindings(content([readyProject({ pitch: "" })], {
    publishedSlugs: [],
    featuredSlugs: ["signal-loom", "signal-loom", "ghost"],
  }));

  expect(findings.map(({ slug, subject, message }) => ({ slug, subject, message }))).toEqual([
    { slug: "signal-loom", subject: "pitch", message: "must be a non-empty string" },
    { slug: "signal-loom", subject: "featured", message: "no published case-study destination; publish it before featuring" },
    { slug: "signal-loom", subject: "featured", message: "duplicate slug; select each project only once" },
    { slug: "ghost", subject: "featured", message: "unknown project; use an authored catalogue slug" },
    { slug: "ghost", subject: "featured", message: "no published case-study destination; publish it before featuring" },
  ]);
  expect(findings.filter(({ subject }) => subject === "featured").every(({ blocksBuild }) => blocksBuild)).toBe(true);
});
