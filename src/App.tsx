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

export default function App() {
  const [level, setLevel] = useState(1);
  const [ghost, setGhost] = useState<GhostEntry[] | null>(null);
  const currentParagraph = paragraphs[level - 1];
  const [raceStarted, setRaceStarted] = useState(false);
  const [raceStartTime, setRaceStartTime] = useState<number | null>(null);
  const [results, setResults] = useState<("win" | "loss" | null)[]>(
    Array(10).fill(null)
  );

  const {
    typed,
    hasError,
    handleType,
    reset: resetTyping,
  } = useTyping(currentParagraph);

  const { ghostTypedBuffer, ghostEventBuffer, resetGhost } = useGhost(
    ghost,
    raceStarted
  );
  const { toast, showToast } = useToast();
  const { locked: raceLocked, lock: lockRace } = useLock();
  const typedCount = typed
    .split("")
    .filter((c, i) => c === currentParagraph[i]).length;
  const { userWpm, ghostWpm } = useWpm({
    typedCount,
    ghostBuffer: ghostEventBuffer,
    startTime: raceStartTime,
  });

  const {
    postRace,
    cooldownDone,
    beginPostRace,
    consumeKeyPress,
    endPostRace,
  } = usePostRace();

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
    stopRace: () => setRaceStarted(false),
    setRaceStartTime: () => setRaceStartTime(null),
    beginPostRace,
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-10 gap-6">
      <h1 className="text-4xl font-bold -mb-3">Race My WPM</h1>
      <h2 className="text-xl text-slate-400 mb-3">Feel free to select any level below; completion/winning not required</h2>
      <Toast toast={toast} />

      <LevelSelector
        level={level}
        results={results}
        onChange={(n) => {
          setLevel(n);
          resetGhost();
          resetTyping();
          setRaceStarted(false);
        }}
      />

      <GhostReplay level={level} onLoaded={setGhost} />
      <GhostParagraph
        paragraph={currentParagraph}
        ghostBuffer={ghostTypedBuffer}
      />

      <RaceBar
        paragraphLength={currentParagraph.length}
        typedLength={
          typed.split("").filter((c, i) => c === currentParagraph[i]).length
        }
        ghostIndex={ghostTypedBuffer.length}
        ghostLength={currentParagraph.length}
      />

      <div className="flex gap-6 text-lg font-semibold">
        <div className="text-green-400">Your WPM: {Math.round(userWpm)}</div>
        <div className="text-blue-400">My WPM: {Math.round(ghostWpm)}</div>
      </div>

      <UserParagraph
        paragraph={currentParagraph}
        typed={typed}
        hasError={hasError}
      />

      <LiveTyping
        value={typed}
        onChange={(v) => {
          if (postRace) {
            if (!cooldownDone) return;

            const action = consumeKeyPress();
            if (action === "reset-and-start") {
              if (results[level - 1] === "win") {
                if (level < 10) setLevel(level + 1);
              }

              resetTyping();
              resetGhost();
              setRaceStarted(false);
              setRaceStartTime(null);
              endPostRace();

              setRaceStartTime(performance.now());
              setRaceStarted(true);
              return;
            }

            return;
          }
          if (
            !raceLocked &&
            !raceStarted &&
            typed.length === 0 &&
            v.length > 0
          ) {
            setRaceStartTime(performance.now());
            setRaceStarted(true);
          }
          handleType(v);
        }}
      />
    </div>
  );
}
