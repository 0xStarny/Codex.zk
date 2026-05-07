# Codex.zk — Design Specification

**Date:** 2026-05-07
**Status:** Approved by user, in execution
**Owner:** b.larbalestrier@gmail.com

---

## 1. Elevator Pitch

**Codex.zk** is a gamified, interactive web experience that teaches non-technical newcomers *why* the Aztec blockchain and the Noir language exist, what problems they solve, and what futures they unlock. It does **not** teach how to write code. It teaches conviction — through investigation, narrative, and visual interaction.

The protagonist, **Noiro**, is a masked detective who guides the user through 22 cases (organized in 5 acts) that progressively reveal the case for programmable on-chain privacy.

---

## 2. Audience

- **Primary:** complete crypto/blockchain newcomers ("néophytes") with zero technical background
- **Secondary:** developers from other ecosystems (Solidity, traditional web) who want a fast, intuitive grasp of *why* Aztec/Noir matter before reading docs
- **Tertiary:** investors, journalists, policymakers wanting a digestible explainer

The site assumes nothing. No prior knowledge of blockchain, cryptography, or zero-knowledge proofs is required.

---

## 3. Identity

- **Name:** Codex.zk
- **Mascot:** Noiro — a masked detective. Hardboiled noir aesthetic (trench coat, fedora, mask over the eyes) but designed cute/approachable, not menacing.
- **Tagline (working):** *"The case for private blockchains. One clue at a time."*
- **Domain (suggested):** codex.zk (TLD pending) — fallback codexzk.io / codexzk.app

---

## 4. Core Mechanic — Map of Investigations

The home screen is a stylized **map of Aztec cities**. Each city contains a **pyramid** representing one investigation. Pyramids start in fog/darkness and light up as the user solves cases.

Progression rules:
1. Only the first pyramid (Act I, Investigation 1) is unlocked at start.
2. Solving an investigation lights it up and reveals a path to the next.
3. Within an act, pyramids may be unlocked in order; acts unlock sequentially.
4. The center of the map houses **the Great Pyramid** — the final synthesis (Act V Investigation 22, "Open Questions").
5. Each act has its own visual region (color palette, ambient style):
   - **Act I — The Problem:** noir-urban, monochrome, rain
   - **Act II — The Breakthrough:** mystic, gold, temple-light
   - **Act III — Aztec, the Hidden City:** vibrant jungle, turquoise, glyphs
   - **Act IV — The Applications:** modern cosmopolitan, pastel
   - **Act V — The Projection:** futuristic, neon, sci-fi

A persistent **Codex** (sidebar or modal) collects "Codex Cards" — concept summaries earned upon solving each investigation. Like a Pokédex of ideas.

---

## 5. Curriculum (5 Acts × ~4-5 investigations = 22 total)

### Act I — The Problem (4 investigations)
1. The Glass House — every Ethereum tx is public
2. The Failed Cloak — why mixers (Tornado, etc.) didn't solve it
3. The Surveillance Premium — chain analytics, MEV, front-running
4. The Compliance Trap — privacy vs. KYC: a false dichotomy?

### Act II — The Breakthrough (4 investigations)
5. The Magic Door — ZK proofs, intuitively
6. Three Letters: SNARK — succinct, non-interactive, what each property unlocks
7. The Recursion Trick — recursive proofs and scalability
8. ZK vs. The Alternatives — TEE, MPC, FHE: why ZK wins on-chain

### Act III — Aztec, the Hidden City (5 investigations)
9. Public + Private = Hybrid — Aztec's dual state model
10. Noir, the Universal Language — why a new DSL, why not Solidity/Cairo
11. Native Account Abstraction — every account is a contract
12. Aztec vs. The Field — comparison with zkSync, Polygon zkEVM, Starknet, Mina
13. Inside an Aztec Tx — anatomy of a private transaction

### Act IV — The Applications (5 investigations)
14. Private DeFi — lending/trading without doxxing
15. The Self-Sovereign ID — proving without revealing
16. The Honest Vote — DAO governance without whale intimidation
17. Compliance, Without Surveillance — selective disclosure, proof-of-innocence
18. Hidden-Information Games — poker, fog-of-war, sealed-bid auctions

### Act V — The Projection (4 investigations)
19. ZKML & Verifiable AI
20. The Privacy-by-Default Web
21. The Selective-Disclosure Economy
22. Open Questions — the unsolved tradeoffs (regulation, UX, prover costs)

---

## 6. Narrative Tone — "Detective framing, serious content"

The narrative wrapper is film-noir-detective: Noiro speaks in dialogue, with stage directions in italics, like a hardboiled investigator. The content itself is **factually precise and technically accurate** — no metaphor at the expense of clarity.

**Sample beat (Act I, Investigation 1):**
> *Noiro taps the screen.* "First clue. Every transaction you've ever made on Ethereum is sitting on Etherscan, in full daylight — balance, swaps, every protocol you touched. Not a bug. That's the system." *He shrugs.* "The real question is the one nobody's asking: why did we ever think that was fine?"

**Voice rules:**
- Noiro addresses the reader as "kid" or directly ("you").
- Italics for stage directions (`*Noiro taps the screen.*`).
- Plain text for dialogue.
- Detective lexicon: case, clue, lead, evidence, witness, alibi, trail, file.
- Avoid: heavy parody, period-appropriate slang ("doll", "dame"), gratuitous metaphors.
- Prioritize: clarity > cleverness. If a metaphor obscures, drop it.

A full **style guide** lives at `codex-zk/docs/style-guide.md`.

---

## 7. Two-Phase Build

### **Phase 1 — The Writers' Bible** *(in progress)*

Write all 22 investigations as MDX-ready Markdown files following a strict template. Each file contains:

- Frontmatter (act, number, title, tagline, prerequisites, estimated time)
- Hook (Noiro's opening, prose, final form)
- Investigation beats (numbered narrative steps with prose + interaction markers)
- Reveal/Synthesis (the lesson, prose, final form)
- Codex Card (3-sentence concept summary, collectible)
- Optional Noir code snippet (5–15 lines, with annotation)

Interaction markers use the syntax:
```
[INTERACTIVE: <type>] <description>
[VISUAL: <type>] <description>
```

These are placeholders that the Phase 2 build will turn into actual React components.

### **Phase 2 — The Game**

Tech stack:
- **Vite + React 18 + TypeScript**
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **MDX** for investigation content (Markdown + JSX)
- **Zustand** for state (progression, codex)
- **localStorage** for persistence (no auth, no backend, no wallet for V1)

Components built:
- `MapScreen` — the cartographic home with pyramids
- `InvestigationViewer` — scrollytelling reader for each MDX file
- `CodexPanel` — collectible cards browser
- Interaction widget library: `SideBySide`, `RevealCard`, `Quiz`, `Sequence`, `BeforeAfter`, `Tooltip`, `Glossary`, `CodeShowcase`

V1 ships as a **fully static web app** — no server, no auth, no analytics beyond a basic counter.

---

## 8. Repository Structure

```
codex-zk/
├── content/
│   ├── act-01-the-problem/
│   │   ├── 01-the-glass-house.mdx
│   │   ├── 02-the-failed-cloak.mdx
│   │   ├── 03-the-surveillance-premium.mdx
│   │   └── 04-the-compliance-trap.mdx
│   ├── act-02-the-breakthrough/
│   ├── act-03-aztec-the-hidden-city/
│   ├── act-04-the-applications/
│   └── act-05-the-projection/
├── docs/
│   ├── style-guide.md
│   ├── content-template.md
│   └── superpowers/specs/
│       └── 2026-05-07-codex-zk-design.md  ← this file
├── public/                ← Phase 2: assets (mascot SVG, map, fonts)
├── src/                   ← Phase 2: React app
└── package.json           ← Phase 2
```

---

## 9. Success Criteria

A V1 success is:

1. **Content quality:** a non-technical reader can finish all 22 investigations and explain (in their own words) what Aztec is, what Noir is, why ZK matters, and at least 3 concrete applications.
2. **Engagement:** average user completes ≥1 full Act before leaving on first session.
3. **Aesthetic:** the experience feels designed (not a generic Bootstrap site). The detective framing is consistent.
4. **Performance:** loads in <2s on mid-tier mobile, runs at 60fps on the map screen.
5. **Shareability:** each act ends with a "share your progress" hook (screenshotable).

---

## 10. Out of Scope (V1)

- Code editor / live Noir compiler
- Wallet connection / on-chain integrations
- User accounts, server-side storage, social features
- Multi-language (FR, ES, etc.) — English only V1
- Mobile-native app — responsive web only
- Audio narration of Noiro's lines (text only V1; explored in V2)

---

## 11. Open Questions for V2+

- Audio narration with a noir-voice TTS or hired actor?
- Wallet-based progression that issues an on-chain "Codex Master" SBT?
- Localization (FR first, given creator's audience)
- Community submissions of new investigations
- Companion print / PDF "field manual" version

---

## 12. Risks

| Risk | Mitigation |
|------|------------|
| Content goes stale (Aztec/Noir evolve fast) | Versioned content; date each investigation; revisit quarterly |
| Tone drifts across 22 investigations | Strict style guide, single author, periodic re-reads |
| Phase 2 game complexity balloons | Strict widget library, MDX-driven content, no per-investigation custom code |
| Technical inaccuracies | Cross-check with official Aztec/Noir docs at https://docs.aztec.network/ and https://noir-lang.org/docs/ before each act ships |

---

*End of spec.*
