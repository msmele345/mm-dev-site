/**
 * A stand-in GitHub API for the browser tests, so enrichment can be asserted
 * end-to-end without depending on the network or GitHub's rate limits.
 *
 * Serves the same response shapes as api.github.com for the one repo the
 * wall and case study use, and 404s everything else. The fixture numbers are
 * deliberately nothing like the real repo's: if a stray dev server is reused
 * without GITHUB_API_BASE_URL pointed here, the tests fail loudly on the real
 * values instead of quietly passing.
 *
 * Usage: node tests/support/github-mock.mjs [port]
 */
import { createServer } from "node:http";

const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4010);
const REPO = "/repos/msmele345/elevated-bpm";

const FIXTURE = {
  commitCount: Number(process.env.MOCK_COMMITS ?? 1234),
  lastPushedAt: "2026-02-14T02:00:00Z",
  languages: { TypeScript: 750_000, CSS: 150_000, JavaScript: 100_000 },
};

const server = createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const send = (status, body, headers = {}) => {
    response.writeHead(status, { "content-type": "application/json", ...headers });
    response.end(JSON.stringify(body));
  };

  if (url.pathname === "/healthz") return send(200, { ok: true });

  if (url.pathname === REPO) {
    return send(200, {
      full_name: "msmele345/elevated-bpm",
      private: false,
      pushed_at: FIXTURE.lastPushedAt,
    });
  }

  if (url.pathname === `${REPO}/commits`) {
    // GitHub reports the commit count only as the last page of a 1-per-page list.
    const last = `<http://127.0.0.1:${PORT}${REPO}/commits?per_page=1&page=${FIXTURE.commitCount}>; rel="last"`;
    return send(200, [], { link: `${last}` });
  }

  if (url.pathname === `${REPO}/languages`) {
    return send(200, FIXTURE.languages);
  }

  send(404, { message: "Not Found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[github-mock] listening on http://127.0.0.1:${PORT}`);
});
