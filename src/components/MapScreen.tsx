import { motion } from "framer-motion";
import { ACTS } from "../types";
import { investigations, investigationsByAct } from "../data/loader";
import { useGameStore } from "../store/useGameStore";
import { isUnlocked, isActUnlocked } from "../store/unlocks";
import { Pyramid } from "./Pyramid";
import { NoiroIcon } from "./NoiroIcon";

export function MapScreen() {
  const completed = useGameStore((s) => s.completed);
  const openInvestigation = useGameStore((s) => s.openInvestigation);
  const toggleCodex = useGameStore((s) => s.toggleCodex);

  const totalCount = investigations.length;
  const completedCount = completed.length;
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-ink/85 border-b border-paper/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NoiroIcon size={36} />
            <div>
              <div className="font-mono text-[0.65rem] tracking-[0.3em] text-amber-glow/80">
                CODEX.ZK
              </div>
              <div className="font-serif text-sm italic text-paper/70">
                {completedCount} of {totalCount} cases closed
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block w-48 h-1.5 bg-paper/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-amber-glow"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <button
              onClick={toggleCodex}
              className="font-mono text-xs tracking-[0.2em] px-4 py-2 border border-amber-glow/40 text-amber-glow hover:bg-amber-glow/10 transition-colors rounded-sm"
            >
              CODEX ({completedCount})
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-8 text-center">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-3">
          The Map of Investigations
        </h1>
        <p className="font-serif italic text-paper/60 leading-relaxed">
          Each pyramid is a case. Solve them in order — Noiro will guide you
          from the streets of Mainnet, through the temples of zero-knowledge,
          into the hidden city of Aztec, the applications, and the projection.
        </p>
      </div>

      {/* Acts */}
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        {ACTS.map((act) => {
          const actInvestigations = investigationsByAct(act.number);
          const actUnlocked = isActUnlocked(act.number, completed);
          const actCompleted = actInvestigations.every((i) =>
            completed.includes(i.slug),
          );
          const actCompletedCount = actInvestigations.filter((i) =>
            completed.includes(i.slug),
          ).length;

          return (
            <motion.section
              key={act.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className={`${act.bgClass} rounded-lg border border-paper/10 p-6 md:p-10 relative overflow-hidden`}
              style={{
                opacity: actUnlocked ? 1 : 0.35,
              }}
            >
              <div className="map-grain absolute inset-0 pointer-events-none" />

              <div className="relative">
                {/* Act header */}
                <div className="flex flex-wrap items-end justify-between gap-4 mb-8 pb-6 border-b border-paper/10">
                  <div>
                    <div
                      className="font-mono text-xs tracking-[0.3em] mb-1"
                      style={{ color: act.accentColor }}
                    >
                      ACT {act.number.toString().padStart(2, "0")}
                      {actCompleted && " · CLOSED"}
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-1">
                      {act.title}
                    </h2>
                    <p className="font-serif italic text-paper/60 text-sm">
                      {act.subtitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs text-paper/50">
                      {actCompletedCount} / {actInvestigations.length} solved
                    </div>
                    <div className="w-32 h-1 bg-paper/10 rounded-full overflow-hidden mt-1.5">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${(actCompletedCount / actInvestigations.length) * 100}%`,
                          background: act.accentColor,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-paper/70 mb-8 max-w-2xl">{act.description}</p>

                {/* Pyramids row */}
                <div className="flex flex-wrap gap-6 md:gap-10 justify-center md:justify-start items-end">
                  {actInvestigations.map((inv, idx) => {
                    const unlocked = isUnlocked(inv.slug, completed);
                    const isComplete = completed.includes(inv.slug);
                    const state = isComplete
                      ? "completed"
                      : unlocked
                        ? "unlocked"
                        : "locked";
                    return (
                      <div key={inv.slug} className="flex items-end gap-4">
                        <Pyramid
                          number={inv.number}
                          title={inv.title}
                          state={state}
                          accentColor={act.accentColor}
                          onClick={() =>
                            unlocked && openInvestigation(inv.slug)
                          }
                          size={
                            inv.number === actInvestigations.length &&
                            act.number === 5
                              ? "lg"
                              : "md"
                          }
                        />
                        {idx < actInvestigations.length - 1 && (
                          <div
                            className="hidden md:block h-0.5 w-12 mb-12 opacity-40"
                            style={{
                              background: `linear-gradient(90deg, ${act.accentColor}, transparent)`,
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {!actUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/60 backdrop-blur-sm rounded-lg pointer-events-auto">
                    <div className="text-center">
                      <div className="font-mono text-xs tracking-[0.3em] text-paper/60 mb-2">
                        ACT LOCKED
                      </div>
                      <div className="font-serif italic text-paper/70 max-w-sm">
                        Close every case in Act {act.number - 1} to unlock.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-6 py-12 mt-12 text-center">
        <p className="font-serif italic text-paper/40 text-sm">
          Codex.zk · A field manual on programmable privacy.
        </p>
        <p className="font-mono text-[0.65rem] tracking-[0.2em] text-paper/30 mt-2">
          Built on Aztec & Noir reference material · Updated 2026
        </p>
      </footer>
    </div>
  );
}
