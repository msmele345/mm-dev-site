import type { Project } from "../schema";

export const elevatedBpm = {
  title: "Elevated BPM",
  slug: "elevated-bpm",
  pitch:
    "A drum machine and synths in your browser that teach you to make techno. It’s playable from the first click, with short lessons built into the instrument.",
  invitation: "Make a beat",
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
      heading: "Learning techno starts in the wrong place",
      body: "Learning to make techno often means starting with complex studio software, or with a course that keeps the instrument locked until you pass a lesson. Both put off the moment you actually make a beat.",
    },
    {
      kind: "build",
      heading: "An instrument with lessons inside",
      body: "Elevated BPM opens as a groovebox modeled on two classic techno machines, the TR-909 drum machine and the TB-303 bass synth. It has a 16-step drum machine, a bass synth, and a synth for chords. Lessons are optional and never lock anything. Each one sets a small goal, like “put a kick on every beat,” and the app notices when your pattern meets it. Your work saves in the browser with no account, and you can share a beat as a link.",
    },
    {
      kind: "result",
      heading: "From silence to a first groove",
      body: "A classic techno kit is loaded and makes sound on the first click. The lessons build from silence to a first techno groove: a steady kick, off-beat hi-hats, a clap on 2 and 4, a bassline, a filter sweep, and chord stabs. A second set of lessons covers sampling. Support for playing it from a hardware MIDI controller is coming soon. It’s meant as a first step toward full music software like Ableton, not a replacement for it.",
    },
  ],
  screenshots: [
    {
      src: "/projects/elevated-bpm/deck.svg",
      alt: "EB-01 deck: sixteen step keys in four colors and pads labeled kick, clap, closed hat, and open hat.",
      caption: "The faceplate. Sixteen steps and four drum pads.",
    },
    {
      src: "/projects/elevated-bpm/arc.svg",
      alt: "Lesson arc labeled silence to groove, step 04 of 14, clap on 2 and 4.",
      caption: "The lesson arc, from silence to a first groove.",
    },
  ],
  links: {
    repo: "https://github.com/msmele345/elevated-bpm",
    demo: "https://elevated-bpm-dusky.vercel.app",
  },
  stack: ["Vite", "React", "TypeScript", "Tone.js", "IndexedDB"],
} as const satisfies Project;
