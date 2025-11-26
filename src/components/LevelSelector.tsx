import React from "react";

interface Props {
  level: number;
  onChange: (n: number) => void;
}

export default function LevelSelector({ level, onChange }: Props) {
  return (
    <select
      className="bg-slate-800 text-slate-100 p-2 rounded-lg border border-slate-700"
      value={level}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <option key={i + 1} value={i + 1}>
          Level {i + 1}
        </option>
      ))}
    </select>
  );
}
