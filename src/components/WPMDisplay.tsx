import { type RaceState } from "../hooks/useEngine";

interface Props {
  race: RaceState;
}

export default function WpmDisplay({ race }: Props) {
  return (
    <div className="flex gap-6 text-lg font-semibold">
      <div className="text-green-400">
        Your WPM: {Math.round(race.userWpm)}
      </div>
      <div className="text-blue-400">
        My WPM: {Math.round(race.ghostWpm)}
      </div>
    </div>
  );
}
