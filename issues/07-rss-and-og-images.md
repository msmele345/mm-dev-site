# 07 — RSS + OG images

## Parent

Wayfinder map: `/docs/plan/plan-history/map.md`

## What to build

Sharing infrastructure in the site's own skin: an RSS feed for the blog, and
auto-generated Open Graph images — ink-black ground, MITCH MELE wordmark, electric lime
accent — for the home page, blog posts (title + date), and project case studies (project
name in a nod to its tile identity). Shared links should look unmistakably like this
site.

## Acceptance criteria

- [x] Valid RSS feed of all posts, linked/discoverable from the blog
- [x] Every blog post gets a generated OG image with its title in the ink-black + lime style
- [x] Every case-study page gets a generated OG image carrying the project name
- [x] Home page has a branded OG image; all pages declare correct OG/Twitter metadata
- [ ] Rendering verified with a link-preview check (paste into a validator or messenger)
      — HITL: needs a publicly reachable URL, so it waits on a preview or production deploy.

## Blocked by

- [06 — MDX blog](06-mdx-blog.md)
