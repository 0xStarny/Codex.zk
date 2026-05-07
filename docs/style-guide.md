# Codex.zk — Style Guide

The single source of truth for Noiro's voice, the curriculum's tonal rules, and the conventions every investigation must follow.

---

## 1. Noiro's Voice

Noiro is a **masked detective**. Think *Chinatown* meets *Encyclopedia Brown*. Hardboiled but not parody. Patient with the reader. Cynical about the ecosystem, but never about the reader.

### He sounds like this:

> *Noiro sets the file down and leans back.* "Every wallet on Ethereum is a glass house, kid. You moved a thousand bucks last Tuesday — I can read it from here. The chain doesn't whisper. It announces."

### He does NOT sound like this:

> *(too parodic)* "Listen here, doll. The Mainnet's a dirty town. Down at the gas-pump dive bar, every wallet's spilled its guts to me — *capisce?*"

> *(too dry)* "Ethereum transactions are publicly visible by design. This is a fundamental property of permissionless blockchains."

The first nails the tone. Wraps a precise factual claim ("every wallet's history is public") in detective framing without losing the message.

---

## 2. The Five Voice Rules

1. **Address the reader directly** — "kid", "you", "look here". Never "the user", never "one might consider".
2. **Italics for stage directions, plain text for dialogue.**
   - `*Noiro flips open his notebook.*` — italics
   - `"Here's what we know."` — plain text
3. **Detective lexicon, sparingly.**
   - Use: case, clue, lead, evidence, witness, alibi, trail, file, scene, suspect, deduction, prints, the books.
   - Avoid: doll, dame, gat, gumshoe, chump, palooka, scram. Period slang dates the writing instantly.
4. **Cynicism toward the system, never the reader.**
   - ✅ "They called it 'transparency.' I called it a confession booth with the door kicked in."
   - ❌ "If you don't get this, you're not paying attention, kid."
5. **Clarity beats cleverness.**
   - If a noir metaphor obscures the technical point, drop the metaphor. The detective wrapper serves the content, not the other way around.

---

## 3. Content Rules (Beyond Voice)

### Be technically accurate
Cross-check against:
- Aztec docs: `https://docs.aztec.network/`
- Noir docs: `https://noir-lang.org/docs/`
- Aztec network site: `https://aztec.network/`
- Aztec governance / latest blog posts when relevant

If you're not sure, mark with `[FACT-CHECK]` and resolve before publish.

### Assume zero prior knowledge
- First time you mention any technical term, define it in plain English in the same sentence or the next.
- Use a `<Glossary>` widget for anything that might re-appear.
- If a concept needs more than 2 sentences to define, that's a sign it deserves its own beat.

### One concept per investigation
Each investigation has **one core idea**. Subordinate everything else to it. If you find a second important idea showing up, it's probably the next investigation.

### Length target
- ~1500–2200 words of prose per investigation.
- 5–8 beats per investigation.
- 1–4 interaction markers per investigation.
- Estimated reading/playing time: 5–10 minutes.

### Code snippets are wow-factor only
- Optional: 1 snippet per investigation, 5–15 lines, never required reading.
- Always with a 1-paragraph plain-English annotation.
- Goal: "look how clean this is" — not "study this".

---

## 4. Structural Template

Every investigation `.mdx` file follows this structure exactly:

```mdx
---
act: 1
number: 1
slug: "the-glass-house"
title: "The Glass House"
tagline: "Every transaction you've ever made on Ethereum is in plain sight."
estimatedMinutes: 7
prerequisites: []
codexCard:
  concept: "Public-by-default chains"
  oneLine: "Ethereum was designed so anyone, forever, can read any transaction."
  why: "It's a feature for auditability — but a flaw for everything else."
---

## Hook

(Noiro's opening, 80–150 words, sets the scene.)

## Beat 1 — <beat title>

(Narrative + technical point. Optionally one [INTERACTIVE: …] or [VISUAL: …] marker.)

## Beat 2 — …

…

## Reveal

(The synthesis. The payoff. 100–200 words.)

## Codex Card

> **<Concept name>**
> <One line.>
> *Why it matters: <one line>.*

## Code (optional)

```noir
// 5–15 lines of Noir, with a comment block annotating in plain English.
```
```

---

## 5. Interaction Marker Vocabulary

These are placeholders that Phase 2 will turn into React components.

```
[INTERACTIVE: side-by-side]    Two views compared (e.g. Etherscan vs Aztec Explorer).
[INTERACTIVE: reveal]          A "click to reveal" — hidden info disclosed on user action.
[INTERACTIVE: quiz]            Multiple choice. Wrong answers get explanatory feedback.
[INTERACTIVE: sequence]        Step-through animation the user advances manually.
[INTERACTIVE: before-after]    Slider between two states (e.g. before/after privacy).
[INTERACTIVE: simulator]       A small parameterized model the user can poke.
[VISUAL: diagram]              A static or animated illustration.
[VISUAL: animation]            A short looping animation (Lottie or CSS).
```

Each marker is followed by a one-line description of WHAT it should show. Phase 2 reads these and either implements them generically (`<SideBySide />`) or commissions a custom one.

---

## 6. The Five Act Palettes

When writing for an act, picture its visual world. Tone shifts subtly with the palette:

| Act | Palette | Mood | Noiro is… |
|-----|---------|------|-----------|
| I — The Problem | Monochrome, rain, neon signs | Cynical, weary | …on the streets, gathering evidence |
| II — The Breakthrough | Deep blue, gold, candlelight | Awed but skeptical | …in a library/temple, studying old books |
| III — Aztec | Turquoise, ochre, lush green | Excited, vindicated | …deep in the jungle, finding the hidden city |
| IV — The Applications | Pastel, modern, clean | Optimistic, demonstrative | …downtown, showing what people *do* with it |
| V — The Projection | Neon, navy, electric purple | Speculative, philosophical | …on a rooftop at night, looking at the future |

The acts share Noiro's core voice but the *energy* shifts. Act V is more reflective, Act III is more energetic.

---

## 7. Hard Don'ts

- ❌ No emoji in prose. (Codex cards or UI icons are fine.)
- ❌ No second-person plural ("you all"). Singular only.
- ❌ No "I" from Noiro for autobiography — he's a guide, not a memoirist.
- ❌ No actual prices, USD figures, or "the market is doing X". Dates the content instantly.
- ❌ No partisan crypto-tribalism ("Solidity sucks", "Ethereum is broken"). Critique systems, not tribes.
- ❌ No marketing buzzwords without unpacking ("revolutionary", "next-gen", "game-changing"). Noiro doesn't sell.

---

## 8. Self-Review Checklist (per investigation)

Before marking an investigation done, the author re-reads with this list:

- [ ] One core idea, clearly stated by the end?
- [ ] Every technical term defined on first use?
- [ ] Voice consistent with Noiro (re-read the Hook out loud)?
- [ ] Word count in 1500–2200 range?
- [ ] At least one interaction marker per investigation?
- [ ] Codex card: concept name, one-line, why-it-matters?
- [ ] No emoji in prose?
- [ ] No partisan tribalism?
- [ ] Cross-checked against official docs?
- [ ] Reads in 5–10 minutes?

---

*End of style guide. Update this file when conventions shift.*
