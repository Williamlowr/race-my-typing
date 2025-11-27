import { useRef } from "react";
import GhostCursor from "./GhostCursor";
import { type RaceState } from "../hooks/useEngine";

interface Props {
  race: RaceState;
}

export default function GhostParagraph({ race }: Props) {
  const paragraphRef = useRef<HTMLDivElement | null>(null);

  const paragraph = race.currentParagraph;
  const ghostBuffer = race.ghostTypedBuffer;

  return (
    <div className="relative max-w-3xl bg-slate-800 p-4 rounded-lg border border-slate-700">
      <GhostCursor
        paragraphRef={paragraphRef}
        ghostIndex={ghostBuffer.length}
        symbol="👻"
      />

      <GhostCursor
        paragraphRef={paragraphRef}
        ghostIndex={ghostBuffer.length}
        symbol="|"
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
