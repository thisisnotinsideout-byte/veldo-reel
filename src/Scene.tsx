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

export type Chunk = { at: number; text: string };

type Props = {
  kind: SceneKind;
  chunks: Chunk[];
  duration: number;
};

export const ACCENTS: Record<SceneKind, string> = {
  hook: "#A78BFA",
  problem: "#F472B6",
  objection: "#FB923C",
  insight: "#34D399",
  tease: "#60A5FA",
  cta: "#FACC15",
};

const KEY_WORD_RE = /^(never|prompt|claude|forgot|follow)[.,!?:;]?$/i;

const clean = (w: string) => w.replace(/[^a-z]/gi, "").toLowerCase();

const pickFontSize = (text: string) => {
  const len = text.length;
  if (len < 22) return 148;
  if (len < 40) return 124;
  if (len < 60) return 104;
  if (len < 90) return 88;
  return 76;
};

export const Scene: React.FC<Props> = ({ kind, chunks, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = ACCENTS[kind];

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 72px",
      }}
    >
      {chunks.map((chunk, i) => {
        const nextAt = i < chunks.length - 1 ? chunks[i + 1].at : duration;
        return (
          <ChunkView
            key={i}
            chunk={chunk}
            endFrame={nextAt}
            accent={accent}
            frame={frame}
            fps={fps}
          />
        );
      })}
    </AbsoluteFill>
  );
};

type ChunkViewProps = {
  chunk: Chunk;
  endFrame: number;
  accent: string;
  frame: number;
  fps: number;
};

const ChunkView: React.FC<ChunkViewProps> = ({
  chunk,
  endFrame,
  accent,
  frame,
  fps,
}) => {
  const local = frame - chunk.at;
  const windowSize = endFrame - chunk.at;
  if (local < -2 || local > windowSize + 6) return null;

  const enter = spring({
    frame: local,
    fps,
    config: { damping: 18, mass: 0.9, stiffness: 130 },
  });

  const exitStart = Math.max(0, windowSize - 10);
  const exit = interpolate(local, [exitStart, windowSize], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitShift = interpolate(local, [exitStart, windowSize], [0, -28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chunkOpacity = enter * exit;
  const chunkScale = interpolate(enter, [0, 1], [0.95, 1]);
  const chunkY = interpolate(enter, [0, 1], [18, 0]);

  const tokens = chunk.text.split(/(\s+)/);
  const wordTokens = tokens.filter((t) => t.trim().length > 0);
  const fontSize = pickFontSize(chunk.text);
  const stagger = wordTokens.length > 8 ? 1.4 : wordTokens.length > 5 ? 2.0 : 2.6;

  let wordIndex = -1;

  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        top: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transform: `translateY(calc(-50% + ${chunkY + exitShift}px)) scale(${chunkScale})`,
        opacity: chunkOpacity,
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          fontFamily:
            '"Inter", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", Arial, sans-serif',
          fontWeight: 900,
          fontStyle: "normal",
          fontSize,
          lineHeight: 1.04,
          letterSpacing: -2.5,
          color: "#FFFFFF",
          textAlign: "center",
          maxWidth: 960,
          textWrap: "balance" as unknown as "balance",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {tokens.map((token, i) => {
          if (token.trim().length === 0) {
            return <span key={i}>{token}</span>;
          }
          wordIndex += 1;
          const cleaned = clean(token);
          const isKey = KEY_WORD_RE.test(token);

          const wf = local - wordIndex * stagger;
          const wordEnter = spring({
            frame: wf,
            fps,
            config: { damping: 14, mass: 0.65, stiffness: 150 },
          });
          const opacity = wordEnter;
          const translateY = (1 - wordEnter) * 30;
          const blur = (1 - wordEnter) * 8;

          const color = isKey ? accent : "#FFFFFF";
          const weight = isKey ? 900 : 800;
          const scaleBonus = isKey ? 1.18 : 1;
          const shadow = isKey
            ? `0 0 22px ${accent}55, 0 0 40px ${accent}33`
            : "none";

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity,
                color,
                fontWeight: weight,
                fontStyle: "normal",
                transform: `translateY(${translateY}px) scale(${scaleBonus})`,
                filter: blur > 0.1 ? `blur(${blur.toFixed(2)}px)` : "none",
                textShadow: shadow,
                willChange: "transform, opacity, filter",
                margin: isKey ? "0 6px" : 0,
              }}
            >
              {token}
            </span>
          );
        })}
      </div>
    </div>
  );
};
