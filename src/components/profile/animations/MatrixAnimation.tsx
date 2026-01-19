import { motion } from "framer-motion";
import { AnimationConfig, defaultConfig } from "./types";

interface MatrixAnimationProps {
  config?: AnimationConfig;
}

const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";

export function MatrixAnimation({ config = defaultConfig }: MatrixAnimationProps) {
  const columnCount = Math.floor(20 * config.intensity);
  const columns = Array.from({ length: columnCount }, (_, i) => ({
    id: i,
    x: (i / columnCount) * 100,
    chars: Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]),
    duration: (2 + Math.random() * 2) / config.speed,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {columns.map((column) => (
        <motion.div
          key={column.id}
          className="absolute flex flex-col text-green-400/70 font-mono text-xs"
          style={{
            left: `${column.x}%`,
            textShadow: `0 0 ${8 * config.intensity}px #22c55e`,
          }}
          initial={{ top: "-20%", opacity: 0 }}
          animate={{
            top: ["0%", "120%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: column.duration,
            repeat: Infinity,
            delay: column.delay,
            ease: "linear",
          }}
        >
          {column.chars.map((char, i) => (
            <span
              key={i}
              style={{ opacity: 1 - i * 0.12 }}
            >
              {char}
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
