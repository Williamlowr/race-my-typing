import { useEffect, useState } from "react";
import { calculateWpm } from "../utilities/wpm";

export function useWpm({
  typedCount,
  ghostBuffer,
  startTime,
}: {
  typedCount: number;
  ghostBuffer: { time: number }[];
  startTime: number | null;
}) {
  const [userWpm, setUserWpm] = useState(0);
  const [ghostWpm, setGhostWpm] = useState(0);

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = performance.now();
      const elapsed = now - startTime;

      if (elapsed > 200 && typedCount > 0) {
        setUserWpm(calculateWpm(typedCount, elapsed));
      } else {
        setUserWpm(0);
      }

      if (ghostBuffer.length > 1) {
        const ghostElapsedMs =
          ghostBuffer[ghostBuffer.length - 1].time * 1000;

        if (ghostElapsedMs > 200) {
          setGhostWpm(
            calculateWpm(ghostBuffer.length, ghostElapsedMs)
          );
        } else {
          setGhostWpm(0);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, typedCount, ghostBuffer]);

  return { userWpm, ghostWpm };
}
