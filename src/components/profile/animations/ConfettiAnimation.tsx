import { motion } from "framer-motion";
import { AnimationConfig, defaultConfig } from "./types";

interface ConfettiAnimationProps {
  config?: AnimationConfig;
}

const confettiColors = [
  "bg-red-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-yellow-400",
  "bg-pink-400",
  "bg-purple-400",
  "bg-orange-400",
  "bg-cyan-400",
];

export function ConfettiAnimation({ config = defaultConfig }: ConfettiAnimationProps) {
  const pieceCount = Math.floor(25 * config.intensity);
  const pieces = Array.from({ length: pieceCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    delay: Math.random() * 3,
    duration: (3 + Math.random() * 2) / config.speed,
    rotation: Math.random() * 360,
    size: 6 + Math.random() * 8,
    shape: Math.random() > 0.5 ? "rounded-full" : "rounded-sm",
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className={`absolute ${piece.color} ${piece.shape}`}
          style={{
            left: `${piece.x}%`,
            width: piece.size * config.intensity,
            height: piece.size * config.intensity * (piece.shape === "rounded-sm" ? 0.6 : 1),
          }}
          initial={{ top: "-5%", rotate: 0, opacity: 0 }}
          animate={{
            top: ["0%", "110%"],
            rotate: [0, piece.rotation, piece.rotation * 2, piece.rotation * 3],
            x: [0, 30 * config.intensity, -20 * config.intensity, 10 * config.intensity],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: piece.duration,
            repeat: Infinity,
            delay: piece.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
