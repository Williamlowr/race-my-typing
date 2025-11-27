import { forwardRef } from "react";

interface LiveTypingProps {
  value: string;
  onChange: (v: string) => void;
}

const LiveTyping = forwardRef<HTMLTextAreaElement, LiveTypingProps>(
  ({ value, onChange }, ref) => {
    return (
      <textarea
        ref={ref}
        className="w-full max-w-3xl mx-auto mt-6 p-4 h-40 resize-none bg-slate-900 text-slate-200 border border-slate-700 rounded-lg focus:outline-none focus:ring focus:ring-slate-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing to begin race..."
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
    );
  }
);

export default LiveTyping;
