import React from "react";
import { motion } from "framer-motion";

interface Props {
  paragraphRef: React.RefObject<HTMLDivElement | null>;
  ghostIndex: number;
}

export default function GhostCursor({ paragraphRef, ghostIndex }: Props) {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (!paragraphRef.current) return;

    const spans = paragraphRef.current.querySelectorAll("span");
    const target = spans[ghostIndex];

    if (target) {
      const rect = target.getBoundingClientRect();
      const parent = paragraphRef.current.getBoundingClientRect();

      setPos({
        x: rect.left - parent.left,
        y: rect.top - parent.top - 16,
      });
    }
  }, [ghostIndex, paragraphRef]);

  return (
    <motion.div
      className="absolute text-yellow-300"
      style={{ fontSize: "0.8rem" }}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      👻
    </motion.div>
  );
}
