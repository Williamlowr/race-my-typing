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
    <div className="relative w-full bg-slate-800 p-5 rounded-lg border border-slate-500">
      <GhostCursor
        paragraphRef={paragraphRef}
        ghostIndex={ghostBuffer.length}
        symbol="ghost"
      />

      <GhostCursor
        paragraphRef={paragraphRef}
        ghostIndex={ghostBuffer.length}
        symbol="|"
      />

      <div ref={paragraphRef} className="text-lg text-center">
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
                  : "opacity-60"
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
