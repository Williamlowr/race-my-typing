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

  const handleStartCondition = (value: string, raceLocked: boolean) => {
    if (raceLocked) return;
    if (raceStarted) return;

    if (awaitingStart) {
      setAwaitingStart(false);
      setRaceStarted(true);
      startGhost();
      setRaceStartTime(performance.now());
      return;
    }

    if (value.length > 0) {
      setRaceStarted(true);
      startGhost();
      setRaceStartTime(performance.now());
    }
  };

  const handlePostRaceKey = () => {
    if (!postRace) return;
    if (!cooldownDone) return;

    const raw = consumeKeyPress();
    const action = raw ?? "ignore";
    if (action !== "reset-and-start") return;

    hideToast();

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

  const forceResetRace = () => {
    resetTyping();
    resetGhost();
    setRaceStarted(false);
    setRaceStartTime(null);
    setAwaitingStart(true);
  };

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
