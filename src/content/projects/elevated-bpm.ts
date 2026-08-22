import type { Project } from "./schema";

export const elevatedBpm = {
  title: "Elevated BPM",
  slug: "elevated-bpm",
  pitch:
    "A hardware-styled groovebox for making techno — playable from the first click, with a goal-checked curriculum woven into the live instrument.",
  draft: true,
  tile: {
    motif: "groovebox faceplate",
    displayFace: "Chakra Petch",
    palette: {
      ground: "#0c0d0f",
      panel: "#1a1c1f",
      ink: "#e8e4da",
      mute: "#8b8578",
      accent: "#4dff6a",
      steps: ["#ff4d33", "#ff9d2e", "#ffd24d", "#f2ead8"],
    },
  },
  story: [
    {
      kind: "problem",
      heading: "The instrument came last",
      body: "Learning techno usually means a DAW first, or a course that gates the machine until you pass. Production gets taught as software, not as playing. The moment you actually make a groove arrives too late — if it arrives at all.",
    },
    {
      kind: "build",
      heading: "Instrument first, curriculum inside",
      body: "Elevated BPM opens as a playable groovebox in the TR-909 / TB-303 lineage: a 16-step drum machine, a 303-style bass, and a stab synth, running on Tone.js. Lessons are JSON — short intros plus declarative goals checked against live pattern state — never a gate. Everything lives in one local ProjectState document; a pattern shares as a URL. The DAW is architecture, not UI.",
    },
    {
      kind: "result",
      heading: "Silence to groove, then export",
      body: "A classic techno kit is pre-loaded. Sound on first click. An optional arc walks silence to a first techno groove — four-on-the-floor, off-beat hats, a bassline, a filter sweep — then you export MIDI or audio into a real DAW. The app is an on-ramp to Ableton, not a competitor.",
    },
  ],
  screenshots: [
    {
      src: "/projects/elevated-bpm/deck.svg",
      alt: "Draft plate of the EB-01 deck: sixteen step keys in 909 quads and four drum pads.",
      caption: "Draft plate — the faceplate the tile will become. Replace with a live capture.",
    },
    {
      src: "/projects/elevated-bpm/arc.svg",
      alt: "Draft plate of the lesson arc as numbered hardware pads beside the transport.",
      caption: "Draft plate — the silence-to-groove arc as hardware stops. Replace with a live capture.",
    },
  ],
  links: {
    repo: "https://github.com/msmele345/elevated-bpm",
    demo: "https://elevated-bpm-dusky.vercel.app",
  },
  stack: ["Vite", "React", "TypeScript", "Tone.js", "IndexedDB"],
} as const satisfies Project;
