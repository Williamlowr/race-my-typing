import { type RaceState } from "../hooks/useEngine";

interface Props {
  race: RaceState;
}

export default function RaceBar({ race }: Props) {
  const paragraphLength = race.currentParagraph.length;
  const typedLength = race.correctCount;
  const ghostLength = race.currentParagraph.length;
  const ghostIndex = race.ghostTypedBuffer.length;

  const userPct = (typedLength / paragraphLength) * 100;
  const ghostPct = (ghostIndex / ghostLength) * 100;

  return (
    <div className="w-full max-w-3xl space-y-2">
      {/* My bar */}
      <div className="h-3 bg-slate-700 rounded">
        <div
          className="h-full bg-red-400 rounded transition-all duration-200 ease-out"
          style={{ width: `${ghostPct}%` }}
        />
      </div>
      <div className="text-xs text-red-400">
        Me: {ghostPct.toFixed(1)}%
      </div>

      {/* User's bar */}
      <div className="h-3 bg-slate-700 rounded">
        <div
          className="h-full bg-blue-500 rounded transition-all duration-200 ease-out"
          style={{ width: `${userPct}%` }}
        />
      </div>
      <div className="text-xs text-blue-400">You: {userPct.toFixed(1)}%</div>
    </div>
  );
}
