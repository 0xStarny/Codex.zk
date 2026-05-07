import type { Investigation } from "../types";

export type SceneKind =
  | "hook"
  | "beat"
  | "reveal"
  | "codex"
  | "code";

export interface InteractionMarker {
  category: "INTERACTIVE" | "VISUAL";
  type: string;
  description: string;
}

export interface Scene {
  kind: SceneKind;
  /** Heading visible on the scene (e.g. "Beat 3 — A Day In The Life Of A Public Wallet") */
  heading: string;
  /** Body markdown for the scene (excluding interaction markers) */
  body: string;
  /** Interaction markers attached to this scene, in source order */
  markers: InteractionMarker[];
  /** Optional: code snippet for `code` scenes */
  code?: { language: string; source: string; annotation: string };
}

const MARKER_RE = /\[(INTERACTIVE|VISUAL):\s*([^\]]+)\]\s*([^\n]*(?:\n(?!\n).*)*)/g;

/**
 * Splits an investigation's markdown body into a sequence of game scenes:
 * Hook → Beat 1 → Beat 2 ... → Reveal → Codex Card → (optional) Code.
 * Each H2 in the source becomes its own scene; interaction markers are
 * attached to the scene they appear inside.
 */
export function parseScenes(inv: Investigation): Scene[] {
  const sections = splitByH2(inv.body);
  const scenes: Scene[] = [];

  for (const sec of sections) {
    const heading = sec.heading.trim();
    const lower = heading.toLowerCase();

    if (lower === "hook") {
      const { body, markers } = extractMarkers(sec.body);
      scenes.push({ kind: "hook", heading: "Hook", body, markers });
    } else if (lower === "reveal") {
      const { body, markers } = extractMarkers(sec.body);
      scenes.push({ kind: "reveal", heading: "Reveal", body, markers });
    } else if (lower === "codex card") {
      // Skip — we render the codex card from the structured frontmatter, not the markdown.
      continue;
    } else if (lower.startsWith("code")) {
      const code = extractCode(sec.body);
      if (code) {
        scenes.push({
          kind: "code",
          heading: "The Receipt",
          body: "",
          markers: [],
          code,
        });
      }
    } else {
      // Beat
      const { body, markers } = extractMarkers(sec.body);
      scenes.push({ kind: "beat", heading, body, markers });
    }
  }

  // Always end with the codex-card "earned" scene before any code scene.
  const codexScene: Scene = {
    kind: "codex",
    heading: "Codex Card Earned",
    body: "",
    markers: [],
  };
  // Insert codex BEFORE code (if any), AFTER reveal.
  const codeIdx = scenes.findIndex((s) => s.kind === "code");
  if (codeIdx >= 0) {
    scenes.splice(codeIdx, 0, codexScene);
  } else {
    scenes.push(codexScene);
  }

  return scenes;
}

function splitByH2(body: string): { heading: string; body: string }[] {
  const lines = body.split("\n");
  const sections: { heading: string; body: string }[] = [];
  let curHeading: string | null = null;
  let curLines: string[] = [];

  const flush = () => {
    if (curHeading !== null) {
      sections.push({ heading: curHeading, body: curLines.join("\n").trim() });
    }
  };

  for (const line of lines) {
    const m = /^##\s+(.+)$/.exec(line);
    if (m) {
      flush();
      curHeading = m[1].trim();
      curLines = [];
    } else {
      curLines.push(line);
    }
  }
  flush();
  return sections;
}

function extractMarkers(text: string): { body: string; markers: InteractionMarker[] } {
  const markers: InteractionMarker[] = [];
  // Match marker paragraphs (paragraph that starts with [INTERACTIVE:...] or [VISUAL:...])
  // and extract them, leaving the rest of the prose as body.
  const paragraphs = text.split(/\n\n+/);
  const body: string[] = [];
  for (const p of paragraphs) {
    const trimmed = p.trim();
    const m = /^\[(INTERACTIVE|VISUAL):\s*([^\]]+)\]\s*([\s\S]*)$/.exec(trimmed);
    if (m) {
      const [, category, type, desc] = m;
      markers.push({
        category: category as "INTERACTIVE" | "VISUAL",
        type: type.trim().toLowerCase(),
        description: desc.trim(),
      });
    } else if (trimmed) {
      body.push(trimmed);
    }
  }
  return { body: body.join("\n\n"), markers };
}

function extractCode(text: string): { language: string; source: string; annotation: string } | undefined {
  const fence = /```([a-zA-Z0-9_+\-]*)\n([\s\S]*?)\n```/.exec(text);
  if (!fence) return undefined;
  const [, language, source] = fence;
  const after = text.slice(fence.index + fence[0].length).trim();
  // Annotation typically starts with "*Annotation: ...*" — strip the wrapping italic markers.
  const annotation = after
    .replace(/^\*+\s*(Annotation:)?\s*/i, "")
    .replace(/\*+\s*$/, "")
    .trim();
  return { language: language || "rust", source: source.trim(), annotation };
}

/** Suppresses MARKER_RE TS unused warnings */
export const _markerRe = MARKER_RE;
