/**
 * A stand-in GitHub API for the browser tests, so enrichment can be asserted
 * end-to-end without depending on the network or GitHub's rate limits.
 *
 * Serves the same response shapes as api.github.com for the featured repos
 * used by the wall and case studies, and 404s everything else. The numbers are
 * deliberately nothing like the real repo's: if a stray dev server is reused
 * without GITHUB_API_BASE_URL pointed here, the tests fail loudly on the real
 * values instead of quietly passing.
 *
 * Usage: node tests/support/github-mock.mjs [port]
 */
import { createServer } from "node:http";

const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4010);
const FIXTURES = {
  "/repos/msmele345/elevated-bpm": {
    commitCount: Number(process.env.MOCK_COMMITS ?? 1234),
    languages: { TypeScript: 750_000, CSS: 150_000, JavaScript: 100_000 },
  },
  "/repos/msmele345/terminal-one": {
    commitCount: 321,
    languages: { Java: 700_000, TypeScript: 300_000 },
  },
  "/repos/msmele345/telescope": {
    commitCount: 222,
    languages: { TypeScript: 850_000, MDX: 150_000 },
  },
  "/repos/msmele345/sound-city": {
    commitCount: 444,
    languages: { TypeScript: 900_000, CSS: 100_000 },
  },
};

const LAST_PUSHED_AT = "2026-02-14T02:00:00Z";

const server = createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const send = (status, body, headers = {}) => {
    response.writeHead(status, { "content-type": "application/json", ...headers });
    response.end(JSON.stringify(body));
  };

  if (url.pathname === "/healthz") return send(200, { ok: true });

  const repoPath = Object.keys(FIXTURES).find(
    (candidate) =>
      url.pathname === candidate || url.pathname.startsWith(`${candidate}/`),
  );
  const fixture = repoPath ? FIXTURES[repoPath] : undefined;

  if (repoPath && url.pathname === repoPath) {
    return send(200, {
      full_name: repoPath.replace("/repos/", ""),
      private: false,
      pushed_at: LAST_PUSHED_AT,
    });
  }

  if (repoPath && fixture && url.pathname === `${repoPath}/commits`) {
    // GitHub reports the commit count only as the last page of a 1-per-page list.
    const last = `<http://127.0.0.1:${PORT}${repoPath}/commits?per_page=1&page=${fixture.commitCount}>; rel="last"`;
    return send(200, [], { link: `${last}` });
  }

  if (repoPath && fixture && url.pathname === `${repoPath}/languages`) {
    return send(200, fixture.languages);
  }

  send(404, { message: "Not Found" });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[github-mock] listening on http://127.0.0.1:${PORT}`);
});
