import { useState } from "react";
import LiveTyping from "./components/LiveTyping";
import LevelSelector from "./components/LevelSelector";
import GhostReplay from "./components/GhostReplay";
import UserParagraph from "./components/UserParagraph";
import GhostParagraph from "./components/GhostParagraph";
import useTyping from "./hooks/useTyping";
import useGhost from "./hooks/useGhost";
import { paragraphs } from "./data/paragraphs";
import { type GhostEntry } from "./types/GhostEntry";
import RaceBar from "./components/RaceBar";
import { useToast } from "./hooks/useToast";
import { useRaceOutcome } from "./hooks/useRaceOutcome";
import Toast from "./components/UI/Toast";
import { useLock } from "./hooks/useLock";
import { useWpm } from "./hooks/useWpm";
import { usePostRace } from "./hooks/usePostRace";
import WpmDisplay from "./components/WpmDisplay";
import { useRaceLifecycle } from "./hooks/useRaceLifecycle";

export default function App() {
  const [level, setLevel] = useState(1);
  const [ghost, setGhost] = useState<GhostEntry[] | null>(null);
  const currentParagraph = paragraphs[level - 1];
  const [raceStartTime, setRaceStartTime] = useState<number | null>(null);
  const [results, setResults] = useState<("win" | "loss" | null)[]>(
    Array(10).fill(null)
  );

  const {
    typed,
    hasError,
    handleType,
    reset: resetTyping,
    correctCount,
  } = useTyping(currentParagraph);

  const { toast, showToast, hideToast } = useToast();
  const { locked: raceLocked, lock: lockRace } = useLock();

  const {
    postRace,
    cooldownDone,
    beginPostRace,
    consumeKeyPress,
    endPostRace,
  } = usePostRace();

  const {
    ghostTypedBuffer,
    ghostEventBuffer,
    resetGhost,
    startGhost,
    stopGhost,
  } = useGhost(ghost);

  const {
    raceStarted,
    handleStartCondition,
    handlePostRaceKey,
    forceResetRace,
    stopRace,
  } = useRaceLifecycle({
    startGhost,
    stopGhost,
    resetTyping,
    resetGhost,
    endPostRace,
    hideToast,
    results,
    level,
    setLevel,
    setRaceStartTime,
    cooldownDone,
    consumeKeyPress,
    postRace,
  });

  const { userWpm, ghostWpm } = useWpm({
    typedCount: correctCount,
    ghostBuffer: ghostEventBuffer,
    startTime: raceStartTime,
  });

  useRaceOutcome({
    typed,
    ghostBuffer: ghostTypedBuffer,
    paragraph: currentParagraph,
    raceStarted,
    level,
    results,
    setResults,
    onOutcome: (type) => {
      showToast(
        type,
        type === "win"
          ? "You Won! Press any key to continue…"
          : "You Lost! Press any key to retry…"
      );
      lockRace();
    },
    onNextLevel: () => {
      if (level < 10) setLevel(level + 1);
    },
    resetTyping,
    stopRace,
    setRaceStartTime: () => setRaceStartTime(null),
    beginPostRace,
  });

  const handleTypingChange = (v: string) => {
    if (postRace) {
      handlePostRaceKey();
      return;
    }

    handleStartCondition(v, raceLocked);
    handleType(v);
  };

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
        onChange={(n) => {
          setLevel(n);
          forceResetRace();
        }}
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

      <div
        className={`
    fixed inset-0 flex items-center justify-center 
    pointer-events-none transition-opacity duration-300
    ${postRace ? "opacity-100" : "opacity-0"}
  `}
      >
        {postRace && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`
        w-[5000px] h-[2000px]
        rounded-full
        opacity-35
        transition-opacity duration-500
        mask-radial-fade
        ${results[level - 1] === "win" ? "bg-green-500/15" : "bg-red-500/15"}
      `}
            />
          </div>
        )}
      </div>
    </div>
  );
}
