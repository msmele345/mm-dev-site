# Hero header redesign options

Status: direction selected — Option 2's layout with Option 5's verb index as the
right-hand column. Implementation is tracked in
[`issues/site-intro.md`](../issues/site-intro.md). Options 1, 3, and 4 are kept for
future reference.

## Goal

Give the homepage one strong headline, one explanatory sentence, and a clear invitation into the projects. The current hero has several competing introductions: Mitch Mele, “Side Quest Showcase,” a long list of sensations, and “2026 Projects.”

All five options retain the existing black, white, and electric-lime palette.

## Option 1: The personal introduction

**Small label**

MITCH MELE / SOFTWARE ENGINEER

**Headline**

> Check out what I'm building in 2026
> I want to exist.

**Subheading**

> Music tools, interactive worlds, and other ideas I couldn’t leave alone. Built for the browser, documented along the way.

**Link**

Explore the projects ↓

### Layout

- Use a large, left-aligned headline with generous space around it.
- Keep the subheading narrower and use an easy-to-read typeface.
- Reduce the background grid until it barely registers.
- Use lime for the link.

### Why choose it

It introduces your motivation and gives the varied projects a common thread. It feels personal without requiring a long biography.

## Option 2: The project gallery

**Small label**

MITCH MELE / SOFTWARE ENGINEER

**Headline**

> Built to be  
> curious.

**Subheading**

> Make a beat. Explore a star field. Find an underground show. Learn about the world. Check out what I've been building in 2026.

**Link**

Find something to explore ↓

### Layout

- Use a compact, asymmetric layout.
- Place the headline on the left and the description on the right at desktop widths.
- Stack the headline and description on mobile.
- Bring the project wall close enough that its artwork shares the opening view.
- Let the project artwork supply the color and movement.

### Why choose it

It immediately tells visitors what they can do here. This is the strongest direction for encouraging people to open projects quickly.

The tradeoff is that it emphasizes the playful work more than the broader engineering portfolio.

## Option 3: The side-project poster

**Small label**

MITCH MELE / INDEPENDENT PROJECTS

**Headline**

> Side projects.  
> Full attention.

**Subheading**

> I follow my interests into software. This is where the projects land, with notes on the decisions and details behind them.

**Link**

See what I’ve been making ↓

### Layout

- Keep the oversized condensed typography and make the short statement the centerpiece.
- Set the second headline line in lime.
- Move your name into a smaller masthead.
- Replace the background grid with a simple horizontal rule.
- Keep the supporting copy quiet and close to the headline.

### Why choose it

It preserves the personality of the current design while giving the header a clearer message. It also makes room for both projects and writing.

## Option 4: The quiet column

Borrows the structure of the telescope app's login and lesson pages: one narrow
column, a small eyebrow, a plain title, one muted sentence, and a single link.

**Small label**

SOFTWARE ENGINEER · 2026

**Headline**

> Side projects with a pulse.

**Subheading**

> One muted sentence about what the projects are and why they exist.

**Link**

Open the wall ↓

### Layout

- Use a left-aligned column about 44rem wide.
- Size the headline from roughly `clamp(2.5rem, 6vw, 4.5rem)`, far below the current hero.
- Drop the grid, top line, and name; the nav wordmark already carries the name.
- Start the project wall directly beneath.

### Why choose it

It is the closest lift from telescope, the cheapest to build, and the easiest to read.

The tradeoff is that it is the least memorable on its own and depends entirely on the tiles for impact.

## Option 5: The verb index

**Small label**

MITCH MELE / SOFTWARE ENGINEER

**Headline**

> Four things to try.

**Index** (one row per featured project, each linking to its tile)

> 01 Make a beat — elevated-bpm
> 02 Trade the tape — terminal-one
> 03 Explore the sky — telescope
> 04 Find a show — sound-city

### Layout

- Show a number, a verb phrase, and the project name on each row.
- Turn the row lime on hover and keyboard focus.
- Build the rows from the same curated content as the project wall so add, remove, and reorder updates flow through automatically.
- Render as a simple list on mobile.

### Why choose it

It tells visitors exactly what they can do and doubles as navigation, much like telescope's directory panel.

The tradeoff is that it overlaps with the wall's own titles and needs a curated verb phrase per project. Avoid hard-coding "Four" in copy, since the featured count can change.

## Recommendation

Option 2 is the recommended starting point. The project artwork is the site’s strongest distinguishing feature. A shorter intro with “Built to be curious” gives that artwork more room and visitors a concrete reason to explore.

Selected: Option 2's asymmetric layout with Option 5's verb index as the right-hand column, and telescope's eyebrow, title, and muted-sentence hierarchy on the left. See [`issues/site-intro.md`](../issues/site-intro.md).
