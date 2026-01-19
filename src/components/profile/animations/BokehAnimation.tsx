import { motion } from "framer-motion";
import { AnimationConfig, defaultConfig } from "./types";

interface BokehAnimationProps {
  config?: AnimationConfig;
}

export function BokehAnimation({ config = defaultConfig }: BokehAnimationProps) {
  const circleCount = Math.floor(15 * config.intensity);
  const circles = Array.from({ length: circleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 40 + Math.random() * 100,
    duration: (5 + Math.random() * 5) / config.speed,
    delay: Math.random() * 2,
    opacity: 0.1 + Math.random() * 0.2,
    color: [
      "rgba(255, 255, 255, 0.15)",
      "rgba(255, 200, 150, 0.12)",
      "rgba(200, 220, 255, 0.12)",
      "rgba(255, 180, 200, 0.12)",
    ][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {circles.map((circle) => (
        <motion.div
          key={circle.id}
          className="absolute rounded-full"
          style={{
            left: `${circle.x}%`,
            top: `${circle.y}%`,
            width: circle.size * config.intensity,
            height: circle.size * config.intensity,
            background: `radial-gradient(circle, ${circle.color} 0%, transparent 70%)`,
            filter: `blur(${8 + Math.random() * 12}px)`,
          }}
          animate={{
            x: [0, 20 * config.intensity, -15 * config.intensity, 0],
            y: [0, -25 * config.intensity, 10 * config.intensity, 0],
            scale: [1, 1.2, 0.9, 1],
            opacity: [circle.opacity, circle.opacity * 1.5, circle.opacity * 0.7, circle.opacity],
          }}
          transition={{
            duration: circle.duration,
            repeat: Infinity,
            delay: circle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
