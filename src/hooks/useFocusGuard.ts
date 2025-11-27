import { type RefObject, useEffect } from "react";

export function useFocusGuard(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    ref.current?.focus();
  });

  useEffect(() => {
    const refocus = () => {
      ref.current?.focus();
    };

    window.addEventListener("mousedown", refocus);
    window.addEventListener("keydown", refocus);

    return () => {
      window.removeEventListener("mousedown", refocus);
      window.removeEventListener("keydown", refocus);
    };
  }, [ref]);
}
