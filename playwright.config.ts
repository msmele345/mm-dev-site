import { defineConfig, devices } from "@playwright/test";

/**
 * Enrichment (ADR 0004) reads GitHub server-side, so the browser tests point
 * the dev server at a local stand-in instead of the real API — deterministic
 * assertions, no rate limits, no network.
 */
const GITHUB_MOCK_PORT = 4010;

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://127.0.0.1:3000",
    ...devices["Desktop Chrome"],
  },
  webServer: [
    {
      command: `node tests/support/github-mock.mjs ${GITHUB_MOCK_PORT}`,
      url: `http://127.0.0.1:${GITHUB_MOCK_PORT}/healthz`,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm run dev -- --hostname 127.0.0.1",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: !process.env.CI,
      env: {
        GITHUB_API_BASE_URL: `http://127.0.0.1:${GITHUB_MOCK_PORT}`,
        GITHUB_TOKEN: "mock-token",
      },
    },
  ],
});
