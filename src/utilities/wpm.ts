export function calculateWpm(chars: number, ms: number) {
  const minutes = ms / 60000;
  return (chars / 5) / minutes;
}
