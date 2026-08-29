# 06 — MDX blog

## Parent

Wayfinder map: `/docs/plan/plan-history/map.md`

## What to build

The blog per ADR 0005: `.mdx` posts in the repo with frontmatter (title, date, summary,
tags), a blog index in the ink-black chrome, and a post page with excellent reading
typography and first-class code blocks (syntax highlighting that pops on black). Posts
can embed React components — prove it with one seed post that includes a small
interactive embed (e.g. a mini sequencer or a live stat), establishing the pattern for
future "post about a project with the project inside it" writing.

## Acceptance criteria

- [x] `.mdx` files with frontmatter become posts; adding a file and rebuilding publishes it
- [x] Blog index lists posts (title, date, summary) newest-first, linked from the nav
- [x] Post page: readable measure, strong type hierarchy, styled code blocks with highlighting
- [x] One seed post published containing a working interactive React embed
- [x] Post pages carry correct metadata (title, description, date)

## Blocked by

- [02 — Chrome shell](02-chrome-shell.md)
