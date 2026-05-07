import { useState } from "react";
import { motion } from "framer-motion";
import { ACTS } from "../types";
import { investigations } from "../data/loader";
import { useGameStore } from "../store/useGameStore";
import { isUnlocked } from "../store/unlocks";
import { NoiroIcon } from "./NoiroIcon";

/**
 * Curated coordinates for each of the 22 pyramids on a 1200×800 SVG viewBox.
 * Hand-tuned to cluster by act and draw a coherent journey arc.
 */
const POSITIONS: Record<number, { x: number; y: number }> = {
  // Act I — bottom-left "the streets"
  1: { x: 130, y: 620 },
  2: { x: 240, y: 660 },
  3: { x: 350, y: 620 },
  4: { x: 290, y: 540 },
  // Act II — upper-left "the temples"
  5: { x: 200, y: 410 },
  6: { x: 130, y: 290 },
  7: { x: 250, y: 220 },
  8: { x: 380, y: 280 },
  // Act III — center "the hidden city"
  9: { x: 460, y: 380 },
  10: { x: 540, y: 280 },
  11: { x: 600, y: 420 },
  12: { x: 700, y: 340 },
  13: { x: 700, y: 500 },
  // Act IV — right cluster "the applications"
  14: { x: 820, y: 600 },
  15: { x: 910, y: 540 },
  16: { x: 1000, y: 600 },
  17: { x: 920, y: 660 },
  18: { x: 820, y: 700 },
  // Act V — top-right culminating in the great pyramid
  19: { x: 880, y: 380 },
  20: { x: 970, y: 300 },
  21: { x: 1080, y: 360 },
  22: { x: 970, y: 170 },
};

/**
 * Curved SVG path between two points. Uses a quadratic with a perpendicular
 * offset so the trail looks organic rather than ruler-straight.
 */
function curvedPath(
  a: { x: number; y: number },
  b: { x: number; y: number },
  curvature = 0.18,
): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  // perpendicular offset
  const ox = -dy / len;
  const oy = dx / len;
  const cx = mx + ox * len * curvature;
  const cy = my + oy * len * curvature;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

export function MapView() {
  const completed = useGameStore((s) => s.completed);
  const openInvestigation = useGameStore((s) => s.openInvestigation);
  const toggleCodex = useGameStore((s) => s.toggleCodex);
  const resetProgress = useGameStore((s) => s.resetProgress);
  const [hovered, setHovered] = useState<number | null>(null);

  const completedCount = completed.length;
  const totalCount = investigations.length;
  const progress = (completedCount / totalCount) * 100;

  // Find the latest unlocked pyramid to position Noiro on the map.
  const noiroAt = (() => {
    // Prefer the last unlocked-but-not-yet-completed pyramid.
    const nextActive = investigations.find(
      (i) => isUnlocked(i.slug, completed) && !completed.includes(i.slug),
    );
    if (nextActive) return POSITIONS[nextActive.number];
    // All done? Park him on the great pyramid.
    return POSITIONS[22];
  })();

  return (
    <div className="fixed inset-0 flex flex-col bg-ink">
      {/* Header */}
      <header className="shrink-0 backdrop-blur-md bg-ink/85 border-b border-paper/10 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <NoiroIcon size={36} />
            <div className="min-w-0">
              <div className="font-mono text-[0.6rem] tracking-[0.3em] text-amber-glow/80">
                CODEX.ZK
              </div>
              <div className="font-serif text-sm italic text-paper/70 truncate">
                {completedCount} of {totalCount} cases closed
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden sm:block w-32 md:w-48 h-1.5 bg-paper/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-glow"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <button
              onClick={toggleCodex}
              className="font-mono text-xs tracking-[0.2em] px-3 md:px-4 py-2 border border-amber-glow/40 text-amber-glow hover:bg-amber-glow/10 transition-colors rounded-sm"
            >
              CODEX <span className="opacity-70">({completedCount})</span>
            </button>
            <button
              onClick={() => {
                if (confirm("Reset all progress? Codex cards will be cleared.")) {
                  resetProgress();
                }
              }}
              className="hidden md:block font-mono text-[0.65rem] tracking-[0.2em] px-2 py-1 text-paper/40 hover:text-paper/80 transition-colors"
              title="Reset progress"
            >
              ⟲
            </button>
          </div>
        </div>
      </header>

      {/* Map canvas */}
      <div className="flex-1 relative overflow-hidden">
        <MapBackground />
        <svg
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full"
        >
          {/* Region tint backgrounds */}
          {ACTS.map((act, ai) => {
            const actPyramids = investigations.filter((i) => i.act === act.number);
            if (!actPyramids.length) return null;
            const xs = actPyramids.map((p) => POSITIONS[p.number].x);
            const ys = actPyramids.map((p) => POSITIONS[p.number].y);
            const minX = Math.min(...xs) - 70;
            const maxX = Math.max(...xs) + 70;
            const minY = Math.min(...ys) - 50;
            const maxY = Math.max(...ys) + 70;
            const cx = (minX + maxX) / 2;
            const cy = (minY + maxY) / 2;
            const rx = (maxX - minX) / 2;
            const ry = (maxY - minY) / 2;
            return (
              <ellipse
                key={ai}
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                fill={`${act.accentColor}10`}
                stroke={`${act.accentColor}30`}
                strokeDasharray="4 6"
                strokeWidth="1"
              />
            );
          })}

          {/* Region labels */}
          {ACTS.map((act) => {
            const actPyramids = investigations.filter((i) => i.act === act.number);
            const xs = actPyramids.map((p) => POSITIONS[p.number].x);
            const ys = actPyramids.map((p) => POSITIONS[p.number].y);
            const cx = xs.reduce((a, b) => a + b, 0) / xs.length;
            const minY = Math.min(...ys);
            return (
              <text
                key={`label-${act.number}`}
                x={cx}
                y={minY - 60}
                textAnchor="middle"
                fontFamily="JetBrains Mono, monospace"
                fontSize="9"
                letterSpacing="3"
                fill={`${act.accentColor}cc`}
              >
                ACT {act.number.toString().padStart(2, "0")} · {act.title.toUpperCase()}
              </text>
            );
          })}

          {/* Connector paths between consecutive pyramids */}
          {investigations.map((inv) => {
            if (inv.number === 1) return null;
            const prev = investigations.find((i) => i.number === inv.number - 1);
            if (!prev) return null;
            const a = POSITIONS[prev.number];
            const b = POSITIONS[inv.number];
            const isActive =
              completed.includes(prev.slug) || completed.includes(inv.slug);
            const sameAct = prev.act === inv.act;
            const act = ACTS[inv.act - 1];
            return (
              <path
                key={`path-${inv.number}`}
                d={curvedPath(a, b, sameAct ? 0.15 : 0.32)}
                stroke={isActive ? act.accentColor : "#3a3a45"}
                strokeWidth={isActive ? "1.6" : "1"}
                strokeDasharray={isActive ? "0" : "3 5"}
                fill="none"
                opacity={isActive ? 0.9 : 0.45}
              />
            );
          })}

          {/* Pyramids */}
          {investigations.map((inv) => {
            const pos = POSITIONS[inv.number];
            const act = ACTS[inv.act - 1];
            const unlocked = isUnlocked(inv.slug, completed);
            const isComplete = completed.includes(inv.slug);
            const isHovered = hovered === inv.number;
            const isFinal = inv.number === 22;
            const size = isFinal ? 44 : 30;
            return (
              <g
                key={inv.number}
                transform={`translate(${pos.x},${pos.y})`}
                style={{ cursor: unlocked ? "pointer" : "not-allowed" }}
                onMouseEnter={() => setHovered(inv.number)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => unlocked && openInvestigation(inv.slug)}
              >
                {/* Glow ring for unlocked (static — animation is expensive on many SVG nodes) */}
                {unlocked && !isComplete && (
                  <circle
                    r={size + 10}
                    fill="none"
                    stroke={act.accentColor}
                    strokeWidth="1.4"
                    opacity={isHovered ? 0.85 : 0.5}
                  />
                )}
                {isComplete && (
                  <circle r={size + 6} fill={act.accentColor} opacity="0.18" />
                )}

                {/* Pyramid triangle */}
                <PyramidShape
                  size={size}
                  fill={
                    isComplete
                      ? act.accentColor
                      : unlocked
                        ? "#2c2c35"
                        : "#1a1a1f"
                  }
                  stroke={unlocked ? act.accentColor : "#3a3a45"}
                  opacity={unlocked ? 1 : 0.5}
                />

                {/* Number badge */}
                <circle
                  r={isFinal ? 13 : 10}
                  cy={size * 0.28}
                  fill="#0a0a0c"
                  stroke={unlocked ? act.accentColor : "#3a3a45"}
                  strokeWidth="1.2"
                />
                <text
                  y={size * 0.28 + 4}
                  textAnchor="middle"
                  fontFamily="Cormorant Garamond, Georgia, serif"
                  fontSize={isFinal ? 14 : 11}
                  fontWeight={600}
                  fill={unlocked ? act.accentColor : "#5a5a65"}
                >
                  {inv.number}
                </text>

                {/* Lock for locked */}
                {!unlocked && (
                  <g transform={`translate(0,${size * 0.6})`} opacity={0.7}>
                    <rect x={-5} y={-2} width={10} height={8} rx={1} fill="#3a3a45" />
                    <path
                      d="M -3 -2 L -3 -5 Q -3 -8 0 -8 Q 3 -8 3 -5 L 3 -2"
                      stroke="#3a3a45"
                      strokeWidth="1.4"
                      fill="none"
                    />
                  </g>
                )}

                {/* Completed checkmark */}
                {isComplete && (
                  <g transform={`translate(${size * 0.55},${size * 0.55})`}>
                    <circle r={8} fill="#0a0a0c" stroke={act.accentColor} strokeWidth="1.2" />
                    <path
                      d="M -3.5 0 L -1 2.5 L 3.5 -2"
                      stroke={act.accentColor}
                      strokeWidth="1.6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                )}

                {/* Hover halo */}
                {isHovered && unlocked && (
                  <circle
                    r={size + 18}
                    fill="none"
                    stroke={act.accentColor}
                    strokeWidth="1"
                    opacity="0.4"
                  />
                )}
              </g>
            );
          })}

          {/* Noiro avatar — pure SVG, no foreignObject, animated via Framer */}
          <motion.g
            initial={false}
            animate={{ x: noiroAt.x, y: noiroAt.y - 70 }}
            transition={{ type: "spring", stiffness: 60, damping: 18 }}
          >
            <NoiroSvgMark />
            <text
              y={36}
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize="8"
              letterSpacing="2"
              fill="#d4a14a"
              opacity="0.85"
            >
              YOU ARE HERE
            </text>
          </motion.g>
        </svg>

        {/* Floating tooltip for hovered pyramid */}
        {hovered !== null && (() => {
          const inv = investigations.find((i) => i.number === hovered);
          if (!inv) return null;
          const act = ACTS[inv.act - 1];
          const unlocked = isUnlocked(inv.slug, completed);
          const isComplete = completed.includes(inv.slug);
          return (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-none absolute left-1/2 bottom-6 -translate-x-1/2 max-w-md text-center px-5 py-3 rounded-md backdrop-blur-md border-2"
              style={{
                background: "rgba(10,10,12,0.85)",
                borderColor: act.accentColor,
              }}
            >
              <div
                className="font-mono text-[0.6rem] tracking-[0.3em] mb-0.5"
                style={{ color: act.accentColor }}
              >
                CASE #{inv.number.toString().padStart(2, "0")}
                {isComplete ? " · CLOSED" : !unlocked ? " · LOCKED" : ""}
              </div>
              <div className="font-serif text-lg font-semibold leading-tight mb-0.5">
                {inv.title}
              </div>
              <div className="font-serif italic text-sm text-paper/65 leading-snug">
                {unlocked ? inv.tagline : "Close the previous case to unlock."}
              </div>
            </motion.div>
          );
        })()}
      </div>
    </div>
  );
}

/**
 * Pure-SVG Noiro mark — small, no expensive filters or foreignObject.
 * Used as an avatar that moves around the map.
 */
function NoiroSvgMark() {
  return (
    <g>
      {/* glow */}
      <circle r="22" fill="#d4a14a" opacity="0.18" />
      {/* head */}
      <circle r="11" fill="#f4ecdc" />
      {/* hat brim */}
      <ellipse cx={0} cy={-7} rx={14} ry={2} fill="#0a0a0c" />
      {/* hat top */}
      <path d="M -10 -7 Q -10 -16 0 -16 Q 10 -16 10 -7 Z" fill="#1a1a1f" stroke="#d4a14a" strokeWidth="0.6" />
      {/* hat band */}
      <rect x={-10} y={-9} width={20} height={1.6} fill="#d4a14a" opacity="0.85" />
      {/* mask */}
      <path d="M -7.5 -2 Q -7.5 -4 -4 -4 L -1 -4 Q 0 -4 0 -2.6 Q 0 -4 1 -4 L 4 -4 Q 7.5 -4 7.5 -2 L 7.5 0 Q 7.5 2 4 2 L 1 2 Q 0 2 0 0.6 Q 0 2 -1 2 L -4 2 Q -7.5 2 -7.5 0 Z" fill="#0a0a0c" />
      {/* eye dots */}
      <circle cx={-3.5} cy={-1} r={0.8} fill="#d4a14a" />
      <circle cx={3.5} cy={-1} r={0.8} fill="#d4a14a" />
      {/* mouth */}
      <path d="M -2 5 Q 0 6.5 2 5" stroke="#1a1a1f" strokeWidth="0.7" fill="none" strokeLinecap="round" />
      {/* trench collar */}
      <path d="M -8 11 L -11 22 L 0 20 L 11 22 L 8 11 Z" fill="#1a1a1f" stroke="#d4a14a" strokeWidth="0.5" />
      <path d="M -1 11 L 0 19 L 1 11 Z" fill="#c75850" opacity="0.85" />
    </g>
  );
}

function PyramidShape({
  size,
  fill,
  stroke,
  opacity = 1,
}: {
  size: number;
  fill: string;
  stroke: string;
  opacity?: number;
}) {
  // Centered triangle, base at +size, apex at -size.
  const apex = { x: 0, y: -size };
  const baseL = { x: -size * 0.95, y: size * 0.65 };
  const baseR = { x: size * 0.95, y: size * 0.65 };
  return (
    <g opacity={opacity}>
      <ellipse cx={0} cy={size * 0.7} rx={size * 0.95} ry={4} fill="#000" opacity="0.45" />
      <path
        d={`M ${apex.x} ${apex.y} L ${baseR.x} ${baseR.y} L ${baseL.x} ${baseL.y} Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth="1.4"
      />
      <path
        d={`M ${apex.x} ${apex.y} L ${baseR.x} ${baseR.y} L 0 ${baseR.y} Z`}
        fill="#000"
        opacity={0.28}
      />
    </g>
  );
}

function MapBackground() {
  return (
    <>
      {/* Aged paper / parchment vibe with deep noir */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 65% at 50% 45%, #1a1a23 0%, #0a0a0c 100%)",
        }}
      />
      {/* Map grain texture */}
      <div
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(244,236,220,0.06) 0px, rgba(244,236,220,0.06) 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, rgba(244,236,220,0.06) 0px, rgba(244,236,220,0.06) 1px, transparent 1px, transparent 24px)",
        }}
      />
      {/* Compass rose, top-right */}
      <svg
        className="absolute top-3 right-3 opacity-40"
        width="60"
        height="60"
        viewBox="0 0 60 60"
      >
        <circle cx="30" cy="30" r="22" fill="none" stroke="#d4a14a" strokeWidth="1" />
        <circle cx="30" cy="30" r="14" fill="none" stroke="#d4a14a" strokeWidth="0.5" />
        <path
          d="M 30 8 L 33 30 L 30 52 L 27 30 Z"
          fill="#d4a14a"
          opacity="0.8"
        />
        <path d="M 8 30 L 30 27 L 52 30 L 30 33 Z" fill="#d4a14a" opacity="0.5" />
        <text
          x="30"
          y="6"
          textAnchor="middle"
          fontFamily="JetBrains Mono, monospace"
          fontSize="6"
          fill="#d4a14a"
        >
          N
        </text>
      </svg>
    </>
  );
}
