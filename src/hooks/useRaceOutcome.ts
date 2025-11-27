import { useEffect } from "react";
import { type ToastType } from "./useToast";

interface RaceOutcomeArgs {
  typed: string;
  ghostBuffer: any[];
  paragraph: string;
  raceStarted: boolean;
  level: number;
  results: ("win" | "loss" | null)[];
  setResults: (r: ("win" | "loss" | null)[]) => void;
  onOutcome: (type: ToastType) => void;
  onNextLevel: () => void;
  resetTyping: () => void;
  stopRace: () => void;
  setRaceStartTime: () => void;
  beginPostRace: () => void;
}

export function useRaceOutcome({
  typed,
  ghostBuffer: ghostTypedBuffer,
  paragraph,
  raceStarted,
  level,
  results,
  setResults,
  onOutcome,
  stopRace,
  beginPostRace,
  setRaceStartTime,
}: RaceOutcomeArgs) {
  const userFinished = typed.length === paragraph.length;
  const ghostFinished = ghostTypedBuffer.length === paragraph.length;

  // Loss condition
  useEffect(() => {
    if (!raceStarted) return;

    if (ghostFinished && !userFinished) {
      const updated = [...results];
      updated[level - 1] = "loss";
      setResults(updated);

      onOutcome("loss");
      beginPostRace();
      stopRace();
      setRaceStartTime();
    }
  }, [ghostTypedBuffer]);

  // Win condition
  useEffect(() => {
    if (!raceStarted) return;

    if (userFinished && !ghostFinished) {
      const updated = [...results];
      updated[level - 1] = "win";
      setResults(updated);

      onOutcome("win");
      beginPostRace();
      stopRace();
      setRaceStartTime();
    }
  }, [typed]);
}
