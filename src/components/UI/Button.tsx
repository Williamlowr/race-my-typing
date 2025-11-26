import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function Button({ children, onClick, disabled }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-lg text-white font-semibold
        transition-all duration-200
        ${disabled
          ? "bg-slate-600 cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-500"}
      `}
    >
      {children}
    </button>
  );
}
