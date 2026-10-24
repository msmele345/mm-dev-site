// Generated from src/content/projects/authored/ by `npm run registration`; do not edit.
import type { Project } from "./schema";
import { elevatedBpm } from "./authored/elevated-bpm";
import { soundCity } from "./authored/sound-city";
import { telescope } from "./authored/telescope";
import { terminalOne } from "./authored/terminal-one";

export const authoredProjects: readonly Project[] = [
  elevatedBpm,
  soundCity,
  telescope,
  terminalOne,
];

export const authoredProjectFiles: readonly { fileSlug: string; project: Project }[] = [
  { fileSlug: "elevated-bpm", project: elevatedBpm },
  { fileSlug: "sound-city", project: soundCity },
  { fileSlug: "telescope", project: telescope },
  { fileSlug: "terminal-one", project: terminalOne },
];
