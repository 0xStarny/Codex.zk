# Codex.zk

> The case for programmable on-chain privacy. Twenty-two cases. One detective.
> No prior knowledge required.

Codex.zk is a gamified, interactive web experience that explains *why* the
[Aztec Network](https://aztec.network/) and the
[Noir](https://noir-lang.org/) language matter, what problems they solve,
and what futures they unlock — through an investigation-driven narrative
hosted by **Noiro**, a masked detective.

It is **not** a coding tutorial. It is a conviction-builder for newcomers,
analysts, journalists, and developers who want a structured grasp of the
*why* before reading docs.

---

## What's inside

```
codex-zk/
├── content/              ← 22 investigations as Markdown/MDX (the "Writers' Bible")
│   ├── act-01-the-problem/
│   ├── act-02-the-breakthrough/
│   ├── act-03-aztec-the-hidden-city/
│   ├── act-04-the-applications/
│   └── act-05-the-projection/
├── docs/
│   ├── superpowers/specs/  ← full design specification
│   ├── style-guide.md      ← Noiro's voice + tonal rules
│   └── content-template.md ← per-investigation template
├── src/                  ← the React application (Phase 2 — the game)
└── public/               ← static assets
```

The 22 cases are organised in five acts:

1. **The Problem** — public ledgers leak; mixers didn't fix it; the surveillance premium; the compliance trap.
2. **The Breakthrough** — zero-knowledge proofs (intuitive); zk-SNARKs; recursion; ZK vs the alternatives.
3. **Aztec, the Hidden City** — hybrid public/private state; Noir as a portable DSL; native account abstraction; comparison with the field; anatomy of an Aztec transaction.
4. **The Applications** — private DeFi, self-sovereign ID, honest voting, compliance without surveillance, hidden-information games.
5. **The Projection** — ZKML, the privacy-by-default web, the selective-disclosure economy, honest open questions.

Each investigation contains a Noiro-voiced narrative, interaction markers,
a collectible **Codex Card**, and an optional Noir/Solidity code snippet.

---

## Tech stack

- **Vite 5** + **React 18** + **TypeScript**
- **Tailwind CSS** for styling, **Framer Motion** for animations
- **Zustand** + `localStorage` for progression state
- Custom MDX-ish loader (no external frontmatter dependency)

No backend. No auth. No wallet integration. Pure static frontend.

---

## Run locally

```bash
cd codex-zk
npm install
npm run dev
# → http://localhost:5173
```

Build:

```bash
npm run build
npm run preview
```

---

## Status

**Phase 1 — content writing:** complete. All 22 investigations drafted,
following the style guide.

**Phase 2 — game build:** complete. Intro screen, map of pyramids, scrollytelling
investigation viewer, Codex collectibles panel, persistence, per-act color
palettes, locking/unlocking flow.

**Phase 3 — polish (future):** richer interaction widgets (currently placeholders),
audio narration, mobile UX pass, custom Noiro illustrations per act, share
cards on case completion.

---

## Credits

Content based on official Aztec and Noir documentation:

- https://aztec.network/
- https://aztec.network/developers
- https://noir-lang.org/
- https://noir-lang.org/docs/

The narrative voice and structure are original to this project.

---

## Licence

MIT. Use it, fork it, translate it, build on it.
