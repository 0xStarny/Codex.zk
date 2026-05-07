import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  description: string;
  accentColor: string;
  /** Optional category — controls which canned sequence is shown. */
  variant?: "wallet-stalk" | "cave-protocol" | "tx-flow" | "generic";
}

/**
 * Real interactive widget: a step-through animation. The user advances
 * one step at a time, watching state evolve. Useful for [INTERACTIVE: simulator]
 * and [INTERACTIVE: sequence] markers.
 */
export function SequenceStepper({ description, accentColor, variant = "generic" }: Props) {
  const steps = STEPS[variant];
  const [step, setStep] = useState(0);
  const done = step >= steps.length - 1;

  return (
    <div className="my-2">
      <p className="text-sm text-paper/70 mb-4 italic">{description}</p>
      <div
        className="rounded-md border-2 p-5 min-h-[180px]"
        style={{
          borderColor: accentColor,
          background: `linear-gradient(135deg, ${accentColor}15, transparent)`,
        }}
      >
        {/* Step indicators */}
        <div className="flex items-center gap-1.5 mb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-colors"
              style={{
                background: i <= step ? accentColor : `${accentColor}33`,
              }}
            />
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="font-mono text-[0.6rem] tracking-[0.3em] mb-1"
            style={{ color: accentColor }}
          >
            STEP {step + 1} / {steps.length}
          </div>
          <div className="font-serif italic text-lg mb-2">{steps[step].title}</div>
          <div className="text-sm text-paper/85 leading-relaxed">
            {steps[step].body}
          </div>
        </motion.div>

        <div className="flex justify-between mt-5 pt-3 border-t border-paper/10">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="font-mono text-xs tracking-[0.2em] px-3 py-1.5 rounded-sm hover:bg-paper/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: accentColor }}
          >
            ← BACK
          </button>
          {done ? (
            <span
              className="font-mono text-[0.7rem] tracking-[0.2em] py-1.5"
              style={{ color: accentColor }}
            >
              ✓ DEDUCED
            </span>
          ) : (
            <button
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
              className="font-mono text-xs tracking-[0.2em] px-4 py-1.5 rounded-sm transition-colors"
              style={{
                color: "#0a0a0c",
                background: accentColor,
              }}
            >
              NEXT CLUE →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const STEPS: Record<NonNullable<Props["variant"]>, { title: string; body: string }[]> = {
  "wallet-stalk": [
    {
      title: "Pick a wallet at random.",
      body: "The wallet `alice.eth` shows in Etherscan. Total value, $14,200 across three tokens. Three months of activity.",
    },
    {
      title: "Trace the inflows.",
      body: "Two recurring deposits of similar size, same day each month. Pattern: salary. Source address belongs to a known crypto-native employer.",
    },
    {
      title: "Cluster the outflows.",
      body: "Recurring transfers to a centralized exchange. KYC tier likely confirmed. A periodic transfer to another wallet, same amount each month — partner or rent.",
    },
    {
      title: "Cross-reference timestamps.",
      body: "Activity peaks between 09:00 and 23:00 UTC. Likely time zone: Western Europe. Quiet on weekends.",
    },
    {
      title: "Build the dossier.",
      body: "Salary, employer, region, off-ramp, recurring counterparty. Sixty seconds. No tools beyond a free block explorer. The chain didn't help. The chain is the dossier.",
    },
  ],
  "cave-protocol": [
    {
      title: "Round 1.",
      body: "I enter the cave. I take the left corridor. You shout: 'Come out the right.' I use the password to cross the magic door. I emerge from the right. You're 50% confident I know the password.",
    },
    {
      title: "Round 2.",
      body: "Same protocol. I emerge from whichever side you call. Your confidence climbs to 75%.",
    },
    {
      title: "Round 5.",
      body: "I've succeeded five times in a row. Random guessing would have failed at least once with 96% probability. You're 96.875% confident.",
    },
    {
      title: "Round 10.",
      body: "Confidence climbs to 99.9%. The chance I'm faking is one in 1,024.",
    },
    {
      title: "Round 20.",
      body: "Confidence is now 99.9999%. You still have no idea what the password is. That is a zero-knowledge proof.",
    },
  ],
  "tx-flow": [
    {
      title: "On Alice's device.",
      body: "Alice's wallet reads her encrypted notes locally. It picks two notes worth 75 + 30 = 105 pUSDC. None of this leaves the device.",
    },
    {
      title: "Build the proof.",
      body: "The wallet generates a ZK proof: 'I own those notes; I'm spending them; the new notes equal the old in value.' The chain will only see the proof.",
    },
    {
      title: "Broadcast.",
      body: "Alice's tx hits the public mempool. Observers see: a tx happened. They do NOT see who, what, or how much.",
    },
    {
      title: "Sequencer.",
      body: "A sequencer verifies Alice's proof, aggregates it with other users' proofs (recursively) into one block-level proof, runs any public-state effects, and posts to L1.",
    },
    {
      title: "Bob receives.",
      body: "Bob's device, scanning the chain, finds the encrypted note for him. He decrypts. His balance UI updates. The chain never knew it was Bob.",
    },
  ],
  generic: [
    { title: "Setup.", body: "We start with a public claim and a private piece of evidence." },
    { title: "Verify.", body: "Cryptography lets us check the claim without seeing the evidence." },
    { title: "Conclude.", body: "Statement true. Privacy intact. Compliance still possible." },
  ],
};
