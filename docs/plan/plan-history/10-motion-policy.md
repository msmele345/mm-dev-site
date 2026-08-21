# 10 — Motion policy

Type: grilling
Status: resolved
Blocked by: none

## Question

How much motion should the chameleon tiles have?

## Answer

**Ambient + hover crescendo.** Tiles idle with subtle life (slow LED pulse, a drifting
star, faint ticker crawl) and go full-energy on hover/focus (sequencer runs, ticker
speeds up, constellation draws itself). `prefers-reduced-motion` freezes tiles to static
art. Mobile (no hover) gets the ambient state, with crescendo on tap-and-hold or in-view.
Rejected: hover-only (dead first paint, mobile never sees magic), always-full-energy
(attention competition, battery, Core Web Vitals).
