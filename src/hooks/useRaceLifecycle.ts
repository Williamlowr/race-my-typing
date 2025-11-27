import { useState } from "react";

interface Options {
  resetTyping: () => void;
  resetGhost: () => void;
  endPostRace: () => void;
  hideToast: () => void;
  results: ("win" | "loss" | null)[];
  level: number;
  setLevel: (n: number) => void;
  setRaceStartTime: (t: number | null) => void;
  cooldownDone: boolean;
  consumeKeyPress: () => "reset-and-start" | null;
  postRace: boolean;
  startGhost: () => void;
  stopGhost: () => void;
}

export function useRaceLifecycle({
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
  startGhost,
  stopGhost,
}: Options) {
  const [raceStarted, setRaceStarted] = useState(false);
  const [awaitingStart, setAwaitingStart] = useState(false);

  // Called by App when user types (pre-race)
  const handleStartCondition = (value: string, raceLocked: boolean) => {
    if (raceLocked) return;
    if (raceStarted || awaitingStart) return;
    if (value.length === 0) return;

    setAwaitingStart(false);
    setRaceStarted(true);
    startGhost();
    setRaceStartTime(performance.now());
  };

  // Called by App when we are in post-race mode
  const handlePostRaceKey = () => {
    if (!postRace) return;
    if (!cooldownDone) return;

    const raw = consumeKeyPress();
    const action = raw ?? "ignore";
    if (action !== "reset-and-start") return;

    hideToast();

    // Level advance on win
    if (results[level - 1] === "win" && level < 10) {
      setLevel(level + 1);
    }

    resetTyping();
    resetGhost();
    setRaceStarted(false);
    setRaceStartTime(null);
    endPostRace();
    setAwaitingStart(true);
  };

  // Used when changing levels or hard resetting
  const forceResetRace = () => {
    resetTyping();
    resetGhost();
    setRaceStarted(false);
    setRaceStartTime(null);
    setAwaitingStart(true);
  };

  // Used by useRaceOutcome to stop the race
  const stopRace = () => {
    stopGhost();
    setRaceStarted(false);
  };

  return {
    raceStarted,
    awaitingStart,
    handleStartCondition,
    handlePostRaceKey,
    forceResetRace,
    stopRace,
  };
}
