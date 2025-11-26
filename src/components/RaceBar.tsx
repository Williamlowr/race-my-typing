interface Props {
  paragraphLength: number;
  typedLength: number;
  ghostLength: number;
  ghostIndex: number;
}

export default function RaceBar({
  paragraphLength,
  typedLength,
  ghostLength,
  ghostIndex,
}: Props) {
  const userPct = (typedLength / paragraphLength) * 100;
  const ghostPct = (ghostIndex / ghostLength) * 100;

  return (
    <div className="w-full max-w-3xl space-y-2">
      {/* Ghost bar */}
      <div className="h-3 bg-slate-700 rounded">
        <div
          className="h-full bg-yellow-400 rounded"
          style={{ width: `${ghostPct}%` }}
        />
      </div>
      <div className="text-xs text-yellow-300">👻 Ghost: {ghostPct.toFixed(1)}%</div>

      {/* User bar */}
      <div className="h-3 bg-slate-700 rounded">
        <div
          className="h-full bg-blue-500 rounded"
          style={{ width: `${userPct}%` }}
        />
      </div>
      <div className="text-xs text-blue-300">👤 You: {userPct.toFixed(1)}%</div>
    </div>
  );
}
