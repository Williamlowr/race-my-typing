type RaceResult = "win" | "loss" | null;

interface Props {
  visible: boolean;
  result: RaceResult;
  hasError?: boolean;
}

export default function OutcomeOverlay({ visible, result, hasError }: Props) {
  return (
    <div
      className={`
        fixed inset-0 flex items-center justify-center 
        pointer-events-none transition-opacity duration-300
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      {visible && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`
              w-[5000px] h-[2000px]
              rounded-full
              opacity-35
              transition-opacity duration-500
              mask-radial-fade
              ${
                result === "win"
                  ? "bg-green-500/15"
                  : result === "loss"
                  ? "bg-red-500/15"
                  : hasError
                  ? "bg-yellow-400/20"
                  : "bg-transparent"
              }
            `}
          />
        </div>
      )}
    </div>
  );
}
