import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ACTS } from "../types";
import { investigationBySlug } from "../data/loader";
import { useGameStore } from "../store/useGameStore";
import { nextInvestigation } from "../store/unlocks";
import { InteractionMarker } from "./InteractionMarker";
import { NoiroIcon } from "./NoiroIcon";

interface Props {
  slug: string;
}

interface Block {
  type: "markdown" | "interaction";
  content: string;
  // For interactions:
  interactionType?: string;
  description?: string;
}

/**
 * Splits the body into a sequence of markdown chunks and interaction markers.
 * Markers look like: [INTERACTIVE: type] description...   (until end of paragraph)
 *                    [VISUAL: type] description...
 */
function parseBody(body: string): Block[] {
  const blocks: Block[] = [];
  const markerRegex = /^\s*\[(INTERACTIVE|VISUAL):\s*([^\]]+)\]\s*(.*?)$/gms;

  // Split by paragraph breaks first
  const paragraphs = body.split(/\n\n+/);
  let buffer: string[] = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    markerRegex.lastIndex = 0;
    const m = markerRegex.exec(trimmed);
    if (m) {
      // Flush buffered markdown
      if (buffer.length) {
        blocks.push({ type: "markdown", content: buffer.join("\n\n") });
        buffer = [];
      }
      const [, , typeRaw, descRaw] = m;
      blocks.push({
        type: "interaction",
        content: trimmed,
        interactionType: typeRaw.trim().toLowerCase(),
        description: descRaw.trim(),
      });
    } else {
      buffer.push(trimmed);
    }
  }
  if (buffer.length) {
    blocks.push({ type: "markdown", content: buffer.join("\n\n") });
  }
  return blocks;
}

export function InvestigationViewer({ slug }: Props) {
  const inv = investigationBySlug(slug);
  const closeInvestigation = useGameStore((s) => s.closeInvestigation);
  const markCompleted = useGameStore((s) => s.markCompleted);
  const completed = useGameStore((s) => s.completed);
  const openInvestigation = useGameStore((s) => s.openInvestigation);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset scroll on entering a new investigation
    containerRef.current?.scrollTo({ top: 0 });
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [slug]);

  // ESC closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeInvestigation();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeInvestigation]);

  const blocks = useMemo(() => (inv ? parseBody(inv.body) : []), [inv]);

  if (!inv) return null;

  const act = ACTS[inv.act - 1];
  const isComplete = completed.includes(inv.slug);
  const next = nextInvestigation(inv.slug);

  const handleComplete = () => {
    markCompleted(inv.slug);
    if (next) {
      openInvestigation(next);
    } else {
      closeInvestigation();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 ${act.bgClass} overflow-hidden`}
    >
      {/* Top bar */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-ink/80 border-b border-paper/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NoiroIcon size={32} />
            <div>
              <div
                className="font-mono text-[0.6rem] tracking-[0.3em]"
                style={{ color: act.accentColor }}
              >
                ACT {inv.act} · CASE {inv.number.toString().padStart(2, "0")}
              </div>
              <div className="font-serif italic text-sm text-paper/70">
                {inv.estimatedMinutes} min read
              </div>
            </div>
          </div>
          <button
            onClick={closeInvestigation}
            className="font-mono text-xs tracking-[0.2em] px-3 py-1.5 border border-paper/20 text-paper/70 hover:bg-paper/10 transition-colors rounded-sm"
          >
            ← MAP
          </button>
        </div>
      </header>

      {/* Body */}
      <div
        ref={containerRef}
        className="h-[calc(100vh-65px)] overflow-y-auto"
      >
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <div
              className="font-mono text-xs tracking-[0.4em] mb-3"
              style={{ color: act.accentColor }}
            >
              CASE #{inv.number.toString().padStart(2, "0")}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4 leading-tight">
              {inv.title}
            </h1>
            <p className="font-serif italic text-lg text-paper/60 max-w-xl mx-auto">
              {inv.tagline}
            </p>
          </motion.div>

          {/* Blocks */}
          <article className="noir-prose">
            {blocks.map((block, i) =>
              block.type === "interaction" ? (
                <InteractionMarker
                  key={i}
                  type={block.interactionType!}
                  description={block.description!}
                  accentColor={act.accentColor}
                />
              ) : (
                <ReactMarkdown
                  key={i}
                  remarkPlugins={[remarkGfm]}
                >
                  {block.content}
                </ReactMarkdown>
              ),
            )}
          </article>

          {/* Closing controls */}
          <div className="mt-16 pt-8 border-t border-paper/10 text-center">
            {isComplete ? (
              <div className="space-y-4">
                <div className="font-mono text-xs tracking-[0.3em] text-amber-glow/80">
                  ✓ CASE CLOSED
                </div>
                {next ? (
                  <button
                    onClick={() => openInvestigation(next)}
                    className="px-7 py-3 bg-amber-glow text-ink font-semibold tracking-wide hover:bg-amber-glow/90 transition-colors rounded-sm font-mono text-sm"
                  >
                    NEXT CASE →
                  </button>
                ) : (
                  <div>
                    <p className="font-serif italic text-paper/70 mb-4">
                      The Codex is closed. You've made it through every case.
                    </p>
                    <button
                      onClick={closeInvestigation}
                      className="px-7 py-3 bg-amber-glow text-ink font-semibold tracking-wide hover:bg-amber-glow/90 transition-colors rounded-sm font-mono text-sm"
                    >
                      RETURN TO MAP
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleComplete}
                className="px-7 py-3 bg-amber-glow text-ink font-semibold tracking-wide hover:bg-amber-glow/90 transition-colors rounded-sm font-mono text-sm"
              >
                CLOSE THE CASE {next ? "→ NEXT" : ""}
              </button>
            )}
          </div>

          <div className="h-32" />
        </div>
      </div>
    </motion.div>
  );
}
