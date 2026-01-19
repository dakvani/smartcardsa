import { motion } from "framer-motion";
import { AnimationConfig, defaultConfig } from "./types";

interface FirefliesAnimationProps {
  config?: AnimationConfig;
}

export function FirefliesAnimation({ config = defaultConfig }: FirefliesAnimationProps) {
  const flyCount = Math.floor(20 * config.intensity);
  const fireflies = Array.from({ length: flyCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 3 + Math.random() * 4,
    duration: (3 + Math.random() * 4) / config.speed,
    delay: Math.random() * 2,
    glowDuration: (0.5 + Math.random() * 1) / config.speed,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {fireflies.map((fly) => (
        <motion.div
          key={fly.id}
          className="absolute rounded-full"
          style={{
            left: `${fly.x}%`,
            top: `${fly.y}%`,
            width: fly.size * config.intensity,
            height: fly.size * config.intensity,
            background: "radial-gradient(circle, #fef08a 0%, #facc15 40%, transparent 70%)",
            boxShadow: `0 0 ${10 * config.intensity}px #facc15, 0 0 ${20 * config.intensity}px #fef08a`,
          }}
          animate={{
            x: [0, 40 * config.intensity, -30 * config.intensity, 20 * config.intensity, 0],
            y: [0, -30 * config.intensity, 20 * config.intensity, -20 * config.intensity, 0],
            opacity: [0.3, 1, 0.2, 0.8, 0.3],
            scale: [0.8, 1.2, 0.6, 1, 0.8],
          }}
          transition={{
            duration: fly.duration,
            repeat: Infinity,
            delay: fly.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
