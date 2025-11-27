import { useRef } from "react";
import GhostCursor from "./GhostCursor";

interface Props {
  paragraph: string;
  ghostBuffer: string[];
}

export default function GhostParagraph({ paragraph, ghostBuffer }: Props) {
  const paragraphRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative max-w-3xl bg-slate-800 p-4 rounded-lg border border-slate-700">
      <GhostCursor
        paragraphRef={paragraphRef}
        ghostIndex={ghostBuffer.length} 
      />

      <div ref={paragraphRef} className="text-lg font-mono space-x-0.5">
        {paragraph.split("").map((char, i) => {
          const g = ghostBuffer[i];
          const correct = g === char;
          const wrong = g && g !== char;

          return (
            <span
              key={i}
              className={
                correct
                  ? "text-green-400"
                  : wrong
                  ? "text-red-500"
                  : "opacity-40"
              }
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
}
