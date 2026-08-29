import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/og";
import { homeCard } from "@/lib/og-card";
import { site } from "@/lib/site";

const card = homeCard();

export const alt = `${site.wordmark} — the development portfolio of Mitch Mele`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgCard(card);
}
