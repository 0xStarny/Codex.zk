# Investigation Content Template

Copy this template for every new investigation `.mdx` file.

---

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

*Noiro flips open a damp folder. The light from the window cuts the table in half.*
"Take a seat, kid. You've been on Ethereum for a year now? Two? Doesn't matter."
*He taps a stack of Etherscan printouts.*
"Every move you ever made — every swap, every NFT, every protocol you touched — sitting right here. Stranger walks in off the street, asks, 'what does this wallet own?' — and the chain doesn't even hesitate to answer."
*He lights a cigarette.*
"That's the case. Not whether it's public. **Why we ever thought that was fine.**"

## Beat 1 — The Witness Who Talks Too Much

(Narrative paragraph. Maybe 100–200 words. End with a technical point: "Every Ethereum transaction is recorded permanently on a public ledger — your address, the receiver, the amount, the contract called.")

[INTERACTIVE: reveal] Click any field on a sample Etherscan-like row to see what it exposes. (Address → "linked to ENS name and other addresses." Amount → "exact balance changes visible." Contract → "Uniswap V3 swap 0.5 ETH → USDC.")

## Beat 2 — The Twist No One Mentions

(Why this matters. Permanence. Even after you "stop using" a wallet, the history is forever.)

## Beat 3 — A Day in the Life of a Public Wallet

[INTERACTIVE: simulator] User picks a fictional wallet ("Alice the part-time DJ"). The simulator shows what a stranger could deduce in 60 seconds: salary, employer, habits, location patterns.

## Beat 4 — "But… auditability is good, no?"

(Address the obvious counterargument honestly. Yes — and it's also why we're stuck. The chain was designed for one tradeoff. We never asked if there was a better one.)

## Reveal

*Noiro stubs out the cigarette.*
"Public, permanent, perfect for an auditor. Terrible for a tenant. Catastrophic for a teenager who'll be on this chain for the next sixty years."
*He slides the file back into the drawer.*
"This is the foundation of every other case we're going to work. Privacy isn't a feature — it's the missing primitive. The whole system was built without it. The next four cases are about every workaround we tried and why none of them stuck."
*He nods at the door.*
"Get some rest, kid. Tomorrow we look at the cloak that didn't fit."

## Codex Card

> **Public-by-default chains**
> Ethereum was designed so anyone, forever, can read any transaction.
> *Why it matters: it's a feature for auditability — and a flaw for everything else.*

## Code (optional)

```solidity
// On Ethereum, even reading "private state" requires it to live in a public contract.
// This balance is visible to anyone reading the chain.
contract Wallet {
    mapping(address => uint256) public balances;
    function withdraw(uint256 amount) public {
        balances[msg.sender] -= amount;  // public state change, broadcast forever.
        payable(msg.sender).transfer(amount);
    }
}
```

*Annotation: There's no `private` keyword that actually hides values from chain observers. "Private" in Solidity just means "other contracts can't call this function" — every byte of state is still visible to anyone reading the ledger.*
```

---

## Reminders

- Re-read the Hook out loud before submitting. If it doesn't sound like Noiro, rewrite.
- Run the Self-Review Checklist from `style-guide.md`.
- Cross-check technical claims against official docs.
