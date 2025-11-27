import { type ToastType } from "../../hooks/useToast";

interface Props {
  toast: { type: ToastType; message: string } | null;
}

export default function Toast({ toast }: Props) {
  if (!toast) return null;

  return (
    <div
      className={`
        fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg 
        text-white transition-all duration-300
        ${toast.type === "win" ? "bg-green-600" : "bg-red-600"}
      `}
    >
      {toast.message}
    </div>
  );
}
