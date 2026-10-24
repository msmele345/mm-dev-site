import { expect, test } from "@playwright/test";
import { rmSync, writeFileSync } from "node:fs";
import { createShowcaseApp, writeFeaturedSelection } from "./support/showcase-app";
import { runTransmissionBuild } from "./support/transmission-app";

for (const [name, selection, error] of [
  ["duplicate", ["telescope", "telescope"], 'Featured selection "telescope": duplicate slug'],
  ["unknown", ["not-a-project"], 'Featured selection "not-a-project": unknown project'],
] as const) {
  test(`the real build rejects ${name} featured references with a named error`, async ({}, info) => {
    test.setTimeout(180_000);
    const dir = createShowcaseApp();
    try {
      writeFeaturedSelection(dir, selection);
      const result = await runTransmissionBuild(dir);
      writeFileSync(info.outputPath("build.log"), result.output);
      expect(result.signal).toBeNull();
      expect(result.exitCode).toBe(1);
      expect(result.output).toContain(error);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
}
