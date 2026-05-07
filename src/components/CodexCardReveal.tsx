import { motion } from "framer-motion";
import type { Investigation } from "../types";

interface Props {
  inv: Investigation;
  accentColor: string;
}

/**
 * Climactic "Codex Card earned" scene. The card drops in with a glow,
 * gold dust effect, and a tag stamp.
 */
export function CodexCardReveal({ inv, accentColor }: Props) {
  return (
    <div className="relative max-w-2xl mx-auto py-12">
      {/* Ambient glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 -z-10 blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accentColor}55, transparent 70%)` }}
      />

      <motion.div
        initial={{ opacity: 0, y: -40, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 110, damping: 16 }}
        className="text-center mb-8"
      >
        <div
          className="font-mono text-[0.7rem] tracking-[0.5em] mb-2"
          style={{ color: accentColor }}
        >
          NEW CODEX CARD
        </div>
        <div className="font-serif italic text-paper/60 text-lg">
          A new concept enters your file.
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32, rotate: 4 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 90, damping: 16 }}
        className="relative rounded-lg overflow-hidden border-2 backdrop-blur-md"
        style={{
          borderColor: accentColor,
          background: `linear-gradient(155deg, ${accentColor}30, ${accentColor}08 70%)`,
          boxShadow: `0 0 60px -10px ${accentColor}88`,
        }}
      >
        {/* Stamp ribbon */}
        <div
          className="absolute -top-1 -right-12 rotate-[28deg] px-12 py-1 font-mono text-[0.65rem] tracking-[0.3em] shadow-lg"
          style={{ background: accentColor, color: "#0a0a0c" }}
        >
          ✓ COLLECTED
        </div>

        <div className="p-8">
          <div
            className="font-mono text-[0.65rem] tracking-[0.3em] mb-2"
            style={{ color: accentColor }}
          >
            ACT {inv.act} · CASE #{inv.number.toString().padStart(2, "0")}
          </div>
          <h3 className="font-serif text-3xl font-semibold mb-4">
            {inv.codexCard.concept}
          </h3>
          <p className="text-lg text-paper/90 leading-relaxed mb-4">
            {inv.codexCard.oneLine}
          </p>
          <p className="font-serif italic text-paper/60 text-sm border-t border-paper/15 pt-4">
            <span className="opacity-60">Why it matters:</span>{" "}
            {inv.codexCard.why}
          </p>
        </div>
      </motion.div>

      {/* Sparkle accents */}
      {[
        { x: -16, y: -8, size: 6, delay: 0.6 },
        { x: 84, y: 12, size: 4, delay: 0.8 },
        { x: 92, y: 88, size: 5, delay: 1.0 },
        { x: 12, y: 70, size: 4, delay: 1.2 },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: accentColor,
            boxShadow: `0 0 12px ${accentColor}`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1, 0], scale: [0, 1, 0.6, 1, 0] }}
          transition={{ duration: 3, delay: s.delay, repeat: Infinity, repeatDelay: 1.5 }}
        />
      ))}
    </div>
  );
}
