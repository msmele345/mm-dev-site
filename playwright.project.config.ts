import { defineConfig, devices } from "@playwright/test";

const port = process.env.PROJECT_VERIFY_PORT;
if (!port || !process.env.PROJECT_VERIFY_INPUT || !process.env.PROJECT_VERIFY_EVIDENCE) {
  throw new Error("Run npm run project -- verify <slug> to supply an isolated build and evidence directory.");
}
export default defineConfig({
  testDir: "./tests",
  testMatch: "project-verification.spec.ts",
  workers: 1,
  retries: 0,
  timeout: 60_000,
  outputDir: `${process.env.PROJECT_VERIFY_EVIDENCE}/browser`,
  reporter: [["list"], ["json", { outputFile: `${process.env.PROJECT_VERIFY_EVIDENCE}/results.json` }]],
  use: {
    ...devices["Desktop Chrome"],
    baseURL: `http://127.0.0.1:${port}`,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
