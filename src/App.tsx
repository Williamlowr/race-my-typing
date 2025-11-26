import React, { useState } from "react";
import LiveTyping from "./components/LiveTyping";
import Button from "./components/UI/Button";
import Countdown from "./components/Countdown";
import LevelSelector from "./components/LevelSelector";
import GhostReplay from "./components/GhostReplay";
import useTyping from "./hooks/useTyping";

import { paragraphs } from "./data/paragraphs";
import type { GhostEntry } from "./utilities/loadGhost";

import useCountdown from "./hooks/useCountdown";

export default function App() {
  const [level, setLevel] = useState(1);
  const [ghost, setGhost] = useState<GhostEntry[] | null>(null);
  const currentParagraph = paragraphs[level - 1];

  const { count, isRunning, start } = useCountdown(3);

  const typingEnabled = count === null && !isRunning;

  const {
    typed,
    hasError,
    handleType,
    reset: resetTyping,
  } = useTyping(paragraphs[level - 1], () => {
    // completed
    if (level < 10) {
      setLevel(level + 1);
      resetTyping();
    }
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-10 gap-6">
      <h1 className="text-4xl font-bold mb-4">Race Me</h1>

      {/* Paragraph Selection */}
      <LevelSelector
        level={level}
        onChange={(n) => {
          setLevel(n);
          setGhost(null);
          resetTyping();
          start();
        }}
      />

      {/* Ghost Loader */}
      <GhostReplay level={level} onLoaded={setGhost} />

      {ghost && (
        <p className="text-green-400 text-sm">
          ✓ Loaded ghost with {ghost.length} keystrokes
        </p>
      )}

      {ghost && (
        <p className="text-green-400 text-sm">
          ✓ Ghost file loaded ({ghost.length} keystrokes)
        </p>
      )}

      {/* Paragraph Display */}
      <div className="max-w-3xl bg-slate-800 p-6 rounded-lg border border-slate-700">
        <p className="text-lg">
          {currentParagraph.split("").map((char, i) => {
            let className = "";

            // Characters already typed
            if (i < typed.length) {
              className = char === typed[i] ? "text-green-400" : "text-red-400";

              // If this is the incorrect character, underline only this one
              if (hasError && i === typed.length - 1) {
                className += " underline";
              }
            }
            // Cursor position (only when no error)
            else if (!hasError && i === typed.length) {
              className = "underline";
            }

            return (
              <span key={i} className={className}>
                {char}
              </span>
            );
          })}
        </p>
      </div>

      {/* Typing Input */}
      <LiveTyping
        value={typed}
        onChange={(v) => {
          // Start race automatically on first keypress
          if (
            !isRunning &&
            count === null &&
            typed.length === 0 &&
            v.length === 1
          ) {
            start(); // starts timer
            // later: startGhost()
          }

          handleType(v);
        }}
      />
    </div>
  );
}
