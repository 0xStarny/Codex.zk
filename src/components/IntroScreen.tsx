import { motion } from "framer-motion";
import { NoiroIcon } from "./NoiroIcon";
import { useGameStore } from "../store/useGameStore";

export function IntroScreen() {
  const dismissIntro = useGameStore((s) => s.dismissIntro);

  return (
    <div className="min-h-screen flex items-center justify-center act-1-bg map-grain px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl text-center"
      >
        <div className="flex justify-center mb-6 animate-flicker">
          <NoiroIcon size={140} />
        </div>

        <div className="font-mono text-xs tracking-[0.4em] text-amber-glow/80 mb-3">
          CODEX.ZK
        </div>

        <h1 className="font-serif text-5xl md:text-6xl font-semibold mb-5 leading-tight">
          The Case For
          <br />
          <em className="text-amber-glow">Programmable Privacy.</em>
        </h1>

        <p className="font-serif italic text-lg md:text-xl text-paper/70 mb-10 leading-relaxed max-w-xl mx-auto">
          Twenty-two cases. One detective. The whole story of why Aztec, Noir,
          and zero-knowledge proofs are quietly rewriting what's possible on a
          public chain.
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={dismissIntro}
          className="px-8 py-3 bg-amber-glow text-ink font-semibold tracking-wide hover:bg-amber-glow/90 transition-colors rounded-sm font-mono text-sm"
        >
          OPEN THE FILE →
        </motion.button>

        <p className="mt-8 text-xs text-paper/40 font-mono">
          No prior knowledge required. ~2 hours of reading total.
        </p>
      </motion.div>
    </div>
  );
}
