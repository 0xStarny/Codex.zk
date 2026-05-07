export interface CodexCard {
  concept: string;
  oneLine: string;
  why: string;
}

export interface InvestigationFrontmatter {
  act: number;
  number: number;
  slug: string;
  title: string;
  tagline: string;
  estimatedMinutes: number;
  prerequisites: string[];
  codexCard: CodexCard;
}

export interface Investigation extends InvestigationFrontmatter {
  body: string;
}

export interface ActMeta {
  number: number;
  title: string;
  subtitle: string;
  bgClass: string;
  accentColor: string;
  description: string;
}

export const ACTS: ActMeta[] = [
  {
    number: 1,
    title: "The Problem",
    subtitle: "Why on-chain privacy matters",
    bgClass: "act-1-bg",
    accentColor: "#5b6471",
    description: "Public ledgers leak. Workarounds didn't work. The case for change.",
  },
  {
    number: 2,
    title: "The Breakthrough",
    subtitle: "Zero-knowledge proofs, demystified",
    bgClass: "act-2-bg",
    accentColor: "#d4a14a",
    description: "Prove a thing is true without revealing why. The math behind the magic.",
  },
  {
    number: 3,
    title: "Aztec, the Hidden City",
    subtitle: "The chain and its language",
    bgClass: "act-3-bg",
    accentColor: "#3aa987",
    description: "Hybrid state, Noir, native account abstraction. The architecture, mapped.",
  },
  {
    number: 4,
    title: "The Applications",
    subtitle: "What becomes possible",
    bgClass: "act-4-bg",
    accentColor: "#c75850",
    description: "DeFi, identity, voting, compliance, hidden-info games. Real use cases.",
  },
  {
    number: 5,
    title: "The Projection",
    subtitle: "Where this leads",
    bgClass: "act-5-bg",
    accentColor: "#9b5cff",
    description: "ZKML, privacy-by-default, the selective-disclosure economy. Honest unknowns.",
  },
];
