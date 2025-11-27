interface Props {
  level: number;
  results: ("win" | "loss" | null)[];
  onChange: (n: number) => void;
}

export default function LevelSelector({ level, results, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      {Array.from({ length: 10 }).map((_, i) => {
        const idx = i + 1;
        const state = results[i];

        let color = "bg-slate-700";
        if (state === "win") color = "bg-green-600";
        if (state === "loss") color = "bg-red-600";

        const isCurrent = idx === level;

        return (
          <div
            key={idx}
            onClick={() => onChange(idx)}
            className={`
              w-10 h-10 rounded cursor-pointer 
              flex items-center justify-center text-sm font-bold
              transition-all border
              ${color}
              ${isCurrent ? "scale-110 border-yellow-300" : "border-slate-500"}
            `}
          >
            {idx}
          </div>
        );
      })}
    </div>
  );
}
