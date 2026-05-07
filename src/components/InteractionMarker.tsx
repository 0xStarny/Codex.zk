import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  type: string;
  description: string;
  accentColor: string;
}

const TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  reveal: { label: "Reveal", icon: "◈" },
  "side-by-side": { label: "Side by Side", icon: "◫" },
  simulator: { label: "Simulator", icon: "⊜" },
  sequence: { label: "Step Sequence", icon: "→" },
  "before-after": { label: "Before / After", icon: "⇄" },
  quiz: { label: "Quiz", icon: "?" },
  diagram: { label: "Diagram", icon: "◇" },
  animation: { label: "Animation", icon: "◉" },
};

/**
 * Renders an interaction marker as a styled "interactive block" preview.
 * In V2, each type would be replaced by a real interactive widget.
 * For V1, we render a polished placeholder that conveys what would be there
 * and is itself a small click-to-expand interaction.
 */
export function InteractionMarker({ type, description, accentColor }: Props) {
  const [expanded, setExpanded] = useState(false);
  const meta = TYPE_LABELS[type] ?? { label: type, icon: "◆" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-8 not-italic"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left group"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div
          className="border-2 rounded-md p-5 transition-all hover:border-opacity-100 backdrop-blur-sm"
          style={{
            borderColor: accentColor,
            background: `linear-gradient(135deg, ${accentColor}25, ${accentColor}08 70%)`,
            boxShadow: `0 0 24px -8px ${accentColor}66`,
          }}
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <span
                className="font-mono text-lg leading-none"
                style={{ color: accentColor }}
              >
                {meta.icon}
              </span>
              <span
                className="font-mono text-[0.65rem] tracking-[0.3em] uppercase"
                style={{ color: accentColor }}
              >
                Interactive · {meta.label}
              </span>
            </div>
            <span
              className="font-mono text-xs opacity-50 group-hover:opacity-100 transition-opacity"
              style={{ color: accentColor }}
            >
              {expanded ? "− collapse" : "+ expand"}
            </span>
          </div>

          <div
            className="text-sm leading-relaxed"
            style={{ color: "rgba(244, 236, 220, 0.85)", fontStyle: "normal" }}
          >
            {description}
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div
                  className="mt-4 pt-4 border-t text-xs italic opacity-70"
                  style={{
                    borderColor: `${accentColor}33`,
                    color: "rgba(244, 236, 220, 0.7)",
                  }}
                >
                  In the full release, this is a fully interactive widget.
                  In this reading-first version, you imagine what it would
                  show — and Noiro continues the case.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    </motion.div>
  );
}
