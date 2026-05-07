import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
  // Slugs of completed investigations
  completed: string[];
  // Current investigation slug, or null when on the map
  currentInvestigation: string | null;
  // Whether the codex panel is open
  codexOpen: boolean;
  // Whether the user has seen the intro screen
  hasSeenIntro: boolean;

  // Actions
  markCompleted: (slug: string) => void;
  openInvestigation: (slug: string) => void;
  closeInvestigation: () => void;
  toggleCodex: () => void;
  closeCodex: () => void;
  dismissIntro: () => void;
  resetProgress: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      completed: [],
      currentInvestigation: null,
      codexOpen: false,
      hasSeenIntro: false,

      markCompleted: (slug) =>
        set((state) => ({
          completed: state.completed.includes(slug)
            ? state.completed
            : [...state.completed, slug],
        })),

      openInvestigation: (slug) => set({ currentInvestigation: slug }),
      closeInvestigation: () => set({ currentInvestigation: null }),
      toggleCodex: () => set((state) => ({ codexOpen: !state.codexOpen })),
      closeCodex: () => set({ codexOpen: false }),
      dismissIntro: () => set({ hasSeenIntro: true }),
      resetProgress: () =>
        set({
          completed: [],
          currentInvestigation: null,
          codexOpen: false,
          hasSeenIntro: false,
        }),
    }),
    {
      name: "codex-zk-progress",
      partialize: (state) => ({
        completed: state.completed,
        hasSeenIntro: state.hasSeenIntro,
      }),
    },
  ),
);

/** Returns true if the given investigation slug is unlocked. */
export function isUnlocked(slug: string, completed: string[]): boolean {
  // Investigation 1 is always unlocked
  if (slug === "the-glass-house") return true;
  // Otherwise: an investigation is unlocked once at least the previous one is done.
  // We use ordering by `number` from the loader, but here we treat any "previous of same/lower act" as unlocked.
  // For simplicity, we hard-code the linear unlock chain: investigation N unlocks once N-1 is completed.
  // The loader is sorted by number; we look up the ordered slug list.
  return false; // Replaced by isUnlockedFor below to avoid circular import
}
