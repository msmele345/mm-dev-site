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

export type Project = {
  title: string;
  slug: string;
  pitch: string;
  draft: boolean;
  tile?: TileIdentity;
  story: readonly StorySection[];
  screenshots: readonly Screenshot[];
  links: ProjectLinks;
  stack: readonly string[];
};
