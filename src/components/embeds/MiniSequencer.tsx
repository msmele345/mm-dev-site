"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Minimal two-lane step sequencer embedded in blog posts — the smallest
 * playable slice of elevated-bpm's instrument-first idea (ADR 0005's
 * proof that posts can carry React embeds).
 *
 * Audio is scheduled with a look-ahead clock (never setTimeout for musical
 * time); React state only mirrors the playhead for the UI.
 */

const STEPS = 8;
const BPM = 124;
const STEP_SECONDS = 60 / BPM / 2;
const LOOKAHEAD_SECONDS = 0.12;
const TICK_MS = 25;

const LANES = [
  { key: "kick", label: "Kick" },
  { key: "hat", label: "Hat" },
] as const;

type LaneKey = (typeof LANES)[number]["key"];

const INITIAL_PATTERN: Record<LaneKey, boolean[]> = {
  kick: [true, false, true, false, true, false, true, false],
  hat: [false, true, false, true, false, true, false, true],
};

type Clock = {
  ctx: AudioContext;
  timer: ReturnType<typeof setInterval>;
  nextStepTime: number;
  step: number;
};

export default function MiniSequencer() {
  const [pattern, setPattern] = useState(INITIAL_PATTERN);
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);

  const patternRef = useRef(INITIAL_PATTERN);
  const clockRef = useRef<Clock | null>(null);
  const visualTimersRef = useRef<Set<number>>(new Set());

  const stop = useCallback(() => {
    const clock = clockRef.current;
    if (!clock) return;
    clockRef.current = null;
    clearInterval(clock.timer);
    for (const timer of visualTimersRef.current) {
      window.clearTimeout(timer);
    }
    visualTimersRef.current.clear();
    void clock.ctx.close();
    setPlaying(false);
    setCurrentStep(null);
  }, []);

  useEffect(() => stop, [stop]);

  const playStep = (clock: Clock, lane: LaneKey, step: number, when: number) => {
    const { ctx } = clock;
    if (lane === "kick") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, when);
      osc.frequency.exponentialRampToValueAtTime(45, when + 0.12);
      gain.gain.setValueAtTime(0.9, when);
      gain.gain.exponentialRampToValueAtTime(0.001, when + 0.28);
      osc.connect(gain).connect(ctx.destination);
      osc.start(when);
      osc.stop(when + 0.3);
    } else {
      const length = Math.floor(ctx.sampleRate * 0.06);
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const channel = buffer.getChannelData(0);
      for (let i = 0; i < length; i += 1) {
        channel[i] = (Math.random() * 2 - 1) * (1 - i / length);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 7000;
      gain.gain.setValueAtTime(0.35, when);
      gain.gain.exponentialRampToValueAtTime(0.001, when + 0.06);
      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.start(when);
    }
  };

  const start = useCallback(() => {
    const ctx = new AudioContext();
    const clock: Clock = {
      ctx,
      timer: 0 as unknown as ReturnType<typeof setInterval>,
      nextStepTime: ctx.currentTime + 0.06,
      step: 0,
    };

    clock.timer = setInterval(() => {
      while (clock.nextStepTime < ctx.currentTime + LOOKAHEAD_SECONDS) {
        const step = clock.step % STEPS;
        const when = clock.nextStepTime;

        for (const { key } of LANES) {
          if (patternRef.current[key][step]) {
            playStep(clock, key, step, when);
          }
        }

        const delay = Math.max(0, (when - ctx.currentTime) * 1000);
        const visualTimer = window.setTimeout(() => {
          visualTimersRef.current.delete(visualTimer);
          if (clockRef.current === clock) {
            setCurrentStep(step);
          }
        }, delay);
        visualTimersRef.current.add(visualTimer);

        clock.step += 1;
        clock.nextStepTime += STEP_SECONDS;
      }
    }, TICK_MS);

    clockRef.current = clock;
    setPlaying(true);
  }, []);

  const toggleLaneStep = (lane: LaneKey, step: number) => {
    const next = { ...patternRef.current, [lane]: [...patternRef.current[lane]] };
    next[lane][step] = !next[lane][step];
    patternRef.current = next;
    setPattern(next);
  };

  return (
    <div
      className="embed-sequencer"
      role="group"
      aria-label="Mini sequencer demo"
    >
      <div className="embed-sequencer__topline">
        <span className="embed-sequencer__brand">GROOVEBOX</span>
        <button
          type="button"
          className="embed-sequencer__transport"
          onClick={playing ? stop : start}
        >
          {playing ? "Stop" : "Play"}
        </button>
      </div>

      <div className="embed-sequencer__grid">
        {LANES.map(({ key, label }) => (
          <div key={key} className="embed-sequencer__lane">
            <span className="embed-sequencer__lane-label" id={`embed-${key}`}>
              {label}
            </span>
            <div
              className="embed-sequencer__steps"
              role="group"
              aria-labelledby={`embed-${key}`}
            >
              {Array.from({ length: STEPS }, (_, step) => (
                <button
                  key={step}
                  type="button"
                  className="embed-sequencer__step"
                  aria-label={`Step ${step + 1}, ${label.toLowerCase()}`}
                  aria-pressed={pattern[key][step]}
                  data-current={currentStep === step}
                  data-beat={step % 2 === 0}
                  onClick={() => toggleLaneStep(key, step)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="embed-sequencer__note">
        {BPM} BPM · eighth-note grid · flip steps while it runs
      </p>
    </div>
  );
}
