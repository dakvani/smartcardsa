import { motion } from "framer-motion";
import { AnimationConfig, defaultConfig } from "./types";

interface BubblesAnimationProps {
  config?: AnimationConfig;
}

export function BubblesAnimation({ config = defaultConfig }: BubblesAnimationProps) {
  const bubbleCount = Math.floor(20 * config.intensity);
  const bubbles = Array.from({ length: bubbleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 10 + Math.random() * 30,
    delay: Math.random() * 4,
    duration: (3 + Math.random() * 3) / config.speed,
    wobble: 10 + Math.random() * 20,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            left: `${bubble.x}%`,
            bottom: "-10%",
            width: bubble.size * config.intensity,
            height: bubble.size * config.intensity,
            background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(255,255,255,0.1) 50%, transparent 70%)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
          animate={{
            y: [0, -600 * config.intensity],
            x: [0, bubble.wobble, -bubble.wobble, bubble.wobble * 0.5, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
            opacity: [0, 0.8, 0.8, 0.6, 0],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: bubble.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
