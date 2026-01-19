import { motion } from "framer-motion";
import { AnimationConfig, defaultConfig } from "./types";

interface SparkleAnimationProps {
  config?: AnimationConfig;
}

export function SparkleAnimation({ config = defaultConfig }: SparkleAnimationProps) {
  const sparkleCount = Math.floor(25 * config.intensity);
  const sparkles = Array.from({ length: sparkleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 4 + Math.random() * 8,
    delay: Math.random() * 3,
    duration: (0.5 + Math.random() * 1) / config.speed,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1 * config.intensity, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: sparkle.duration,
            repeat: Infinity,
            delay: sparkle.delay,
            repeatDelay: 1 + Math.random() * 2,
          }}
        >
          {/* 4-point star shape */}
          <svg
            width={sparkle.size * config.intensity}
            height={sparkle.size * config.intensity}
            viewBox="0 0 24 24"
            fill="white"
          >
            <path d="M12 0L13.5 10.5L24 12L13.5 13.5L12 24L10.5 13.5L0 12L10.5 10.5L12 0Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
