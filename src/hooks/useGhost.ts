import { useEffect, useState } from "react";
import { type GhostEntry } from "../utilities/loadGhost";

export default function useGhost(
  ghost: GhostEntry[] | null,
  raceStarted: boolean
) {
  const [ghostIndex, setGhostIndex] = useState(0);

  useEffect(() => {
    if (!ghost || ghost.length === 0 || !raceStarted) {
      return;
    }

    // reset ghost cursor
    setGhostIndex(0);
    const startTime = performance.now();

    const interval = setInterval(() => {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;

      setGhostIndex((current) => {
        while (current < ghost.length && ghost[current].time <= elapsed) {
          current++;
        }
        return current;
      });
    }, 5);

    return () => clearInterval(interval);
  }, [ghost, raceStarted]);

  return ghostIndex;
}
