import { useState } from "react";

export default function useTyping(paragraph: string, onComplete?: () => void) {
  const [typed, setTyped] = useState("");
  const [hasError, setHasError] = useState(false); // NEW: block further typing

  function handleType(nextValue: string) {
    const isDeleting = nextValue.length < typed.length;

    // --- If deleting, always allow ---
    if (isDeleting) {
      setTyped(nextValue);

      // If the user backspaced enough, clear the error lock
      if (nextValue.length <= typed.length - 1) {
        setHasError(false);
      }
      return;
    }

    // --- If currently in an error state, block all new chars ---
    if (hasError) return;

    const nextChar = nextValue[typed.length];
    const expected = paragraph[typed.length];

    // If incorrect: allow ONE char but lock everything else afterward
    if (nextChar !== expected) {
      setTyped(nextValue);
      setHasError(true);     // user MUST backspace
      return;
    }

    // Correct char → update
    setTyped(nextValue);

    // Completed paragraph
    if (nextValue === paragraph) {
      setTimeout(() => onComplete && onComplete(), 200);
    }
  }

  function reset() {
    setTyped("");
    setHasError(false);
  }

  return { typed, hasError, handleType, reset };
}
