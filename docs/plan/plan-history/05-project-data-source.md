# 05 — Project data source

Type: grilling
Status: resolved
Blocked by: none

## Question

How does the site source project content and stats — curated files, live GitHub API,
or a hybrid?

## Answer

**Curated file + build-time GitHub enrichment.** Each project is a hand-written content
file (title, pitch, tile identity, screenshots, links) — full narrative control. At build
time, live stats (commit count, last-push date, language mix) are fetched from the GitHub
API for repos that have remotes and layered on. No runtime API dependency; projects
without remotes still render fully from curated data. Rejected: fully curated (stats
rot), runtime API (rate limits, loss of narrative control, non-remote projects vanish).
