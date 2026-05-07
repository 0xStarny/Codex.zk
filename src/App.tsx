import { AnimatePresence } from "framer-motion";
import { useGameStore } from "./store/useGameStore";
import { IntroScreen } from "./components/IntroScreen";
import { MapScreen } from "./components/MapScreen";
import { InvestigationViewer } from "./components/InvestigationViewer";
import { CodexPanel } from "./components/CodexPanel";

export function App() {
  const hasSeenIntro = useGameStore((s) => s.hasSeenIntro);
  const currentInvestigation = useGameStore((s) => s.currentInvestigation);

  if (!hasSeenIntro) {
    return <IntroScreen />;
  }

  return (
    <div className="min-h-screen bg-ink text-paper">
      <MapScreen />
      <CodexPanel />
      <AnimatePresence mode="wait">
        {currentInvestigation && (
          <InvestigationViewer
            key={currentInvestigation}
            slug={currentInvestigation}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
