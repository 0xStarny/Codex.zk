import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ACTS } from "../types";
import { investigationBySlug } from "../data/loader";
import { parseScenes } from "../data/scenes";
import { useGameStore } from "../store/useGameStore";
import { nextInvestigation } from "../store/unlocks";
import { SceneView } from "./SceneView";
import { NoiroIcon } from "./NoiroIcon";

interface Props {
  slug: string;
}

/**
 * Beat-by-beat scene flow for an investigation. Replaces the long-scroll viewer
 * with a single-scene-per-screen game format.
 */
export function SceneFlow({ slug }: Props) {
  const inv = investigationBySlug(slug);
  const closeInvestigation = useGameStore((s) => s.closeInvestigation);
  const markCompleted = useGameStore((s) => s.markCompleted);
  const completed = useGameStore((s) => s.completed);
  const openInvestigation = useGameStore((s) => s.openInvestigation);

  const scenes = useMemo(() => (inv ? parseScenes(inv) : []), [inv]);
  const [idx, setIdx] = useState(0);
  const isComplete = completed.includes(slug);

  // Reset on slug change
  useEffect(() => {
    setIdx(0);
  }, [slug]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Keyboard nav: arrows + esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeInvestigation();
      else if (e.key === "ArrowRight" || e.key === " ") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, scenes.length, slug]);

  if (!inv) return null;

  const act = ACTS[inv.act - 1];
  const scene = scenes[idx];
  const isLast = idx === scenes.length - 1;
  const isFirst = idx === 0;

  // Mark completed when reaching the codex-card scene (the climax).
  useEffect(() => {
    if (scene?.kind === "codex" && !isComplete) {
      markCompleted(slug);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, scene?.kind, slug]);

  const goNext = () => {
    if (idx < scenes.length - 1) {
      setIdx((v) => v + 1);
    } else {
      // Last scene: advance to next investigation if available.
      const next = nextInvestigation(slug);
      if (next) openInvestigation(next);
      else closeInvestigation();
    }
  };
  const goPrev = () => {
    if (idx > 0) setIdx((v) => v - 1);
  };

  const nextLabel =
    scene?.kind === "codex"
      ? nextInvestigation(slug)
        ? "NEXT CASE →"
        : "RETURN TO MAP"
      : isLast
        ? nextInvestigation(slug)
          ? "NEXT CASE →"
          : "RETURN TO MAP"
        : scene?.kind === "reveal"
          ? "EARN CARD →"
          : "CONTINUE →";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 ${act.bgClass} flex flex-col`}
    >
      {/* Top bar */}
      <header className="backdrop-blur-md bg-ink/75 border-b border-paper/10 z-10 shrink-0">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <NoiroIcon size={32} />
            <div className="min-w-0">
              <div
                className="font-mono text-[0.6rem] tracking-[0.3em] truncate"
                style={{ color: act.accentColor }}
              >
                ACT {inv.act} · CASE {inv.number.toString().padStart(2, "0")}
              </div>
              <div className="font-serif italic text-sm text-paper/70 truncate">
                {inv.title}
              </div>
            </div>
          </div>

          {/* Scene dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {scenes.map((s, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Jump to scene ${i + 1}: ${s.heading}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === idx ? 22 : 8,
                  background:
                    i <= idx ? act.accentColor : `${act.accentColor}33`,
                }}
              />
            ))}
          </div>

          <button
            onClick={closeInvestigation}
            className="font-mono text-xs tracking-[0.2em] px-3 py-1.5 border border-paper/20 text-paper/70 hover:bg-paper/10 transition-colors rounded-sm shrink-0"
          >
            ← MAP
          </button>
        </div>
      </header>

      {/* Scene body — keyed wrapper handles mount/unmount; SceneView itself runs the motion. */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-8 py-10 md:py-16 min-h-full" key={`${slug}-${idx}`}>
          <SceneView
            scene={scene}
            inv={inv}
            accentColor={act.accentColor}
          />
        </div>
      </div>

      {/* Bottom controls */}
      <footer className="backdrop-blur-md bg-ink/85 border-t border-paper/10 shrink-0">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={goPrev}
            disabled={isFirst}
            className="font-mono text-xs tracking-[0.2em] px-4 py-2 border border-paper/20 text-paper/70 hover:bg-paper/10 transition-colors rounded-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← BACK
          </button>

          <div className="font-mono text-[0.65rem] tracking-[0.3em] text-paper/40">
            SCENE {idx + 1} / {scenes.length}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={goNext}
            className="font-mono text-xs tracking-[0.25em] px-5 py-2.5 rounded-sm font-semibold"
            style={{
              background: act.accentColor,
              color: "#0a0a0c",
              boxShadow: `0 0 20px -4px ${act.accentColor}88`,
            }}
          >
            {nextLabel}
          </motion.button>
        </div>
      </footer>
    </motion.div>
  );
}
