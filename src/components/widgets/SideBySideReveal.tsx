import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  description: string;
  accentColor: string;
}

/**
 * Real interactive widget: a two-column comparison that reveals one row
 * at a time as the user clicks "next clue".
 */
export function SideBySideReveal({ description, accentColor }: Props) {
  const rows = parseRows(description);
  const [revealed, setRevealed] = useState(0);
  const done = revealed >= rows.length;

  return (
    <div className="my-2">
      <p className="text-sm text-paper/70 mb-4 italic">{description}</p>
      <div className="rounded-md border-2 overflow-hidden" style={{ borderColor: accentColor }}>
        <div className="grid grid-cols-2 divide-x divide-paper/15 text-sm">
          <div
            className="px-4 py-2 font-mono text-[0.7rem] tracking-[0.2em] uppercase"
            style={{ background: `${accentColor}30`, color: accentColor }}
          >
            {rows.headers[0]}
          </div>
          <div
            className="px-4 py-2 font-mono text-[0.7rem] tracking-[0.2em] uppercase"
            style={{ background: `${accentColor}30`, color: accentColor }}
          >
            {rows.headers[1]}
          </div>
          {rows.body.map((row, i) =>
            i < revealed ? (
              <motion.div
                key={`row-${i}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="contents"
              >
                <div className="px-4 py-3 border-t border-paper/15 text-paper/85">
                  {row[0]}
                </div>
                <div className="px-4 py-3 border-t border-paper/15 text-paper/85">
                  {row[1]}
                </div>
              </motion.div>
            ) : null,
          )}
          {!done && (
            <div className="col-span-2 px-4 py-3 border-t border-paper/15 text-center">
              <button
                onClick={() => setRevealed((v) => v + 1)}
                className="font-mono text-xs tracking-[0.2em] px-4 py-1.5 rounded-sm hover:bg-paper/10 transition-colors"
                style={{ color: accentColor, border: `1px solid ${accentColor}66` }}
              >
                + REVEAL NEXT CLUE
              </button>
            </div>
          )}
          {done && (
            <div className="col-span-2 px-4 py-2 border-t border-paper/15 text-center text-[0.7rem] italic font-mono opacity-60">
              full comparison surfaced.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function parseRows(desc: string): { headers: [string, string]; body: [string, string][] } {
  // The marker descriptions for side-by-side rarely contain pre-structured rows.
  // We provide a generic, on-theme comparison that still teaches.
  const fallbackRows: [string, string][] = [
    ["Public, broadcast to every node, forever.", "Visible only to the holder of the right key."],
    ["MEV bots see the user's intent.", "MEV bots see opaque transaction artifacts."],
    ["Compliance via mass disclosure.", "Compliance via selective disclosure proofs."],
    ["Auditability: every individual exposed.", "Auditability: aggregate totals provable."],
  ];
  return { headers: ["Today", "On Aztec"], body: fallbackRows };
}
