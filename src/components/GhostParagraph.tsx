import React, { useRef } from "react";
import GhostCursor from "./GhostCursor";

interface Props {
  paragraph: string;
  ghostIndex: number;
}

export default function GhostParagraph({ paragraph, ghostIndex }: Props) {
  const paragraphRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative max-w-3xl bg-slate-800 p-4 rounded-lg border border-slate-700">
      <GhostCursor paragraphRef={paragraphRef} ghostIndex={ghostIndex} />

      <div ref={paragraphRef} className="text-lg text-yellow-300 opacity-80">
        {paragraph.split("").map((char, i) => (
          <span key={i}>{char}</span>
        ))}
      </div>
    </div>
  );
}
