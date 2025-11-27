import React from "react";
import { motion } from "framer-motion";
import { Ghost } from "lucide-react";

interface Props {
  paragraphRef: React.RefObject<HTMLDivElement | null>;
  ghostIndex: number;
  symbol: string;
}

export default function GhostCursor({
  paragraphRef,
  ghostIndex,
  symbol,
}: Props) {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (!paragraphRef.current) return;

    const spans = paragraphRef.current.querySelectorAll("span");
    const target = spans[ghostIndex];

    if (target) {
      const rect = target.getBoundingClientRect();
      const parent = paragraphRef.current.getBoundingClientRect();

      setPos({
        x: rect.left - parent.left - (symbol === "|" ? 2 : 4),
        y: rect.top - parent.top - (symbol === "|" ? 3 : 18),
      });
    }
  }, [ghostIndex, paragraphRef, symbol]);

  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{
        fontSize: symbol === "|" ? "1.1rem" : "0.9rem",
        color: symbol === "|" ? "#60a5fa" : "#facc15",
      }}
      animate={{
        x: pos.x,
        y: pos.y,
      }}
      transition={
        ghostIndex === 0
          ? { duration: 0 }
          : {
              x: {
                type: "spring",
                stiffness: symbol === "|" ? 300 : 80,
                damping: symbol === "|" ? 25 : 3,
              },
              y: {
                duration: 0.18,
                ease: "easeOut",
              },
            }
      }
    >
      {symbol === "ghost" ? (
        <Ghost className="w-5 h-5 text-red-500 drop-shadow-[0_0_4px_rgba(250,21,21,0.6)]" />
      ) : (
        symbol
      )}
    </motion.div>
  );
}
