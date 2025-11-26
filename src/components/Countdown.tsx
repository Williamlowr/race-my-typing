import React from "react";

interface CountdownProps {
  count: number | null;
}

export default function Countdown({ count }: CountdownProps) {
  if (count === null) return null;

  const text = count === 0 ? "GO!" : count.toString();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
      <div className="text-6xl font-bold text-white animate-pulse">
        {text}
      </div>
    </div>
  );
}
