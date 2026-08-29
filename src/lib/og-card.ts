import type { Project } from "@/content/projects/schema";
import { formatPostDate, type PostMeta } from "@/lib/posts";
import { site } from "@/lib/site";

/** The chrome's electric lime (ADR 0003) — the default accent for any card. */
const LIME = "#c6ff00";

/**
 * Everything a shared-link card says, decided as data before anything is drawn.
 * Keeping the copy separate from the drawing means the wording of every card is
 * checkable without rendering a PNG.
 */
export type OgCard = {
  eyebrow: string;
  title: string;
  /** Footer left: who published this. Omitted where the title is the wordmark. */
  signature: string;
  footnote: string;
  accent: string;
};

/** The home page: the wordmark itself, in the chrome's own colours. */
export function homeCard(): OgCard {
  return {
    eyebrow: "PORTFOLIO / EXPERIMENTS / NOTES",
    title: site.wordmark,
    // The card's own headline is the wordmark, so the footer carries the
    // address instead of repeating it.
    signature: site.host,
    footnote: "Built after dark. Shipped with intent.",
    accent: LIME,
  };
}

/** The blog index: the section itself, not any one post. */
export function blogCard(): OgCard {
  return {
    eyebrow: "NOTES FROM THE LATE SHIFT",
    title: "BLOG",
    signature: site.wordmark,
    footnote: "Build logs / experiments",
    accent: LIME,
  };
}

/** A blog post: its title, dated. */
export function postCard(post: PostMeta): OgCard {
  return {
    eyebrow: "BLOG",
    title: post.title,
    signature: site.wordmark,
    footnote: formatPostDate(post.date),
    accent: LIME,
  };
}

/**
 * A case study: the project's name in its tile's accent, so a shared link
 * carries the same identity the tile does (ADR 0002). Projects without a tile
 * identity fall back to the chrome.
 */
export function caseStudyCard(project: Project): OgCard {
  return {
    eyebrow: "CASE STUDY",
    title: project.title,
    signature: site.wordmark,
    footnote: project.slug,
    accent: project.tile?.palette.accent ?? LIME,
  };
}

/**
 * Titles run from one word to a full sentence, and the card is a fixed
 * 1200×630. Step the display size down as the title grows so it always fills
 * the card without overrunning it.
 */
export function titleFontSize(title: string): number {
  const length = title.length;
  if (length <= 14) return 148;
  if (length <= 28) return 112;
  if (length <= 48) return 84;
  if (length <= 72) return 64;
  return 52;
}
