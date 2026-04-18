import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Anchor = { at: number; x: number; y: number; hue: number };

// Glow anchor per scene start (% coords + hue)
const ANCHORS: Anchor[] = [
  { at: 0, x: 42, y: 38, hue: 268 }, // hook — violet
  { at: 90, x: 66, y: 60, hue: 320 }, // problem — pink
  { at: 270, x: 30, y: 48, hue: 22 }, // objection — orange
  { at: 420, x: 58, y: 32, hue: 158 }, // insight — teal
  { at: 540, x: 40, y: 64, hue: 215 }, // tease — blue
  { at: 690, x: 52, y: 46, hue: 48 }, // cta — yellow
];

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const ats = ANCHORS.map((a) => a.at);
  const x = interpolate(
    frame,
    ats,
    ANCHORS.map((a) => a.x),
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.6, 0.0, 0.25, 1),
    },
  );
  const y = interpolate(
    frame,
    ats,
    ANCHORS.map((a) => a.y),
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.6, 0.0, 0.25, 1),
    },
  );
  const hue = interpolate(
    frame,
    ats,
    ANCHORS.map((a) => a.hue),
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0.0, 0.4, 1),
    },
  );

  // Breathing pulse + post-transition swell
  const breathe = 0.88 + 0.12 * Math.sin((frame / durationInFrames) * Math.PI * 8);
  let swell = 0;
  for (const a of ANCHORS) {
    const since = frame - a.at;
    if (since >= 0 && since < 40) {
      swell = Math.max(swell, Math.sin((since / 40) * Math.PI) * 0.25);
    }
  }
  const intensity = breathe + swell;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 50% at ${x}% ${y}%, hsla(${hue}, 78%, 42%, ${0.42 * intensity}) 0%, hsla(${hue}, 75%, 22%, ${0.14 * intensity}) 38%, rgba(0,0,0,0) 72%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 45% at ${100 - x}% ${100 - y}%, hsla(${(hue + 40) % 360}, 65%, 35%, ${0.18 * intensity}) 0%, rgba(0,0,0,0) 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 90% 110% at 50% 120%, rgba(18,14,28,0.85) 0%, rgba(7,7,10,0) 58%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "overlay",
          opacity: 0.6,
        }}
      />
    </AbsoluteFill>
  );
};
