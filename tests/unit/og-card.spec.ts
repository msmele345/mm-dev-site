import { expect, test } from "@playwright/test";
import {
  blogCard,
  caseStudyCard,
  homeCard,
  postCard,
  titleFontSize,
} from "@/lib/og-card";
import { getProject } from "@/content/projects/catalog";
import { site } from "@/lib/site";

test("the home card carries the wordmark and the site's own lime", () => {
  const card = homeCard();

  expect(card.title).toBe(site.wordmark);
  // The headline is already the wordmark; the footer must not repeat it.
  expect(card.signature).toBe(site.host);
  expect(card.accent).toBe("#c6ff00");
});

test("a post card leads with its title and dates the eyebrow", () => {
  const card = postCard({
    slug: "a-post",
    title: "Shipping a groovebox",
    date: "2026-08-27",
    summary: "A summary.",
    tags: ["elevated-bpm"],
  });

  expect(card.title).toBe("Shipping a groovebox");
  expect(card.eyebrow).toBe("BLOG");
  expect(card.signature).toBe(site.wordmark);
  expect(card.footnote).toBe("27 Aug 2026");
});

test("a case-study card nods to the tile by borrowing its accent", () => {
  const soundCity = getProject("sound-city");
  if (!soundCity) throw new Error("sound-city is a featured project");

  const card = caseStudyCard(soundCity);

  expect(card.title).toBe(soundCity.title);
  expect(card.eyebrow).toBe("CASE STUDY");
  expect(card.accent).toBe(soundCity.tile?.palette.accent);
});

test("a project without a tile identity falls back to the chrome's lime", () => {
  const card = caseStudyCard({
    title: "Untitled",
    slug: "untitled",
    pitch: "A pitch.",
    draft: false,
    story: [],
    screenshots: [],
    links: {},
    stack: [],
  });

  expect(card.accent).toBe("#c6ff00");
});

test("shrinks the title so a long one still fits the card", () => {
  const short = titleFontSize("Telescope");
  const long = titleFontSize(
    "Shipping a groovebox that teaches techno to anyone who presses play",
  );

  expect(short).toBeGreaterThan(long);
  expect(long).toBeGreaterThanOrEqual(48);
});

test("the blog index gets its own card rather than the home wordmark", () => {
  const card = blogCard();

  expect(card.title).toBe("BLOG");
  expect(card.eyebrow).toBe("NOTES FROM THE LATE SHIFT");
  expect(card.accent).toBe("#c6ff00");
});
