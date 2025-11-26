import { useState, useEffect, useRef } from "react";
import { type GhostEntry } from "../types/GhostEntry";

export default function useGhost(ghost: GhostEntry[] | null, raceStarted: boolean) {
  const [ghostBuffer, setGhostBuffer] = useState<string[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    // Reset anytime ghost changes OR race stops
    if (!ghost || !raceStarted) {
      setGhostBuffer([]);
      startTimeRef.current = null;
      currentIndexRef.current = 0;
      return;
    }

    // Only set start time once
    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }

    const interval = setInterval(() => {
      const elapsed = (performance.now() - startTimeRef.current!) / 1000;

      while (
        currentIndexRef.current < ghost.length &&
        ghost[currentIndexRef.current].time <= elapsed
      ) {
        const entry = ghost[currentIndexRef.current];

        if (entry.keysym === "BackSpace") {
          setGhostBuffer((prev) => prev.slice(0, -1));
        } else if (entry.keysym === "space") {
          setGhostBuffer((prev) => [...prev, " "]);
          } else if (entry.keysym === "period") {
          setGhostBuffer((prev) => [...prev, "."]);
        } else if (entry.keysym.length === 1) {
          setGhostBuffer((prev) => [...prev, entry.keysym]);
        }
        // ignore shift/ctrl/etc

        currentIndexRef.current++;
      }
    }, 16);

    return () => clearInterval(interval);
  }, [ghost, raceStarted]);

  return {
    ghostBuffer: ghostBuffer.join(""),
  };
}
