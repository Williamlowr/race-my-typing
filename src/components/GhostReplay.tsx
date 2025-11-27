import { useEffect } from "react";
import { type GhostEntry } from "../types/GhostEntry";

interface Props {
  level: number;
  onLoaded: (data: GhostEntry[]) => void;
}

export default function GhostReplay({ level, onLoaded }: Props) {
  useEffect(() => {
    let cancelled = false;

    async function loadGhost() {
      try {
        const res = await fetch(`/assets/ghosts/p${level}.json`);
        if (!res.ok) {
          console.error("Failed to load ghost JSON for level", level);
          return;
        }

        const data = (await res.json()) as GhostEntry[];

        if (!cancelled) {
          onLoaded(data);
        }
      } catch (err) {
        console.error("Error loading ghost JSON", err);
      }
    }

    loadGhost();

    return () => {
      cancelled = true;
    };
  }, [level, onLoaded]);

  return null;
}
