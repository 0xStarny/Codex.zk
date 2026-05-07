import { motion, AnimatePresence } from "framer-motion";
import { ACTS } from "../types";
import { investigations } from "../data/loader";
import { useGameStore } from "../store/useGameStore";

export function CodexPanel() {
  const codexOpen = useGameStore((s) => s.codexOpen);
  const closeCodex = useGameStore((s) => s.closeCodex);
  const completed = useGameStore((s) => s.completed);
  const openInvestigation = useGameStore((s) => s.openInvestigation);

  const collected = investigations.filter((i) => completed.includes(i.slug));

  return (
    <AnimatePresence>
      {codexOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCodex}
            className="fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 22, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full md:w-[480px] bg-ink-50 border-l border-amber-glow/30 overflow-y-auto"
          >
            <div className="sticky top-0 backdrop-blur-md bg-ink-50/95 border-b border-paper/10 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <div className="font-mono text-[0.65rem] tracking-[0.3em] text-amber-glow">
                  YOUR FILE
                </div>
                <div className="font-serif text-xl font-semibold">
                  Codex Cards
                </div>
              </div>
              <button
                onClick={closeCodex}
                className="font-mono text-xs px-3 py-1.5 border border-paper/20 hover:bg-paper/10 transition-colors rounded-sm"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="p-6">
              {collected.length === 0 ? (
                <div className="text-center py-16">
                  <div className="font-serif italic text-paper/50 mb-4">
                    Empty file. Solve a case to collect your first card.
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="font-serif italic text-sm text-paper/60 mb-6">
                    {collected.length} concept{collected.length !== 1 && "s"}{" "}
                    collected. Click any card to revisit the case.
                  </p>
                  {collected.map((inv) => {
                    const act = ACTS[inv.act - 1];
                    return (
                      <button
                        key={inv.slug}
                        onClick={() => {
                          openInvestigation(inv.slug);
                          closeCodex();
                        }}
                        className="w-full text-left border rounded-md p-4 transition-all hover:translate-y-[-2px]"
                        style={{
                          borderColor: `${act.accentColor}55`,
                          background: `linear-gradient(135deg, ${act.accentColor}15, transparent)`,
                        }}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className="font-mono text-[0.6rem] tracking-[0.3em]"
                            style={{ color: act.accentColor }}
                          >
                            ACT {inv.act} · #{inv.number.toString().padStart(2, "0")}
                          </span>
                          <span className="font-mono text-[0.6rem] tracking-[0.2em] text-amber-glow/70">
                            ✓ COLLECTED
                          </span>
                        </div>
                        <div className="font-serif text-lg font-semibold mb-1.5">
                          {inv.codexCard.concept}
                        </div>
                        <div className="text-sm text-paper/80 mb-2 leading-snug">
                          {inv.codexCard.oneLine}
                        </div>
                        <div className="text-xs italic text-paper/50">
                          {inv.codexCard.why}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
