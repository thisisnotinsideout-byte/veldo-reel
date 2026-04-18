import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
} from "remotion";
import { ACCENTS, Chunk, Scene, SceneKind } from "./Scene";
import { Background } from "./Background";
import { Particles } from "./Particles";
import { FlashSweep } from "./FlashSweep";

export const REEL_FPS = 30;
export const REEL_DURATION_FRAMES = 25 * REEL_FPS; // 25s = 750 frames

type SceneDef = {
  from: number;
  duration: number;
  kind: SceneKind;
  chunks: Chunk[];
};

const s = (seconds: number) => seconds * REEL_FPS;

export const SCENES: SceneDef[] = [
  {
    from: s(0),
    duration: s(2),
    kind: "hook",
    chunks: [{ at: 0, text: "What if you never had to write a prompt again?" }],
  },
  {
    from: s(3),
    duration: s(5),
    kind: "problem",
    chunks: [
      { at: 0, text: "Right now you open Claude," },
      { at: 32, text: "describe your project," },
      { at: 62, text: "and hope it understands." },
      { at: 92, text: "It doesn't." },
      { at: 114, text: "So you reprompt, restart, waste hours." },
    ],
  },
  {
    from: s(9),
    duration: s(4),
    kind: "objection",
    chunks: [
      { at: 0, text: "And no — Claude can't do this." },
      { at: 40, text: "Claude answers what you ask." },
      { at: 78, text: "It doesn't know what you forgot to ask." },
    ],
  },
  {
    from: s(14),
    duration: s(3),
    kind: "insight",
    chunks: [
      { at: 0, text: "You need an AI" },
      { at: 30, text: "that thinks about your project" },
      { at: 58, text: "before you start building it." },
    ],
  },
  {
    from: s(18),
    duration: s(4),
    kind: "tease",
    chunks: [
      { at: 0, text: "So I'm building one." },
      { at: 32, text: "You talk to it." },
      { at: 62, text: "It suggests what you're missing." },
      { at: 92, text: "It writes every prompt for your project." },
    ],
  },
  {
    from: s(23),
    duration: s(2),
    kind: "cta",
    chunks: [
      { at: 0, text: "I'm Axus." },
      { at: 28, text: "Follow to watch me build it." },
    ],
  },
];

// Precompute per-word absolute frames for tick audio cues.
const tickFrames = (() => {
  const frames: number[] = [];
  for (const scene of SCENES) {
    for (let c = 0; c < scene.chunks.length; c++) {
      const chunk = scene.chunks[c];
      const words = chunk.text.split(/\s+/).filter((w) => w.length > 0);
      const stagger =
        words.length > 8 ? 1.4 : words.length > 5 ? 2.0 : 2.6;
      words.forEach((_, i) => {
        frames.push(scene.from + chunk.at + Math.round(i * stagger));
      });
    }
  }
  return frames;
})();

export const Reel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#07070A" }}>
      <Background />
      <Particles />

      {SCENES.map((scene, i) => (
        <Sequence
          key={`scene-${i}`}
          from={scene.from}
          durationInFrames={scene.duration}
        >
          <Scene
            kind={scene.kind}
            chunks={scene.chunks}
            duration={scene.duration}
          />
        </Sequence>
      ))}

      {/* Per-scene entrance flash + light sweep */}
      {SCENES.map((scene, i) => (
        <FlashSweep
          key={`flash-${i}`}
          at={scene.from}
          accent={ACCENTS[scene.kind]}
        />
      ))}

      {/* Subtle vignette to deepen edges above particles */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ------- Audio ------- */}
      {/* Ambient drone (full duration) */}
      <Audio src={staticFile("audio/drone.wav")} volume={0.22} />

      {/* Whoosh on each scene entrance */}
      {SCENES.map((scene, i) => {
        const from = Math.max(0, scene.from - 4);
        const duration = Math.min(
          REEL_DURATION_FRAMES - from,
          Math.ceil(0.45 * REEL_FPS) + 6,
        );
        return (
          <Sequence
            key={`whoosh-${i}`}
            from={from}
            durationInFrames={duration}
          >
            <Audio
              src={staticFile("audio/whoosh.wav")}
              volume={i === 0 ? 0.35 : 0.5}
            />
          </Sequence>
        );
      })}

      {/* Tick for each word reveal */}
      {tickFrames.map((f, i) => {
        const from = Math.max(0, f - 1);
        const duration = Math.min(REEL_DURATION_FRAMES - from, 6);
        if (duration <= 0) return null;
        return (
          <Sequence
            key={`tick-${i}`}
            from={from}
            durationInFrames={duration}
          >
            <Audio src={staticFile("audio/tick.wav")} volume={0.18} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
