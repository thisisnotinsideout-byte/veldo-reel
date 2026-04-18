import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Scene, SceneKind } from "./Scene";
import { Background } from "./Background";

export const REEL_FPS = 30;
export const REEL_DURATION_FRAMES = 25 * REEL_FPS; // 25s

type SceneDef = {
  from: number;
  duration: number;
  kind: SceneKind;
  label: string;
  text: string;
};

const s = (seconds: number) => seconds * REEL_FPS;

export const SCENES: SceneDef[] = [
  {
    from: s(0),
    duration: s(2),
    kind: "hook",
    label: "Hook",
    text: "What if you never had to write a prompt again?",
  },
  {
    from: s(3),
    duration: s(5),
    kind: "problem",
    label: "The Problem",
    text:
      "Right now you open Claude, describe your project, and hope it understands. It doesn't. So you reprompt, restart, and waste hours.",
  },
  {
    from: s(9),
    duration: s(4),
    kind: "objection",
    label: "Objection",
    text:
      "And no — Claude can't do this. Claude answers what you ask. It doesn't know what you forgot to ask.",
  },
  {
    from: s(14),
    duration: s(3),
    kind: "insight",
    label: "The Insight",
    text:
      "You need an AI that thinks about your project before you start building it.",
  },
  {
    from: s(18),
    duration: s(4),
    kind: "tease",
    label: "The Build",
    text:
      "So I'm building one. You talk to it, it suggests what you're missing, and it creates every prompt for your entire project.",
  },
  {
    from: s(23),
    duration: s(2),
    kind: "cta",
    label: "I'm Axus",
    text: "Follow to watch me build it.",
  },
];

export const Reel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#07070A" }}>
      <Background />
      {SCENES.map((scene, i) => (
        <Sequence
          key={i}
          from={scene.from}
          durationInFrames={scene.duration}
          name={scene.label}
        >
          <Scene
            text={scene.text}
            label={scene.label}
            kind={scene.kind}
            index={i}
            total={SCENES.length}
            duration={scene.duration}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
