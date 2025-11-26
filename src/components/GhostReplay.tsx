import React, { useEffect } from "react";
import { type GhostEntry } from "../utilities/loadGhost";

interface Props {
  level: number;
  onLoaded: (ghost: GhostEntry[]) => void;
}

export default function GhostReplay({ level, onLoaded }: Props) {
  useEffect(() => {
    fetch(`/assets/ghosts/p${level}.json`)
      .then((r) => r.json())
      .then(onLoaded)
      .catch((err) =>
        console.error(`Failed to load ghost: /assets/ghosts/p${level}.json`, err)
      );
  }, [level]);

  return <p className="text-sm text-slate-300">Loading ghost…</p>;
}
