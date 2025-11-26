import { useState, useEffect, useCallback } from "react";

export default function useCountdown(duration: number = 3) {
  const [count, setCount] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const start = useCallback(() => {
    setCount(duration);
    setIsRunning(true);
  }, [duration]);

  useEffect(() => {
    if (!isRunning || count === null) return;

    if (count === 0) {
      setIsRunning(false);
      setTimeout(() => setCount(null), 500);
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [isRunning, count]);

  return {
    count,
    isRunning,
    start,
  };
}
