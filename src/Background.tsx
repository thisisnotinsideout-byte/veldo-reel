import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = frame / durationInFrames;
  const hue = interpolate(progress, [0, 1], [260, 200]);

  const drift = Math.sin((frame / 120) * Math.PI) * 80;
  const driftY = Math.cos((frame / 160) * Math.PI) * 60;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 55% at ${50 + drift / 20}% ${45 + driftY / 20}%, hsla(${hue}, 70%, 40%, 0.35) 0%, hsla(${hue}, 70%, 20%, 0.10) 35%, rgba(0,0,0,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 120%, rgba(20,16,32,0.8) 0%, rgba(7,7,10,0) 60%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};
