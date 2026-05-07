import { useGameStore } from "./store/useGameStore";
import { IntroScreen } from "./components/IntroScreen";
import { MapView } from "./components/MapView";
import { SceneFlow } from "./components/SceneFlow";
import { CodexPanel } from "./components/CodexPanel";

export function App() {
  const hasSeenIntro = useGameStore((s) => s.hasSeenIntro);
  const currentInvestigation = useGameStore((s) => s.currentInvestigation);

  if (!hasSeenIntro) {
    return <IntroScreen />;
  }

  // Hide the heavy SVG map while a scene flow is open — keeps the page from
  // re-rasterizing two full-screen layers at once.
  if (currentInvestigation) {
    return (
      <div className="min-h-screen bg-ink text-paper">
        <CodexPanel />
        <SceneFlow key={currentInvestigation} slug={currentInvestigation} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-paper">
      <MapView />
      <CodexPanel />
    </div>
  );
}
