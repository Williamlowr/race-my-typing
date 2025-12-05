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

// Define the RaceResult types for use in this hook
type RaceResult = "win" | "loss" | null;

// Export the RaceState type for use in other parts of the application; RaceState is the combination of all race variables created at the end of useEngine
export type RaceState = ReturnType<typeof useEngine>["raceState"];

// Main hook
export function useEngine() {
  // State variables
  // Level starts at 1
  const [level, setLevel] = useState(1);
  const [ghost, setGhost] = useState<GhostEntry[] | null>(null);
  const [raceStartTime, setRaceStartTime] = useState<number | null>(null);
  // Results for all 10 levels
  const [results, setResults] = useState<RaceResult[]>(Array(10).fill(null));

  // Current paragraph based on level
  const currentParagraph = paragraphs[level - 1];

  // Typing state and handlers
  const {
    typed,
    hasError,
    handleType,
    reset: resetTyping,
    correctCount,
  } = useTyping(currentParagraph);

  // Toast and lock hooks
  const { toast, showToast, hideToast } = useToast();
  const { locked: raceLocked, lock: lockRace } = useLock();

  // Post race hook
  const {
    postRace,
    cooldownDone,
    beginPostRace,
    consumeKeyPress,
    endPostRace,
  } = usePostRace();

  // Ghost hook
  const {
    ghostTypedBuffer,
    ghostEventBuffer,
    resetGhost,
    startGhost,
    stopGhost,
  } = useGhost(ghost);

  // Race lifecycle hook, used to manage race state transitions
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

  // WPM calculation hook
  const { userWpm, ghostWpm } = useWpm({
    typedCount: correctCount,
    ghostBuffer: ghostEventBuffer,
    startTime: raceStartTime,
  });

  // Race outcome hook
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
        // Display different messages based on win/loss
        type === "win"
          ? "You Won! Press any key to continue…"
          : "You Lost! Press any key to retry…"
      );
      lockRace();
    },
    // Advance to next level on win, up to level 10
    onNextLevel: () => {
      if (level < 10) setLevel(level + 1);
    },
    resetTyping,
    stopRace,
    setRaceStartTime: () => setRaceStartTime(null),
    beginPostRace,
  });

  // Handlers for typing changes and level changes
  const handleTypingChange = (v: string) => {
    if (postRace) {
      handlePostRaceKey();
      return;
    }

    handleStartCondition(v, raceLocked);
    handleType(v);
  };

  // Handler for level changes
  const handleLevelChange = (n: number) => {
    setLevel(n);
    forceResetRace();
  };

  // Combine all race variables into a single object for easier access in other hooks/components
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
