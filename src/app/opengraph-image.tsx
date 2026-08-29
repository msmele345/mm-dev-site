import { homeCard } from "@/lib/og-card";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";

const card = homeCard();

export const alt = card.alt;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgCard(card);
}
