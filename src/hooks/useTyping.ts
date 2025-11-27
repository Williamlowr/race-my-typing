import { useState } from "react";

export default function useTyping(paragraph: string, onComplete?: () => void) {
  const [typed, setTyped] = useState("");
  const [hasError, setHasError] = useState(false);

  function handleType(nextValue: string) {
    const isDeleting = nextValue.length < typed.length;

    if (isDeleting) {
      setTyped(nextValue);

      if (nextValue.length <= typed.length - 1) {
        setHasError(false);
      }
      return;
    }

    if (hasError) return;

    const nextChar = nextValue[typed.length];
    const expected = paragraph[typed.length];


    if (nextChar !== expected) {
      setTyped(nextValue);
      setHasError(true);
      return;
    }

    setTyped(nextValue);

    if (nextValue === paragraph) {
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
