interface LiveTypingProps {
  value: string;
  onChange: (v: string) => void;
}

export default function LiveTyping({ value, onChange }: LiveTypingProps) {
  return (
    <textarea
      className="w-full max-w-3xl mx-auto mt-6 p-4 h-40 resize-none bg-slate-900 text-slate-200 border border-slate-700 rounded-lg focus:outline-none focus:ring focus:ring-indigo-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Start typing here..."
      autoFocus
    />
  );
}
