# mm-dev-site

Mitch Mele's portfolio and development blog, built with Next.js App Router and React 19.

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Project stats (enrichment)

Featured projects show live GitHub stats — commit count, last-push date, and
language mix — layered onto their curated content files. Per
[ADR 0004](docs/adr/0004-curated-content-plus-build-time-github-enrichment.md)
these are read **at build time only**; the deployed site never calls GitHub.

Enrichment is always optional. A project with no remote, a missing token, a
rate limit, or a GitHub outage all produce the same result: the project renders
from its curated content alone, and the build logs an `[enrichment]` warning
instead of failing.

### Environment variables

| Variable               | Where           | Purpose                                                                                   |
| ---------------------- | --------------- | ----------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`         | Vercel (build)  | Raises the GitHub API rate limit from 60/hr to 5,000/hr. Without it, builds usually degrade. |
| `GITHUB_API_BASE_URL`  | Tests, optional | Points enrichment at a different API host. Defaults to `https://api.github.com`.            |

`GITHUB_TOKEN` only ever reads public repository metadata, so it needs no
scopes beyond public read. Create a **fine-grained** personal access token with
*Public Repositories (read-only)* and no additional account permissions, then:

```bash
vercel env add GITHUB_TOKEN production
vercel env add GITHUB_TOKEN preview
```

For local builds, put it in `.env.local` (git-ignored). It is optional there —
without it you will see the rate-limit warning and curated-only rendering.

### Keeping stats fresh

Because stats are baked in at build time, they are only as current as the last
deploy. [`.github/workflows/refresh-stats.yml`](.github/workflows/refresh-stats.yml)
redeploys the site daily at 06:17 UTC by posting to a Vercel deploy hook.

To enable it:

1. In Vercel, go to **Settings → Git → Deploy Hooks** and create a hook on
   `main`.
2. Add its URL as the repository secret `VERCEL_DEPLOY_HOOK_URL`
   (**Settings → Secrets and variables → Actions**). It cannot be named
   `GITHUB_TOKEN` — that name is reserved by Actions.
3. Run the workflow once from the Actions tab (`Run workflow`) to confirm it
   triggers a deployment.

Two things worth knowing: GitHub disables scheduled workflows after 60 days
with no repository activity, and each run redeploys the current `main`.

Next's Data Cache persists between builds, so every enrichment request carries
a per-build key (seeded in [`next.config.ts`](next.config.ts)) — without it a
scheduled rebuild would keep rebaking the first build's numbers. If you change
that mechanism, verify it by building twice against
`tests/support/github-mock.mjs` with different `MOCK_COMMITS` values and a warm
`.next`: the second build must show the second number, and `next build` must
still report `/` as `○ (Static)`.

The first live deployment is available at [mm-dev-site.vercel.app](https://mm-dev-site.vercel.app).
