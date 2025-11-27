import { useState } from "react";

export function useLock() {
  const [locked, setLocked] = useState(false);

  const lock = (ms = 1500) => {
    setLocked(true);
    setTimeout(() => setLocked(false), ms);
  };

  return { locked, lock };
}
