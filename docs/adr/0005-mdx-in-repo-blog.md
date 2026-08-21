# ADR 0005 — MDX in-repo blog

Status: accepted — 2026-08-17

## Context

Single-author blog on a site whose identity is dazzling interactivity. Alternatives:
plain markdown (no interactive embeds), headless CMS (service dependency + web editor
the owner doesn't need).

## Decision

Posts are **`.mdx` files in the repo** — write in the editor, commit to publish. Posts
may embed React components (e.g. a mini groovebox demo inside a post about
elevated-bpm). Code blocks get first-class syntax highlighting. The blog ships with RSS
and auto-generated OG images per [ADR 0003](0003-ink-black-chrome-electric-lime.md).

## Consequences

- Publishing is a git push; no CMS accounts or webhooks.
- Interactive embeds reuse tile components where sensible.
- Frontmatter (title, date, summary, tags) is the post metadata contract.
