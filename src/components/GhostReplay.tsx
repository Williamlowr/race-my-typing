import { useEffect } from "react";
import { type GhostEntry } from "../types/GhostEntry";
interface Props {
  level: number;
  onLoaded: (data: GhostEntry[]) => void;
}

export default function GhostReplay({ level, onLoaded }: Props) {
  useEffect(() => {
    const loadGhost = async () => {
      try {
        const res = await fetch(`/assets/ghosts/p${level}.json`);
        if (!res.ok) throw new Error("Failed to load ghost");
        const data: GhostEntry[] = await res.json();
        onLoaded(data);
      } catch (err) {
        console.error("Ghost load error:", err);
        onLoaded([]); // prevent null issues
      }
    };

    loadGhost();
  }, [level]);

  return null;
}
