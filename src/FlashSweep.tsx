import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

type Props = {
  at: number;
  accent: string;
};

export const FlashSweep: React.FC<Props> = ({ at, accent }) => {
  const frame = useCurrentFrame();
  const t = frame - at;

  // Active window: -4 to +22 frames around the scene boundary
  if (t < -4 || t > 22) return null;

  const flash = interpolate(t, [-4, 0, 6], [0, 0.32, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const sweepProgress = interpolate(t, [-2, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  const sweepPos = sweepProgress * 180 - 40;
  const sweepOpacity = Math.sin(Math.max(0, Math.min(1, sweepProgress)) * Math.PI) * 0.7;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          backgroundColor: "#FFFFFF",
          opacity: flash,
          mixBlendMode: "screen",
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(115deg, rgba(0,0,0,0) ${sweepPos - 18}%, ${accent}66 ${sweepPos - 4}%, rgba(255,255,255,0.55) ${sweepPos}%, ${accent}66 ${sweepPos + 4}%, rgba(0,0,0,0) ${sweepPos + 18}%)`,
          opacity: sweepOpacity,
          mixBlendMode: "screen",
          filter: "blur(6px)",
        }}
      />
    </AbsoluteFill>
  );
};
