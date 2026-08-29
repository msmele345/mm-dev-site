import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";
import { blogCard } from "@/lib/og-card";
import { site } from "@/lib/site";

const card = blogCard();

export const alt = `The blog on ${site.wordmark}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgCard(card);
}
