import { useState } from "react";

export default function useTyping(paragraph: string, onComplete?: () => void) {
  const [typed, setTyped] = useState("");
  const [hasError, setHasError] = useState(false);

  function handleType(nextValue: string) {
    const isDeleting = nextValue.length < typed.length;

    // --- Deleting stays exactly the same ---
    if (isDeleting) {
      setTyped(nextValue);
      if (nextValue.length <= typed.length - 1) {
        setHasError(false);
      }
      return;
    }

    // ❌ REMOVE: if (hasError) return;
    // We want to allow pressing the CORRECT key to fix the error

    const nextChar = nextValue[typed.length];
    const expected = paragraph[typed.length];

    // ⭐ NEW BEHAVIOR: Wrong key → show error, but do not insert the wrong char
    if (nextChar !== expected) {
      setHasError(true);

      // ❗ IMPORTANT: DO NOT accept the wrong char into typed
      // Instead, force typed to remain unchanged
      setTyped(typed);
      return;
    }

    // ⭐ NEW: If the user typed the correct key while in error state, clear it
    if (hasError && nextChar === expected) {
      setHasError(false);
    }

    // ⭐ NEW: Only append the correct char
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
