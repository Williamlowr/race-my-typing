interface Props {
  user: number;
  ghost: number;
}

export default function WpmDisplay({ user, ghost }: Props) {
  return (
    <div className="flex gap-6 text-lg font-semibold">
      <div className="text-green-400">Your WPM: {Math.round(user)}</div>
      <div className="text-blue-400">My WPM: {Math.round(ghost)}</div>
    </div>
  );
}
