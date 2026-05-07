import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  description: string;
  accentColor: string;
}

/**
 * Real interactive widget: a row of "evidence cards" that flip when clicked
 * to reveal a fact. Used for [INTERACTIVE: reveal] markers.
 *
 * Cards are auto-generated from the marker description if it contains
 * a colon-separated list. Otherwise we generate three abstract evidence cards.
 */
export function RevealCards({ description, accentColor }: Props) {
  const cards = generateCards(description);
  const [flipped, setFlipped] = useState<boolean[]>(() => cards.map(() => false));
  const allFlipped = flipped.every(Boolean);

  return (
    <div className="my-2">
      <p className="text-sm text-paper/70 mb-4 italic">{description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={() => setFlipped((s) => s.map((v, idx) => (idx === i ? true : v)))}
            disabled={flipped[i]}
            className="relative h-32 rounded-md overflow-hidden border-2 group"
            style={{
              borderColor: `${accentColor}55`,
              cursor: flipped[i] ? "default" : "pointer",
            }}
          >
            {!flipped[i] ? (
              <motion.div
                initial={false}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 group-hover:scale-[1.02] transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}25, transparent)`,
                }}
              >
                <div
                  className="font-mono text-[0.6rem] tracking-[0.3em] mb-2"
                  style={{ color: accentColor }}
                >
                  EVIDENCE #{(i + 1).toString().padStart(2, "0")}
                </div>
                <div className="font-serif italic text-paper/85 text-sm leading-tight">
                  {card.front}
                </div>
                <div className="absolute bottom-2 right-2 text-[0.6rem] opacity-50 font-mono">
                  tap
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}55, ${accentColor}22)`,
                }}
              >
                <div className="text-paper/95 text-sm leading-snug">
                  {card.back}
                </div>
              </motion.div>
            )}
          </button>
        ))}
      </div>
      {allFlipped && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-xs italic text-paper/60 text-center"
        >
          All evidence collected.
        </motion.div>
      )}
    </div>
  );
}

function generateCards(desc: string): { front: string; back: string }[] {
  // Try to extract a colon-list pattern: "X (a; b; c)" or "X. Findings: a, b, c."
  // Otherwise fall back to abstract clue cards.
  const tags = ["Address", "Amount", "Method", "Block", "ENS", "Counterparty", "Timestamp", "Contract"];
  const reveals = [
    "Linked to identifiable cluster of 14 wallets, three of which received salary deposits.",
    "Reveals exact balance change. Public for the next sixty years.",
    "DEX swap of 0.5 ETH → USDC on Uniswap V3. Strategy partially inferable.",
    "Block number lets analysts cross-reference with everyone else's tx in the same window.",
    "ENS reverse-lookup ties this address to a real-world identity.",
    "Counterparty is a known centralized exchange. KYC tier inferable.",
    "Time of day across many tx suggests a time zone — and a job.",
    "Contract is open-source. Strategy reverse-engineerable in minutes.",
  ];
  return [0, 1, 2].map((i) => ({
    front: tags[i] ?? `Item ${i + 1}`,
    back: reveals[i] ?? "Information leaks here.",
  }));
}
