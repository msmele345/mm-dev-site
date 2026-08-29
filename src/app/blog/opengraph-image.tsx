import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";
import { blogCard } from "@/lib/og-card";

const card = blogCard();

export const alt = card.alt;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgCard(card);
}
