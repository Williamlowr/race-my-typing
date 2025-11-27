import { type RaceState } from "../hooks/useEngine";

interface Props {
  race: RaceState;
}

export default function UserParagraph({ race }: Props) {
  const paragraph = race.currentParagraph;
  const typed = race.typed;
  const hasError = race.hasError;

  return (
    <div className="w-full bg-slate-800 p-6 rounded-lg border border-slate-700">
      <p className="text-lg font-mono text-center">
        {paragraph.split("").map((char, i) => {
          let className = "";

          if (i < typed.length) {
            className = char === typed[i] ? "text-green-400" : "text-red-400";
          } else if (i === typed.length) {
            className = hasError ? "text-red-400 underline" : "underline";
          }

          return (
            <span key={i} className={className}>
              {char}
            </span>
          );
        })}
      </p>
    </div>
  );
}
