import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type SceneKind =
  | "hook"
  | "problem"
  | "objection"
  | "insight"
  | "tease"
  | "cta";

type Props = {
  text: string;
  label: string;
  kind: SceneKind;
  index: number;
  total: number;
  duration: number;
};

const ACCENTS: Record<SceneKind, string> = {
  hook: "#A78BFA",
  problem: "#F472B6",
  objection: "#FB923C",
  insight: "#34D399",
  tease: "#60A5FA",
  cta: "#FACC15",
};

const pickFontSize = (text: string) => {
  const len = text.length;
  if (len < 60) return 104;
  if (len < 100) return 84;
  if (len < 140) return 72;
  return 60;
};

export const Scene: React.FC<Props> = ({
  text,
  label,
  kind,
  index,
  total,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const accent = ACCENTS[kind];
  const words = text.split(/(\s+)/);
  const wordCount = words.filter((w) => w.trim().length > 0).length;
  const stagger = wordCount > 18 ? 1.2 : wordCount > 10 ? 1.8 : 2.6;

  const exitStart = duration - 14;
  const exit = interpolate(frame, [exitStart, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitShift = interpolate(frame, [exitStart, duration], [0, -24], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chromeEnter = spring({
    frame,
    fps,
    config: { damping: 18, mass: 0.9, stiffness: 110 },
  });

  const fontSize = pickFontSize(text);

  let wordIdx = -1;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 18,
          opacity: chromeEnter * exit,
          transform: `translateY(${(1 - chromeEnter) * -12 + exitShift * 0.3}px)`,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            backgroundColor: accent,
            boxShadow: `0 0 20px ${accent}`,
          }}
        />
        <div
          style={{
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", sans-serif',
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.72)",
          }}
        >
          {label}
        </div>
      </div>

      <div
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", sans-serif',
          fontWeight: 800,
          fontSize,
          lineHeight: 1.08,
          letterSpacing: -2.5,
          color: "#FFFFFF",
          textAlign: "center",
          maxWidth: 960,
          textWrap: "balance" as any,
          transform: `translateY(${exitShift}px)`,
          opacity: exit,
        }}
      >
        {words.map((token, i) => {
          if (token.trim().length === 0) {
            return <span key={i}>{token}</span>;
          }
          wordIdx += 1;
          const wf = frame - wordIdx * stagger;
          const wordEnter = spring({
            frame: wf,
            fps,
            config: { damping: 16, mass: 0.7, stiffness: 130 },
          });
          const opacity = wordEnter;
          const translateY = (1 - wordEnter) * 34;
          const blur = (1 - wordEnter) * 6;

          const isEmphasised =
            kind === "hook" && /prompt|never/i.test(token.replace(/[^a-z]/gi, ""));
          const ctaEmphasis =
            kind === "cta" && /follow|watch/i.test(token.replace(/[^a-z]/gi, ""));

          const color =
            isEmphasised || ctaEmphasis ? accent : "#FFFFFF";

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity,
                color,
                transform: `translateY(${translateY}px)`,
                filter: blur > 0.1 ? `blur(${blur}px)` : "none",
                willChange: "transform, opacity, filter",
              }}
            >
              {token}
            </span>
          );
        })}
      </div>

      <SceneProgress
        index={index}
        total={total}
        accent={accent}
        opacity={chromeEnter * exit}
      />
    </AbsoluteFill>
  );
};

const SceneProgress: React.FC<{
  index: number;
  total: number;
  accent: string;
  opacity: number;
}> = ({ index, total, accent, opacity }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 160,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 14,
        opacity,
      }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === index;
        return (
          <div
            key={i}
            style={{
              width: isActive ? 44 : 14,
              height: 6,
              borderRadius: 999,
              backgroundColor: isActive ? accent : "rgba(255,255,255,0.22)",
              boxShadow: isActive ? `0 0 18px ${accent}` : "none",
              transition: "all 200ms ease",
            }}
          />
        );
      })}
    </div>
  );
};
