# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: project-verification.spec.ts >> featured membership, indices, keyboard, touch and shared motion
- Location: tests/project-verification.spec.ts:73:5

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Array [
    "/work/elevated-bpm",
-   "/work/signal-loom",
+   "/work/telescope",
    "/work/terminal-one",
    "/work/telescope",
    "/work/sound-city",
  ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - link "Skip to content" [ref=e3] [cursor=pointer]:
      - /url: "#main"
    - navigation "Primary" [ref=e4]:
      - link "MITCH MELE — home" [ref=e5] [cursor=pointer]:
        - /url: /
        - text: MITCH MELE
        - generic [ref=e6]: — home
      - list [ref=e7]:
        - listitem [ref=e8]:
          - link "Work" [ref=e9] [cursor=pointer]:
            - /url: /#work
        - listitem [ref=e10]:
          - link "Blog" [ref=e11] [cursor=pointer]:
            - /url: /blog
        - listitem [ref=e12]:
          - link "Contact" [ref=e13] [cursor=pointer]:
            - /url: /#contact
  - main [ref=e14]:
    - region [ref=e15]:
      - generic [ref=e17]:
        - paragraph [ref=e18]: Portfolio / experiments / notes
        - paragraph [ref=e19]: Chicago, IL
      - generic [ref=e20]:
        - paragraph [ref=e21]: Software Engineer · Side Quest Showcase
        - heading "MITCH MELE" [level=1] [ref=e22]
        - paragraph [ref=e23]: Sounds, vibrations, strobe lights, lever pulls, and space explorations. Side projects are supposed to be fun.
        - paragraph [ref=e24]: 2026 Projects
        - paragraph [ref=e25]: ▼ the wall is open
    - region [ref=e26]:
      - generic [ref=e27]:
        - heading "Project wall" [level=2] [ref=e28]
        - paragraph [ref=e29]: 5 featured projects
      - list [ref=e30]:
        - listitem [ref=e31]:
          - link "Elevated BPM 01 A hardware-styled groovebox for making techno — playable from the first click, with a goal-checked curriculum woven into the live instrument. Open case study" [ref=e33] [cursor=pointer]:
            - /url: /work/elevated-bpm
            - generic [ref=e34]:
              - generic [ref=e37]: EB-01
              - paragraph [ref=e40]: Elevated BPM
              - list [ref=e41]:
                - listitem [ref=e42]
                - listitem [ref=e44]
                - listitem [ref=e46]
                - listitem [ref=e48]
                - listitem [ref=e50]
                - listitem [ref=e52]
                - listitem [ref=e54]
                - listitem [ref=e56]
                - listitem [ref=e58]
                - listitem [ref=e60]
                - listitem [ref=e62]
                - listitem [ref=e64]
                - listitem [ref=e66]
                - listitem [ref=e68]
                - listitem [ref=e70]
                - listitem [ref=e72]
              - list [ref=e74]:
                - listitem [ref=e75]: KICK
                - listitem [ref=e76]: CLAP
                - listitem [ref=e77]: CH
                - listitem [ref=e78]: OH
            - generic [ref=e79]:
              - generic [ref=e80]: "01"
              - generic [ref=e81]: A hardware-styled groovebox for making techno — playable from the first click, with a goal-checked curriculum woven into the live instrument.
              - generic [ref=e82]: Open case study →
        - listitem [ref=e83]:
          - link "02 Signal Loom A synthetic project that weaves loose signals into one readable fabric. Open case study" [ref=e85] [cursor=pointer]:
            - /url: /work/telescope
            - paragraph [ref=e87]: WARP · WEFT · 08
            - generic [ref=e96]:
              - generic [ref=e97]: "02"
              - strong [ref=e98]: Signal Loom
              - generic [ref=e99]: A synthetic project that weaves loose signals into one readable fabric.
              - generic [ref=e100]: Open case study →
        - listitem [ref=e101]:
          - link "03 Terminal One A single-user desktop trading cockpit — NYSE-floor terminal crossed with a late-night slot machine — that monitors positions and runs a deterministic options-trade recommendation engine. Open case study" [ref=e103] [cursor=pointer]:
            - /url: /work/terminal-one
            - generic [ref=e104]:
              - paragraph [ref=e105]: SPY 602.41 +0.42% · QQQ 531.08 -0.18% · NVDA 184.72 +1.08% ·
              - generic [ref=e106]:
                - generic [ref=e107]: T1 / OPTIONS DESK
                - generic [ref=e108]: MARKET DELAYED
              - paragraph [ref=e109]: "87.4"
              - paragraph [ref=e110]: RANKED SIGNAL / DEFINED RISK
              - list [ref=e111]:
                - listitem [ref=e112]:
                  - generic [ref=e113]: CALL
                - listitem [ref=e114]:
                  - generic [ref=e115]: 30Δ
                - listitem [ref=e116]:
                  - generic [ref=e117]: 45D
            - generic [ref=e118]:
              - generic [ref=e119]: "03"
              - strong [ref=e120]: Terminal One
              - generic [ref=e121]: A single-user desktop trading cockpit — NYSE-floor terminal crossed with a late-night slot machine — that monitors positions and runs a deterministic options-trade recommendation engine.
              - generic [ref=e122]: Open case study →
        - listitem [ref=e123]:
          - link "04 Telescope A shipped web planetarium that renders roughly 9,000 real stars for a visitor’s location and time — with a beautiful 3D sky and an accessible path into the same astronomy. Open case study" [ref=e125] [cursor=pointer]:
            - /url: /work/telescope
            - paragraph [ref=e127]: LOCAL SKY · 22:14
            - generic [ref=e144]:
              - generic [ref=e145]: "04"
              - strong [ref=e146]: Telescope
              - generic [ref=e147]: A shipped web planetarium that renders roughly 9,000 real stars for a visitor’s location and time — with a beautiful 3D sky and an accessible path into the same astronomy.
              - generic [ref=e148]: Open case study →
        - listitem [ref=e149]:
          - link "05 Sound City A dark house and techno finder built on source-verified Chicago event data — from discovery and ingestion through a maintainer review queue before anything becomes public. Open case study" [ref=e151] [cursor=pointer]:
            - /url: /work/sound-city
            - generic [ref=e152]:
              - paragraph [ref=e154]: CHI / SOURCE VERIFIED
              - paragraph [ref=e155]: TONIGHT
              - paragraph [ref=e156]: HOUSE · TECHNO AFTER DARK
            - generic [ref=e170]:
              - generic [ref=e171]: "05"
              - strong [ref=e172]: Sound City
              - generic [ref=e173]: A dark house and techno finder built on source-verified Chicago event data — from discovery and ingestion through a maintainer review queue before anything becomes public.
              - generic [ref=e174]: Open case study →
    - region [ref=e175]:
      - generic [ref=e176]:
        - generic [ref=e177]:
          - heading "Current Transmission" [level=2] [ref=e178]
          - paragraph [ref=e179]:
            - text: UPDATED ·
            - time [ref=e180]: 14 MAR 2025
        - generic [ref=e181]:
          - article [ref=e182]:
            - paragraph [ref=e183]: Now Building
            - heading [level=3] [ref=e184]:
              - link "FIELD ATLAS" [ref=e185] [cursor=pointer]:
                - /url: https://example.com/field-atlas
            - paragraph [ref=e186]: Mapping the next geography experiment.
            - paragraph [ref=e187]: Repository ↗
          - article [ref=e188]:
            - paragraph [ref=e189]: Latest Dispatch
            - heading "FIRST DISPATCH PENDING" [level=3] [ref=e190]
            - paragraph [ref=e191]: Field notes are being prepared.
            - paragraph [ref=e192]: OFF AIR
          - article [ref=e193]:
            - paragraph [ref=e194]: Next Experiment
            - heading "SAIL SKETCHES" [level=3] [ref=e195]
            - paragraph [ref=e196]: Considering an all-ages sailing prototype.
            - paragraph [ref=e197]: IN CONCEPT
    - region [ref=e198]:
      - generic [ref=e199]:
        - heading "More projects" [level=2] [ref=e200]
        - paragraph [ref=e201]: 4 of many · curated, not crawled
      - list [ref=e202]:
        - listitem [ref=e203]:
          - article [ref=e204]:
            - heading [level=3] [ref=e205]:
              - link "Screens — repository on GitHub" [ref=e206] [cursor=pointer]:
                - /url: https://github.com/msmele345/screens
                - text: Screens
                - generic [ref=e207]: — repository on GitHub
                - text: ↗
            - paragraph [ref=e208]: A concert image gallery — a React and TypeScript front end over a Spring Boot backend.
            - list [ref=e209]:
              - listitem [ref=e210]: TypeScript
              - listitem [ref=e211]: /React
              - listitem [ref=e212]: /Spring Boot
        - listitem [ref=e213]:
          - article [ref=e214]:
            - heading [level=3] [ref=e215]:
              - link "Feedback Listener — repository on GitHub" [ref=e216] [cursor=pointer]:
                - /url: https://github.com/msmele345/feedback-listener
                - text: Feedback Listener
                - generic [ref=e217]: — repository on GitHub
                - text: ↗
            - paragraph [ref=e218]: Consumes feedback messages off Azure Service Bus and persists them to Cosmos DB, with secrets held in Key Vault.
            - list [ref=e219]:
              - listitem [ref=e220]: Java
              - listitem [ref=e221]: /Spring Boot
              - listitem [ref=e222]: /Azure Service Bus
        - listitem [ref=e223]:
          - article [ref=e224]:
            - heading [level=3] [ref=e225]:
              - link "Interstellar Exchange — repository on GitHub" [ref=e226] [cursor=pointer]:
                - /url: https://github.com/msmele345/interstellar-exchange
                - text: Interstellar Exchange
                - generic [ref=e227]: — repository on GitHub
                - text: ↗
            - paragraph [ref=e228]: "An electronic equities exchange: it reads a live ActiveMQ quote feed and executes eligible bid/ask pairs at the midpoint of the spread."
            - list [ref=e229]:
              - listitem [ref=e230]: Java
              - listitem [ref=e231]: /Spring Boot
              - listitem [ref=e232]: /ActiveMQ
        - listitem [ref=e233]:
          - article [ref=e234]:
            - heading [level=3] [ref=e235]:
              - link "Buzzball — repository on GitHub" [ref=e236] [cursor=pointer]:
                - /url: https://github.com/msmele345/Buzzball
                - text: Buzzball
                - generic [ref=e237]: — repository on GitHub
                - text: ↗
            - paragraph [ref=e238]: Advanced MLB metrics — a React and TypeScript front end over them.
            - list [ref=e239]:
              - listitem [ref=e240]: TypeScript
              - listitem [ref=e241]: /React
              - listitem [ref=e242]: /Vite
    - region [ref=e243]:
      - generic [ref=e244]:
        - heading "Contact" [level=2] [ref=e245]
        - paragraph [ref=e246]: Replies between builds
      - list [ref=e247]:
        - listitem [ref=e248]:
          - link "01 GitHub @msmele345" [ref=e249] [cursor=pointer]:
            - /url: https://github.com/msmele345
            - generic [ref=e250]: "01"
            - text: GitHub
            - generic [ref=e251]: "@msmele345"
            - generic [ref=e252]: ↗
        - listitem [ref=e253]:
          - link "02 Email mitchmeledev@proton.me" [ref=e254] [cursor=pointer]:
            - /url: mailto:mitchmeledev@proton.me
            - generic [ref=e255]: "02"
            - text: Email
            - generic [ref=e256]: mitchmeledev@proton.me
            - generic [ref=e257]: ↗
      - paragraph [ref=e258]: Say hi about a project, a collab, or the late shift. LinkedIn is on the bench for now.
  - contentinfo [ref=e259]:
    - generic [ref=e260]:
      - paragraph [ref=e261]: MITCH MELE
      - list [ref=e262]:
        - listitem [ref=e263]:
          - link "Work" [ref=e264] [cursor=pointer]:
            - /url: /#work
        - listitem [ref=e265]:
          - link "Blog" [ref=e266] [cursor=pointer]:
            - /url: /blog
        - listitem [ref=e267]:
          - link "Contact" [ref=e268] [cursor=pointer]:
            - /url: /#contact
        - listitem [ref=e269]:
          - link "GitHub ↗" [ref=e270] [cursor=pointer]:
            - /url: https://github.com/msmele345
      - paragraph [ref=e271]: Chicago, IL · built after dark, no templates
      - paragraph [ref=e272]: © 2026 Mitch Mele
  - alert [ref=e273]
```

# Test source

```ts
  1   | import { expect, test, type Page } from "@playwright/test";
  2   | import { readFileSync } from "node:fs";
  3   | import type { VerificationInput } from "../src/content/projects/project-verify";
  4   |
  5   | // This suite is selected only by the command's dedicated config. Ordinary tests
  6   | // keep the synthetic onboarding and rotation regressions without running twice.
  7   | const slug = process.env.PROJECT_VERIFY_SLUG;
  8   | const inputFile = process.env.PROJECT_VERIFY_INPUT;
  9   | const input: VerificationInput | undefined = inputFile ? JSON.parse(readFileSync(inputFile, "utf8")) : undefined;
  10  | test.skip(!slug || !input, "Invoked by npm run project -- verify <slug>");
  11  |
  12  | test("published case study, imagery, metadata, fallback and responsive captures", async ({ page, request }, info) => {
  13  |   if (!input) throw new Error("Missing verification input");
  14  |   const { project, selection } = input;
  15  |   expect(project.slug).toBe(slug);
  16  |   const route = `/work/${slug}`;
  17  |   expect((await page.goto(route))?.status()).toBe(200);
  18  |   const article = page.locator("article.case");
  19  |   await expect(article).toHaveClass(new RegExp(`case--${slug}(?: |$)`));
  20  |   await expect(article.getByRole("heading", { level: 1 })).toHaveText(project.title);
  21  |   await expect(article.locator(".case__pitch")).toHaveText(project.pitch);
  22  |   await expect(article.locator(".case__silkscreen")).toHaveText(`${project.tile?.motif} · ${slug}`);
  23  |   await expect(article.locator(".case__hero > [aria-hidden=\"true\"]")).toBeVisible();
  24  |   await expect(article).toHaveCSS("--case-accent", project.tile!.palette.accent);
  25  |   await expect(article.locator(".case__story-list > li")).toHaveCount(project.story.length);
  26  |   for (const section of project.story) {
  27  |     const item = article.locator(`[data-kind="${section.kind}"]`);
  28  |     await expect(item.getByRole("heading")).toHaveText(section.heading);
  29  |     await expect(item.locator("p").last()).toHaveText(section.body);
  30  |   }
  31  |   await expect(article.locator(".case__stack li")).toHaveText(project.stack);
  32  |   await expect(article.locator(".case__draft")).toHaveCount(project.draft ? 1 : 0);
  33  |   const figures = article.locator(".case__shots figure");
  34  |   await expect(figures).toHaveCount(project.screenshots.length);
  35  |   for (const [index, shot] of project.screenshots.entries()) {
  36  |     const image = figures.nth(index).getByRole("img", { name: shot.alt, exact: true });
  37  |     await image.scrollIntoViewIfNeeded();
  38  |     await expect(image).toHaveAttribute("src", shot.src);
  39  |     await expect(figures.nth(index).locator("figcaption")).toHaveText(shot.caption);
  40  |     await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  41  |     const asset = await request.get(shot.src);
  42  |     expect(asset.status()).toBe(200);
  43  |     expect(asset.headers()["content-type"]).toContain("image/");
  44  |   }
  45  |   for (const [key, label] of [["repo", "Repository"], ["demo", "Live demo"]] as const) {
  46  |     const link = article.getByRole("link", { name: new RegExp(label) });
  47  |     if (project.links[key]) await expect(link).toHaveAttribute("href", project.links[key]!);
  48  |     else await expect(link).toHaveCount(0);
  49  |   }
  50  |   await expect(article.locator(".enrichment")).toHaveCount(0);
  51  |   await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://www.mitchmele.dev${route}`);
  52  |   await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", new RegExp(project.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  53  |   const social = await request.get(`${route}/opengraph-image`);
  54  |   expect(social.status()).toBe(200);
  55  |   expect(social.headers()["content-type"]).toContain("image/png");
  56  |   expect((await social.body()).length).toBeGreaterThan(100);
  57  |   const sitemap = await request.get("/sitemap.xml");
  58  |   expect(sitemap.status()).toBe(200);
  59  |   expect(await sitemap.text()).toContain(`${route}</loc>`);
  60  |   await page.emulateMedia({ reducedMotion: "reduce" });
  61  |   for (const width of [390, 768, 1440]) {
  62  |     await page.setViewportSize({ width, height: 900 });
  63  |     await expectNoOverflow(page);
  64  |     await page.screenshot({ path: info.outputPath(`case-study-${width}.png`), fullPage: true, animations: "disabled" });
  65  |   }
  66  |   if (input.stage === "published") {
  67  |     await page.goto("/");
  68  |     await expect(page.locator(`[data-tile-slug="${slug}"]`)).toHaveCount(0);
  69  |     expect(selection.featured).not.toContain(slug);
  70  |   }
  71  | });
  72  |
  73  | test("featured membership, indices, keyboard, touch and shared motion", async ({ page, browser }, info) => {
  74  |   test.skip(input?.stage !== "featured", "Project is not featured");
  75  |   if (!input) throw new Error("Missing verification input");
  76  |   const { project, selection } = input;
  77  |   await page.goto("/");
  78  |   const wall = page.getByRole("region", { name: "Project wall" });
  79  |   const tiles = wall.locator("[data-tile-slug]");
  80  |   expect(await tiles.evaluateAll((elements) => elements.map((element) => element.getAttribute("data-tile-slug")))).toEqual(selection.featured);
  81  |   await expect(wall.locator(".project-wall__bar p")).toHaveText(`${selection.featured.length} featured project${selection.featured.length === 1 ? "" : "s"}`);
> 82  |   expect(await wall.getByRole("link").evaluateAll((links) => links.map((link) => link.getAttribute("href")))).toEqual(selection.featured.map((entry) => `/work/${entry}`));
      |                                                                                                               ^ Error: expect(received).toEqual(expected) // deep equality
  83  |   await expect(wall.locator('[class$="__index"]')).toHaveText(selection.featured.map((_, index) => String(index + 1).padStart(2, "0")));
  84  |   const motion = wall.locator(`[data-tile-slug="${slug}"]`);
  85  |   const link = motion.getByRole("link");
  86  |   await expect(link.getByText(project.title, { exact: true })).toBeVisible();
  87  |   await expect(link.locator('[class$="__pitch"]')).toHaveText(project.pitch);
  88  |   await expect(motion.locator(".enrichment")).toHaveCount(0);
  89  |   await page.emulateMedia({ reducedMotion: "reduce" });
  90  |   for (const width of [390, 768, 1440]) {
  91  |     await page.setViewportSize({ width, height: 900 });
  92  |     await expectNoOverflow(page);
  93  |     await wall.screenshot({ path: info.outputPath(`wall-${width}.png`), animations: "disabled", style: ".site-header { visibility: hidden; }" });
  94  |   }
  95  |   await page.setViewportSize({ width: 1440, height: 900 });
  96  |   await link.scrollIntoViewIfNeeded();
  97  |   const art = motion.locator('[aria-hidden="true"]').first();
  98  |   await expect(art).toBeVisible();
  99  |   expect(await motion.locator("[data-anim]").evaluateAll((elements) => elements.every((element) => getComputedStyle(element).animationName === "none"))).toBe(true);
  100 |   const links = wall.getByRole("link");
  101 |   await links.first().focus();
  102 |   for (let index = 0; index < selection.featured.length; index++) {
  103 |     await expect(links.nth(index)).toBeFocused();
  104 |     const focus = await links.nth(index).evaluate((element) => {
  105 |       const style = getComputedStyle(element);
  106 |       return style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
  107 |     });
  108 |     expect(focus).toBe(true);
  109 |     if (index < selection.featured.length - 1) await page.keyboard.press("Tab");
  110 |   }
  111 |   await link.focus();
  112 |   await page.keyboard.press("Enter");
  113 |   await expect(page).toHaveURL(new RegExp(`/work/${slug}$`));
  114 |
  115 |   await page.emulateMedia({ reducedMotion: "no-preference" });
  116 |   await page.goto("/");
  117 |   await page.mouse.move(0, 0);
  118 |   await link.scrollIntoViewIfNeeded();
  119 |   await expect(motion).toHaveAttribute("data-in-view", "true");
  120 |   await expect(motion).toHaveAttribute("data-crescendo", "false");
  121 |   const animated = motion.locator("[data-anim]");
  122 |   expect(await animated.count()).toBeGreaterThan(0);
  123 |   expect(await animated.evaluateAll((elements) => elements.some((element) => getComputedStyle(element).animationName !== "none" && getComputedStyle(element).animationPlayState === "running"))).toBe(true);
  124 |   await link.hover();
  125 |   await expect(motion).toHaveAttribute("data-crescendo", "true");
  126 |   await expect(wall.locator('[data-crescendo="true"]')).toHaveCount(1);
  127 |   await link.focus();
  128 |   await expect(motion).toHaveAttribute("data-crescendo", "true");
  129 |   if (selection.featured.length > 1) {
  130 |     // Select a different identity explicitly; the selection is the expected order.
  131 |     await wall.locator(`[data-tile-slug="${selection.featured.find((entry) => entry !== slug)}"]`).getByRole("link").hover();
  132 |     await expect(motion).toHaveAttribute("data-crescendo", "false");
  133 |     await expect(wall.locator('[data-crescendo="true"]')).toHaveCount(1);
  134 |   }
  135 |   await page.locator("footer").scrollIntoViewIfNeeded();
  136 |   await expect(motion).toHaveAttribute("data-in-view", "false");
  137 |   expect(await animated.evaluateAll((elements) => elements.every((element) => getComputedStyle(element).animationPlayState === "paused"))).toBe(true);
  138 |
  139 |   const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  140 |   try {
  141 |     const phone = await touch.newPage();
  142 |     await phone.goto(info.project.use.baseURL!);
  143 |     const phoneMotion = phone.locator(`[data-tile-slug="${slug}"]`);
  144 |     const phoneLink = phoneMotion.getByRole("link");
  145 |     await phoneLink.scrollIntoViewIfNeeded();
  146 |     await phoneLink.dispatchEvent("pointerdown", { pointerType: "touch" });
  147 |     await expect(phoneMotion).toHaveAttribute("data-crescendo", "true");
  148 |     await expect(phone.locator('[data-crescendo="true"]')).toHaveCount(1);
  149 |     await phoneLink.dispatchEvent("pointerup", { pointerType: "touch" });
  150 |     await expect(phoneMotion).toHaveAttribute("data-crescendo", "false");
  151 |     await phoneLink.tap();
  152 |     await expect(phone).toHaveURL(new RegExp(`/work/${slug}$`));
  153 |   } finally { await touch.close(); }
  154 | });
  155 |
  156 |
  157 | async function expectNoOverflow(page: Page) {
  158 |   await page.evaluate(async () => {
  159 |     await document.fonts.ready;
  160 |     window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  161 |     await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  162 |   });
  163 |   const dimensions = await page.evaluate(() => ({
  164 |     scroll: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth,
  165 |     overflowing: [...document.querySelectorAll("body *")].filter((element) => element.getBoundingClientRect().right > document.documentElement.clientWidth + 1).map((element) => element.className).slice(0, 12),
  166 |   }));
  167 |   expect(dimensions.scroll, JSON.stringify(dimensions)).toBeLessThanOrEqual(dimensions.viewport);
  168 | }
  169 |
```
