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

export default function App() {
  const [level, setLevel] = useState(1);
  const [ghost, setGhost] = useState<GhostEntry[] | null>(null);
  const currentParagraph = paragraphs[level - 1];
  const [raceStarted, setRaceStarted] = useState(false);

  const {
    typed,
    hasError,
    handleType,
    reset: resetTyping,
  } = useTyping(currentParagraph, () => {
    if (level < 10) {
      setLevel(level + 1);
      resetTyping();
      setRaceStarted(false);
    }
  });

  const { ghostBuffer } = useGhost(ghost, raceStarted);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-10 gap-6">
      <h1 className="text-4xl font-bold mb-4">Race Me</h1>

      <LevelSelector
        level={level}
        onChange={(n) => {
          setLevel(n);
          setGhost(null);
          resetTyping();
          setRaceStarted(false);
        }}
      />

      <GhostReplay level={level} onLoaded={setGhost} />

      <RaceBar
        paragraphLength={currentParagraph.length}
        typedLength={
          typed.split("").filter((c, i) => c === currentParagraph[i]).length
        }
        ghostIndex={ghostBuffer.length}
        ghostLength={currentParagraph.length}
      />

      <GhostParagraph paragraph={currentParagraph} ghostBuffer={ghostBuffer} />

      <UserParagraph
        paragraph={currentParagraph}
        typed={typed}
        hasError={hasError}
      />

      <LiveTyping
        value={typed}
        onChange={(v) => {
          if (!raceStarted && typed.length === 0 && v.length > 0) {
            console.log("Race starting!"); // Add this
            setRaceStarted(true);
          }
          handleType(v);
        }}
      />
    </div>
  );
}
