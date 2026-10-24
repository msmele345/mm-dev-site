import { expect, test } from "@playwright/test";
import { createShowcaseRegistry } from "@/components/showcase/registration";

const presentation = { slug: "fixture", Tile: () => null, CaseStudyArtwork: () => null };

test("missing showcase references identify the project instead of selecting fallback art", () => {
  const registry = createShowcaseRegistry([presentation]);
  expect(() => registry.get("unregistered")).toThrow('Showcase "unregistered": missing presentation registration');
});

test("conflicting showcase registrations name the duplicated project", () => {
  expect(() => createShowcaseRegistry([presentation, presentation])).toThrow('Showcase "fixture": duplicate presentation registration');
});

for (const field of ["Tile", "CaseStudyArtwork"] as const) {
  test(`missing ${field} names the project and artwork reference`, () => {
    const invalid = { ...presentation, [field]: undefined };
    expect(() => createShowcaseRegistry([invalid as unknown as typeof presentation])).toThrow(`Showcase "fixture": missing ${field}`);
  });
}
