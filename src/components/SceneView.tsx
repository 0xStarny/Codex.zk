import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Scene } from "../data/scenes";
import type { Investigation } from "../types";
import { InteractionRouter } from "./widgets/InteractionRouter";
import { CodexCardReveal } from "./CodexCardReveal";

interface Props {
  scene: Scene;
  inv: Investigation;
  accentColor: string;
}

export function SceneView({ scene, inv, accentColor }: Props) {
  if (scene.kind === "codex") {
    return <CodexCardReveal inv={inv} accentColor={accentColor} />;
  }

  if (scene.kind === "code" && scene.code) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
        className="max-w-3xl mx-auto"
      >
        <div
          className="font-mono text-xs tracking-[0.4em] mb-2"
          style={{ color: accentColor }}
        >
          THE RECEIPT
        </div>
        <h2 className="font-serif text-3xl mb-5">A look at the code.</h2>
        <div
          className="rounded-md border-2 overflow-hidden"
          style={{ borderColor: `${accentColor}66` }}
        >
          <div
            className="px-4 py-2 font-mono text-[0.7rem] tracking-[0.2em] uppercase"
            style={{ background: `${accentColor}25`, color: accentColor }}
          >
            {scene.code.language || "code"}
          </div>
          <pre
            className="p-5 overflow-x-auto text-sm leading-relaxed"
            style={{ background: "#0a0a0c" }}
          >
            <code className="text-paper/90 whitespace-pre">{scene.code.source}</code>
          </pre>
        </div>
        <p className="text-sm italic text-paper/70 mt-4 leading-relaxed">
          {scene.code.annotation}
        </p>
      </motion.div>
    );
  }

  // Hook / Beat / Reveal — same shape, different framing.
  const isHook = scene.kind === "hook";
  const isReveal = scene.kind === "reveal";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto"
    >
      <div
        className="font-mono text-[0.7rem] tracking-[0.4em] mb-3"
        style={{ color: accentColor }}
      >
        {isHook
          ? "THE HOOK"
          : isReveal
            ? "REVEAL"
            : scene.heading.toUpperCase().replace(/^BEAT\s*/, "BEAT · ")}
      </div>

      <h2
        className={`font-serif font-semibold leading-tight mb-6 ${
          isHook || isReveal ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"
        }`}
      >
        {isHook
          ? inv.title
          : isReveal
            ? "What we just learned."
            : scene.heading.replace(/^Beat\s*\d+\s*[—-]\s*/, "")}
      </h2>

      {isHook && (
        <p className="font-serif italic text-xl text-paper/65 mb-8">
          {inv.tagline}
        </p>
      )}

      <article className="noir-prose noir-prose-scene">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{scene.body}</ReactMarkdown>
      </article>

      {scene.markers.length > 0 && (
        <div className="mt-8 space-y-6">
          {scene.markers.map((m, i) => (
            <InteractionRouter
              key={i}
              marker={m}
              accentColor={accentColor}
              investigationSlug={inv.slug}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
