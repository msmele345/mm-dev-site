import { expect, test } from "@playwright/test";
import { validateTransmissionEditorial } from "@/lib/current-transmission";
import { editorialWith, validEditorial } from "../support/transmission-editorial";

test("rejects a missing editorial update date with its exact field error", () => {
  expect(() => validateTransmissionEditorial(editorialWith("updatedOn", undefined))).toThrow(
    new Error("Current Transmission updatedOn must be a non-empty string"),
  );
});

for (const field of [
  "updatedOn", "nowBuilding.headline", "nowBuilding.supportingText",
  "nowBuilding.destination", "nextExperiment.headline", "nextExperiment.supportingText",
]) {
  for (const [invalidClass, value] of [
    ["missing", undefined], ["empty", ""], ["whitespace-only", " \t\n "],
    ["number", 42], ["null", null], ["boolean", true], ["array", ["copy"]], ["object", {}],
  ] as const) {
    test(`rejects ${invalidClass} ${field} with its exact field error`, () => {
      expect(() => validateTransmissionEditorial(editorialWith(field, value))).toThrow(
        new Error(`Current Transmission ${field} must be a non-empty string`),
      );
    });
  }
}

test("rejects an impossible editorial calendar date with its exact field error", () => {
  expect(() => validateTransmissionEditorial(editorialWith("updatedOn", "2026-02-31"))).toThrow(
    new Error("Current Transmission updatedOn must be a real ISO calendar date (yyyy-mm-dd)"),
  );
});

test("accepts the public manual-content record without changing its authored strings", () => {
  const editorial = validEditorial();
  expect(validateTransmissionEditorial(editorial)).toEqual(editorial);
});

test("rejects a Next Experiment destination instead of silently discarding it", () => {
  expect(() => validateTransmissionEditorial(editorialWith("nextExperiment.destination", "/work/telescope"))).toThrow(
    new Error("Current Transmission nextExperiment.destination is forbidden because Next Experiment is non-interactive"),
  );
});

for (const [description, destination] of [["undefined", undefined], ["null", null], ["empty", ""], ["wrong type", false]] as const) {
  test(`rejects even an ${description} Next Experiment destination property`, () => {
    const editorial = validEditorial();
    const input = { ...editorial, nextExperiment: { ...editorial.nextExperiment, destination } };
    expect(() => validateTransmissionEditorial(input)).toThrow(
      new Error("Current Transmission nextExperiment.destination is forbidden because Next Experiment is non-interactive"),
    );
  });
}

for (const date of ["2026-2-01", "26-02-01", "2026/02/01", "2026-02-01T00:00:00Z", " 2026-02-01", "2026-02-01 ", "2026-02-29", "1900-02-29", "2100-02-29", "2026-04-31", "2026-13-01", "2026-00-01", "2026-01-00", "2026-01-32"]) {
  test(`rejects malformed or impossible editorial date ${JSON.stringify(date)}`, () => {
    expect(() => validateTransmissionEditorial(editorialWith("updatedOn", date))).toThrow(
      new Error("Current Transmission updatedOn must be a real ISO calendar date (yyyy-mm-dd)"),
    );
  });
}

for (const date of ["2001-01-02", "2000-02-29", "2024-02-29"]) {
  test(`accepts a real editorial calendar date ${date} without expiry or rewriting`, () => {
    expect(validateTransmissionEditorial(editorialWith("updatedOn", date)).updatedOn).toBe(date);
  });
}

for (const destination of ["/", "/work/telescope", "/work/telescope?view=full#notes", "/blog/field%20notes", "https://example.com/atlas", "https://offline.invalid/notes?view=full#entry", "HTTPS://example.com/atlas"]) {
  test(`accepts safe Now Building destination ${destination}`, () => {
    expect(validateTransmissionEditorial(editorialWith("nowBuilding.destination", destination)).nowBuilding.destination).toBe(destination);
  });
}

for (const destination of ["javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html,hello", "vbscript:msgbox(1)", "//example.com/atlas", "http://example.com/atlas", "ftp://example.com/atlas", "mailto:me@example.com", "work/telescope", "#notes", "?view=full", "/\\example.com", "\\\\example.com", "https:\\example.com", "https:example.com", "https:/example.com", "https:///example.com", "https://", "https://user:password@example.com", "https://example.com\n/atlas", " https://example.com", "https://example.com ", "/\u0000example.com", "/\u007fexample.com", "https://[invalid]/"]) {
  test(`rejects unsafe Now Building destination ${JSON.stringify(destination)} with its exact field error`, () => {
    expect(() => validateTransmissionEditorial(editorialWith("nowBuilding.destination", destination))).toThrow(
      new Error("Current Transmission nowBuilding.destination must be a safe root-relative path or an absolute HTTPS URL"),
    );
  });
}

for (const [invalidClass, value] of [["missing", undefined], ["null", null], ["number", 3], ["string", "content"], ["array", []]] as const) {
  test(`rejects a ${invalidClass} editorial record with its exact field error`, () => {
    expect(() => validateTransmissionEditorial(value)).toThrow(new Error("Current Transmission editorial must be an object"));
  });
  for (const field of ["nowBuilding", "nextExperiment"]) {
    test(`rejects ${invalidClass} ${field} with its exact field error`, () => {
      expect(() => validateTransmissionEditorial(editorialWith(field, value))).toThrow(new Error(`Current Transmission ${field} must be an object`));
    });
  }
}

test("accepts long manual copy and preserves every authored character", () => {
  const editorial = validEditorial();
  editorial.nowBuilding.headline = "Mapping coastlines and their surprising connections ".repeat(100);
  editorial.nowBuilding.supportingText = "  A complete observation deserves every authored sentence. ".repeat(100);
  editorial.nextExperiment.headline = "An all-ages sailing prototype ".repeat(100);
  editorial.nextExperiment.supportingText = "Exploring the open ocean with room for further ideas. ".repeat(100);
  expect(validateTransmissionEditorial(editorial)).toEqual(editorial);
});
