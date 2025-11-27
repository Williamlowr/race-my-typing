import { useState, useEffect } from "react";

export type ToastType = "win" | "loss";

export function useToast() {
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
  };

  const hideToast = () => setToast(null);

  return { toast, showToast, hideToast };
}
