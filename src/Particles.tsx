import React, { useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";

type Particle = {
  seed: string;
  x0: number;
  y0: number;
  r: number;
  driftX: number;
  driftY: number;
  speed: number;
  phase: number;
  baseOpacity: number;
  tint: string;
};

const PARTICLE_COUNT = 60;
const TINTS = [
  "rgba(255,255,255,",
  "rgba(210,200,255,",
  "rgba(255,210,235,",
  "rgba(200,225,255,",
];

export const Particles: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
      const seed = `p-${i}`;
      return {
        seed,
        x0: random(`${seed}-x`) * width,
        y0: random(`${seed}-y`) * height,
        r: 1.2 + random(`${seed}-r`) * 3.4,
        driftX: (random(`${seed}-dx`) - 0.5) * 60,
        driftY: -30 - random(`${seed}-dy`) * 90,
        speed: 0.25 + random(`${seed}-s`) * 0.55,
        phase: random(`${seed}-p`) * Math.PI * 2,
        baseOpacity: 0.15 + random(`${seed}-o`) * 0.45,
        tint: TINTS[Math.floor(random(`${seed}-t`) * TINTS.length)],
      };
    });
  }, [width, height]);

  const t = frame / fps;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {particles.map((p) => {
        const y = ((p.y0 + p.driftY * t * p.speed) % (height + 60) + (height + 60)) % (height + 60) - 30;
        const x = p.x0 + Math.sin(p.phase + t * p.speed) * p.driftX;
        const twinkle = 0.55 + 0.45 * Math.sin(p.phase * 1.7 + t * (0.8 + p.speed));
        const opacity = p.baseOpacity * twinkle;
        return (
          <div
            key={p.seed}
            style={{
              position: "absolute",
              left: x - p.r,
              top: y - p.r,
              width: p.r * 2,
              height: p.r * 2,
              borderRadius: "50%",
              background: `${p.tint}${opacity.toFixed(3)})`,
              boxShadow: `0 0 ${p.r * 4}px ${p.tint}${(opacity * 0.6).toFixed(3)})`,
              filter: "blur(0.4px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
