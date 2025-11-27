import { useState, useEffect } from "react";

export type ToastType = "win" | "loss";

export function useToast() {
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
  };

  useEffect(() => {
    if (!toast) return;

    const id = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(id);
  }, [toast]);

  return { toast, showToast };
}
