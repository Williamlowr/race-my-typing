import { useState, useEffect, useRef } from "react";

export function usePostRace() {
  const [postRace, setPostRace] = useState(false);
  const [cooldownDone, setCooldownDone] = useState(false);

  const keyPressCount = useRef(0);

  const beginPostRace = () => {
    setPostRace(true);
    setCooldownDone(false);
    keyPressCount.current = 0;

    setTimeout(() => {
      setCooldownDone(true);
    }, 1500);
  };

  const consumeKeyPress = () => {
    if (!postRace || !cooldownDone) return null;

    keyPressCount.current++;

    if (keyPressCount.current === 1) return "reset-and-start";

    return null;
  };

  const endPostRace = () => {
    setPostRace(false);
    setCooldownDone(false);
    keyPressCount.current = 0;
  };

  return {
    postRace,
    cooldownDone,
    beginPostRace,
    consumeKeyPress,
    endPostRace,
  };
}
