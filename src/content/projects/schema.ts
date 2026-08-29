export type StoryKind = "problem" | "build" | "result";

export type StorySection = {
  kind: StoryKind;
  heading: string;
  body: string;
};

export type Screenshot = {
  src: string;
  alt: string;
  caption: string;
};

export type ProjectLinks = {
  repo?: string;
  demo?: string;
};

export type TilePalette = {
  ground: string;
  panel: string;
  ink: string;
  mute: string;
  accent: string;
  steps?: readonly [string, string, string, string];
};

export type TileIdentity = {
  motif: string;
  displayFace: string;
  palette: TilePalette;
};

/**
 * What every curated project carries, whatever tier it is shown at.
 * Enrichment (ADR 0004) needs nothing more than this.
 */
export type ProjectCore = {
  title: string;
  slug: string;
  pitch: string;
  links: ProjectLinks;
  stack: readonly string[];
};

/** A featured project: a chameleon tile on the wall and a full case study. */
export type Project = ProjectCore & {
  draft: boolean;
  tile?: TileIdentity;
  story: readonly StorySection[];
  screenshots: readonly Screenshot[];
};

/**
 * A more-projects rail entry: the same curated schema minus tile identity and
 * the long-form case-study material. A rail card is the whole presentation, so
 * `pitch` has to stand on its own — there is no page behind it to click into.
 *
 * `links.repo` is optional here in practice as well as in type: a project with
 * no remote (scholar) renders as a plain card with no stats and no link, which
 * is a complete state rather than a degraded one.
 */
export type RailProject = ProjectCore & {
  /** Why the card is not clickable, shown when there is no remote. */
  unlinkedNote?: string;
};
