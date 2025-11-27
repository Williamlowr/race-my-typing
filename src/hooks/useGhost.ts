import { useState, useEffect, useRef } from "react";
import { type GhostEntry } from "../types/GhostEntry";

export default function useGhost(
  ghost: GhostEntry[] | null,
  raceStarted: boolean
) {
  const [ghostTypedBuffer, setGhostTypedBuffer] = useState<string[]>([]);
  const [ghostEventBuffer, setGhostEventBuffer] = useState<GhostEntry[]>([]);

  const startTimeRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const resetGhost = () => {
    setGhostTypedBuffer([]);
    setGhostEventBuffer([]);
    startTimeRef.current = null;
    currentIndexRef.current = 0;
  };

  useEffect(() => {
    if (raceStarted === false && startTimeRef.current !== null) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    if (!ghost || !raceStarted) {
      setGhostTypedBuffer([]);
      setGhostEventBuffer([]);
      startTimeRef.current = null;
      currentIndexRef.current = 0;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    // Set start time once
    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }

    const step = () => {
      if (!raceStarted) return;

      const elapsed = (performance.now() - startTimeRef.current!) / 1000;

      while (
        currentIndexRef.current < ghost.length &&
        ghost[currentIndexRef.current].time <= elapsed
      ) {
        const entry = ghost[currentIndexRef.current];

        setGhostEventBuffer((prev) => [...prev, entry]);

        if (entry.keysym === "BackSpace") {
          setGhostTypedBuffer((prev) => prev.slice(0, -1));
        } else if (entry.keysym === "space") {
          setGhostTypedBuffer((prev) => [...prev, " "]);
        } else if (entry.keysym === "period") {
          setGhostTypedBuffer((prev) => [...prev, "."]);
        } else if (entry.keysym.length === 1) {
          setGhostTypedBuffer((prev) => [...prev, entry.keysym]);
        }

        currentIndexRef.current++;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ghost, raceStarted]);

  return { ghostTypedBuffer, ghostEventBuffer, resetGhost };
}
