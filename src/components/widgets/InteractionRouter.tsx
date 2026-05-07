import { RevealCards } from "./RevealCards";
import { SideBySideReveal } from "./SideBySideReveal";
import { SequenceStepper } from "./SequenceStepper";
import { motion } from "framer-motion";
import type { InteractionMarker } from "../../data/scenes";

interface Props {
  marker: InteractionMarker;
  accentColor: string;
  /** Slug of the parent investigation, used to pick a tailored variant. */
  investigationSlug: string;
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
 * Routes an interaction marker to the right widget based on its type.
 * Falls back to a styled "preview" block for types without a real widget yet.
 */
export function InteractionRouter({ marker, accentColor, investigationSlug }: Props) {
  const meta = TYPE_LABELS[marker.type] ?? { label: marker.type, icon: "◆" };

  let widget: React.ReactNode;
  switch (marker.type) {
    case "reveal":
      widget = <RevealCards description={marker.description} accentColor={accentColor} />;
      break;
    case "side-by-side":
    case "before-after":
      widget = <SideBySideReveal description={marker.description} accentColor={accentColor} />;
      break;
    case "simulator":
    case "sequence":
    case "animation":
      widget = (
        <SequenceStepper
          description={marker.description}
          accentColor={accentColor}
          variant={pickVariant(investigationSlug, marker.type)}
        />
      );
      break;
    default:
      widget = (
        <p className="text-sm text-paper/70 italic m-0">{marker.description}</p>
      );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-md border-2 p-5 backdrop-blur-sm"
      style={{
        borderColor: accentColor,
        background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05 70%)`,
        boxShadow: `0 0 32px -8px ${accentColor}66`,
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg leading-none" style={{ color: accentColor }}>
            {meta.icon}
          </span>
          <span
            className="font-mono text-[0.6rem] tracking-[0.3em] uppercase"
            style={{ color: accentColor }}
          >
            {marker.category} · {meta.label}
          </span>
        </div>
      </div>
      {widget}
    </motion.div>
  );
}

function pickVariant(
  slug: string,
  type: string,
): "wallet-stalk" | "cave-protocol" | "tx-flow" | "generic" {
  if (slug === "the-glass-house" && type === "simulator") return "wallet-stalk";
  if (slug === "the-magic-door") return "cave-protocol";
  if (slug === "inside-an-aztec-tx") return "tx-flow";
  return "generic";
}
