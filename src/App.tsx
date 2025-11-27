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

type RaceResult = "win" | "loss" | null;

export default function App() {
  const {
    level,
    currentParagraph,
    results,
    postRace,
    toast,
    typed,
    hasError,
    correctCount,
    ghostTypedBuffer,
    userWpm,
    ghostWpm,
    setGhost,
    handleTypingChange,
    handleLevelChange,
  } = useEngine();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-10 gap-6">
      <h1 className="text-4xl font-bold -mb-3">Race My WPM</h1>
      <h2 className="text-xl text-slate-400 mb-3">
        Feel free to select any level below; completion/winning not required
      </h2>

      <Toast toast={toast} />

      <LevelSelector
        level={level}
        results={results}
        onChange={handleLevelChange}
      />

      <GhostReplay level={level} onLoaded={setGhost} />

      <GhostParagraph
        paragraph={currentParagraph}
        ghostBuffer={ghostTypedBuffer}
      />

      <RaceBar
        paragraphLength={currentParagraph.length}
        typedLength={correctCount}
        ghostIndex={ghostTypedBuffer.length}
        ghostLength={currentParagraph.length}
      />

      <WpmDisplay user={userWpm} ghost={ghostWpm} />

      <UserParagraph
        paragraph={currentParagraph}
        typed={typed}
        hasError={hasError}
      />

      <LiveTyping value={typed} onChange={handleTypingChange} />

      <OutcomeOverlay
        visible={postRace}
        result={results[level - 1]}
      />
    </div>
  );
}
