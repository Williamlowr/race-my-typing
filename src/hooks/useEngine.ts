import { useState } from "react";
import useTyping from "./useTyping";
import useGhost from "./useGhost";
import { paragraphs } from "../data/paragraphs";
import { type GhostEntry } from "../types/GhostEntry";
import { useToast } from "./useToast";
import { useRaceOutcome } from "./useRaceOutcome";
import { useLock } from "./useLock";
import { useWpm } from "./useWpm";
import { usePostRace } from "./usePostRace";
import { useRaceLifecycle } from "./useRaceLifecycle";

type RaceResult = "win" | "loss" | null;

export type RaceState = ReturnType<typeof useEngine>["raceState"];

export function useEngine() {
  const [level, setLevel] = useState(1);
  const [ghost, setGhost] = useState<GhostEntry[] | null>(null);
  const [raceStartTime, setRaceStartTime] = useState<number | null>(null);
  const [results, setResults] = useState<RaceResult[]>(Array(10).fill(null));

  const currentParagraph = paragraphs[level - 1];

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

  const handleLevelChange = (n: number) => {
    setLevel(n);
    forceResetRace();
  };

  const raceState = {
    level,
    currentParagraph,
    typed,
    hasError,
    correctCount,
    ghostTypedBuffer,
    ghostEventBuffer,
    userWpm,
    ghostWpm,
    postRace,
    results,
  };

  return {
    // state
    level,
    currentParagraph,
    ghost,
    results,
    postRace,
    toast,

    // race data
    raceState,
    typed,
    hasError,
    correctCount,
    ghostTypedBuffer,
    ghostEventBuffer,
    userWpm,
    ghostWpm,

    // handlers
    setGhost,
    handleTypingChange,
    handleLevelChange,
  };
}
