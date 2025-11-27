import LiveTyping from "./components/LiveTyping";
import LevelSelector from "./components/LevelSelector";
import GhostReplay from "./components/GhostReplay";
import UserParagraph from "./components/UserParagraph";
import GhostParagraph from "./components/GhostParagraph";
import RaceBar from "./components/RaceBar";
import Toast from "./components/UI/Toast";
import WpmDisplay from "./components/WpmDisplay";
import { useEngine } from "./hooks/useEngine";
import OutcomeOverlay from "./components/UI/OutcomeOverlay";
import { useFocusGuard } from "./hooks/useFocusGuard";
import { useRef } from "react";

export default function App() {
  const { toast, setGhost, handleTypingChange, handleLevelChange, raceState } =
    useEngine();

  const typingRef = useRef<HTMLTextAreaElement | null>(null);
  useFocusGuard(typingRef);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-10 gap-6">
      <h1 className="text-4xl font-bold -mb-3">Race My WPM</h1>
      <h2 className="text-xl text-slate-400 mb-3">
        Feel free to select any level below; completion/winning not required
      </h2>

      <Toast toast={toast} />

      <LevelSelector
        level={raceState.level}
        results={raceState.results}
        onChange={handleLevelChange}
      />

      <GhostReplay level={raceState.level} onLoaded={setGhost} />

      <div className="w-auto max-w-6xl flex flex-col gap-6">
        <GhostParagraph race={raceState} />

        <div className="self-stretch justify-items-center flex flex-col items-center">
          <RaceBar race={raceState} />
        </div>

        <UserParagraph race={raceState} />
      </div>

      <LiveTyping
        ref={typingRef}
        value={raceState.typed}
        onChange={handleTypingChange}
      />

      <WpmDisplay race={raceState} />

      <OutcomeOverlay
        visible={raceState.postRace}
        result={raceState.results[raceState.level - 1]}
      />
    </div>
  );
}
