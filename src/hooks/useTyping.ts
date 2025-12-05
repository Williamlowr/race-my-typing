import { useState } from "react";

export default function useTyping(paragraph: string, onComplete?: () => void) {
  const [typed, setTyped] = useState("");
  const [hasError, setHasError] = useState(false);

  function handleType(nextValue: string) {
    const isDeleting = nextValue.length < typed.length;

    // Handle deletion
    if (isDeleting) {
      setTyped(nextValue);
      if (nextValue.length <= typed.length - 1) {
        setHasError(false);
      }
      return;
    }

    const nextChar = nextValue[typed.length];
    const expected = paragraph[typed.length];

    if (nextChar !== expected) {
      setHasError(true);

      setTyped(typed);
      return;
    }

    if (hasError && nextChar === expected) {
      setHasError(false);
    }

    const fixed = typed + expected;
    setTyped(fixed);

    if (fixed === paragraph) {
      setTimeout(() => onComplete && onComplete(), 200);
    }
  }

  function reset() {
    setTyped("");
    setHasError(false);
  }

  const correctCount = typed
    .split("")
    .filter((c, i) => c === paragraph[i]).length;

  return { typed, hasError, handleType, reset, correctCount };
}
