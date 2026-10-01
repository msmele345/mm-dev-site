# Ticket 02 verification — 1 October 2026

Implemented on `feat/02-latest-dispatch-from-blog`, starting from
`bae73cc46ad31fb21ad90f5ffcecb1a342c4e434` with a clean worktree.
All ticket 02 acceptance criteria are verified locally. No authored posts or manual
editorial fields were changed.

## Delivered behavior

`CurrentTransmission` selects the first entry from the existing `listPosts()`
catalogue. Its title, summary, publication date, and `/blog/{slug}` destination
populate Latest Dispatch. It uses the existing UTC-pinned `formatPostDate()`;
the footer contains only the publication date. The manual header date stays
`UPDATED · 30 SEP 2026` and remains separate from the post's `27 Aug 2026` date.

The dispatch uses Next.js `Link` and the ledger's established Chrome link styling.
Keyboard traversal reaches Birdsview, then the dispatch, then More projects;
PIRATE WORLD remains non-interactive. Enter on the dispatch reaches its complete
MDX article. An empty catalogue still renders FIRST DISPATCH PENDING, the preparation
sentence, and OFF AIR with no dispatch link or tab stop.

The component remains server-rendered, reusing the existing local catalogue and
publication semantics. There is no new sort, metadata source, draft filter,
scheduling system, service, runtime query, or production fixture switch.

## Red → green and page regressions

1. Replaced ticket 01's intermediate two-signal production test with the populated
   dispatch requirement. Before implementation,
   `npm test -- tests/current-transmission.spec.ts --grep 'production dispatch' --workers=1`
   failed because the homepage headings were only BIRDSVIEW and PIRATE WORLD;
   the expected published-post heading was missing.
2. After connecting the catalogue entry and article link, the same test passed.
   It verifies the authored summary, both distinct calendar dates, destination,
   visible lime focus ring, keyboard traversal and activation, and article content
   through its closing section.
3. Added two production-build fixture regressions in
   `tests/current-transmission-dispatch.spec.ts`, using the existing temporary app
   helper. Files are written only inside the isolated copy's blog directory.
   The helper builds the real app with webpack for its node_modules symlink and
   serves it on port 3022. Builds run under America/Los_Angeles, exercising UTC date
   formatting outside the server's local calendar timezone.
4. The fixture contains the following known post order. Creation order and title
   order differ from the expected descending-slug tie order. The rendered homepage
   selects Antenna field notes, and the rendered blog index confirms that same
   first entry. Following its link reaches the complete article, including its
   final observation. Future calendar dates remain published, preserving the
   existing catalogue semantics.

   | Slug | Title | Date | Expected position |
   | --- | --- | --- | --- |
   | `y-same-day` | Antenna field notes | 2099-04-02 | First |
   | `b-same-day` | Zebra field notes | 2099-04-02 | Second |
   | `z-older` | Older field notes | 2098-12-30 | Third |

5. Adding `a-newer.mdx` dated 2100-01-02 and rebuilding changes the rendered
   dispatch to Fresh field notes, its new summary, `2 Jan 2100`, and `/blog/a-newer`.
   Both curated articles and the manual header retain their prior rendered text;
   the Birdsview destination and non-interactive concept state also remain intact.
   The new dispatch opens its complete article and becomes first on the blog index.
6. Ticket 01's five empty-catalogue regressions still pass: three signals and their
   placement; copy, dates and footer states; fallback with no link or tab stop;
   keyboard behavior under both motion preferences; and an editorial edit/rebuild
   with an old valid date. The empty ledger exposes only the Birdsview link.

## Required checks

| Check | Result |
| --- | --- |
| Focused Current Transmission tests, both files, two workers | 8 passed |
| `npm test` | 164 passed |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed |
| `npm run build` | Passed with default Turbopack; `/` remains statically prerendered |
| `git diff --check` | Passed |

The first lint attempt ran concurrently with Playwright and encountered ENOENT
while Playwright recreated `test-results`. Rerunning lint after the tests passed
succeeded. The server interruption lost the first build process's final output;
the subsequent production build completed with exit code 0.

## Review

### Standards

Independent review found zero documented-standard violations or actionable smells.
Server rendering, catalogue reuse, UTC dates, established Chrome classes, and
page-boundary tests follow the repository's rules. The changed component also
passes the applicable Web Interface Guidelines checks for semantic navigation,
heading hierarchy, visible focus, empty content, and date formatting.

### Spec

Independent review found zero missing, incorrect, or out-of-scope ticket 02
behaviors. Ticket 04 and ticket 05 responsibilities were excluded from this review.

## Desktop inspection and remaining acceptance

Inspected the real authored-post homepage at 1440 × 900 with loaded fonts:
[full composition](populated-home-1440.png) and
[ledger detail](populated-ledger-1440.png). These captures come from the repository's
Playwright development server with local GitHub enrichment fixtures; the isolated
dispatch tests separately exercise production builds and served articles.

The populated ledger retains three equal columns, a naturally wrapping title,
the established two-line summary excerpt, muted publication metadata, and quiet
Chrome beneath the Project wall. This desktop inspection does not complete ticket
04's long-copy, breakpoint, tablet/phone, integrated accessibility, spacing, or
owner-copy acceptance. Ticket 05 still owns editorial validation in the actual build.

No commits, pushes, deployments, or external issue publication were performed.
