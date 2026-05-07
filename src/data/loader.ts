import type { Investigation, InvestigationFrontmatter } from "../types";

// Vite glob import: load all MDX files as raw strings at build time.
// Path is relative to this file: src/data/loader.ts -> ../../content/**/*.mdx
const mdxModules = import.meta.glob("../../content/**/*.mdx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

/**
 * Tiny YAML-ish frontmatter parser, scoped to the shape we control in
 * `content-template.md`. Supports:
 *  - top-level scalars: number, quoted string, empty array `[]`, array of quoted strings
 *  - one level of nested object (used for `codexCard`)
 */
function parseFrontmatter(raw: string): { data: InvestigationFrontmatter; body: string } {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Missing frontmatter block in MDX file.");
  }
  const [, fmBlock, body] = match;

  const data: Record<string, unknown> = {};
  let nestedKey: string | null = null;
  let nested: Record<string, unknown> = {};

  const lines = fmBlock.split("\n");
  for (const line of lines) {
    if (!line.trim()) continue;

    // Nested key line: starts with two spaces and contains a colon.
    if (line.startsWith("  ") && nestedKey) {
      const inner = line.slice(2);
      const colonIdx = inner.indexOf(":");
      if (colonIdx === -1) continue;
      const key = inner.slice(0, colonIdx).trim();
      const value = inner.slice(colonIdx + 1).trim();
      nested[key] = parseScalar(value);
      continue;
    }

    // Close out a nested block when we hit a non-indented line.
    if (nestedKey && !line.startsWith(" ")) {
      data[nestedKey] = nested;
      nestedKey = null;
      nested = {};
    }

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();

    if (value === "") {
      // Start of a nested object (e.g. `codexCard:`)
      nestedKey = key;
      nested = {};
    } else {
      data[key] = parseScalar(value);
    }
  }

  // Flush any pending nested block at end of frontmatter.
  if (nestedKey) {
    data[nestedKey] = nested;
  }

  return { data: data as unknown as InvestigationFrontmatter, body };
}

function parseScalar(value: string): unknown {
  // Empty array
  if (value === "[]") return [];
  // Inline array of strings: ["a","b"]
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map((s) => stripQuotes(s.trim()));
  }
  // Quoted string
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return stripQuotes(value);
  }
  // Number
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }
  // Boolean
  if (value === "true") return true;
  if (value === "false") return false;
  // Bare string
  return value;
}

function stripQuotes(s: string): string {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

export const investigations: Investigation[] = Object.entries(mdxModules)
  .map(([, raw]) => {
    const parsed = parseFrontmatter(raw);
    return {
      ...parsed.data,
      body: parsed.body,
    };
  })
  .sort((a, b) => a.number - b.number);

export const investigationBySlug = (slug: string): Investigation | undefined =>
  investigations.find((i) => i.slug === slug);

export const investigationsByAct = (act: number): Investigation[] =>
  investigations.filter((i) => i.act === act);
