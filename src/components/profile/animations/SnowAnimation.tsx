import { motion } from "framer-motion";
import { AnimationConfig, defaultConfig } from "./types";

interface SnowAnimationProps {
  config?: AnimationConfig;
}

export function SnowAnimation({ config = defaultConfig }: SnowAnimationProps) {
  const flakeCount = Math.floor(35 * config.intensity);
  const flakes = Array.from({ length: flakeCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3,
    duration: (4 + Math.random() * 3) / config.speed,
    size: 2 + Math.random() * 4,
    wobble: 20 + Math.random() * 30,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute rounded-full bg-white/80"
          style={{
            left: `${flake.x}%`,
            width: flake.size * config.intensity,
            height: flake.size * config.intensity,
            boxShadow: "0 0 4px rgba(255,255,255,0.5)",
          }}
          initial={{ top: "-5%", opacity: 0 }}
          animate={{
            top: ["0%", "110%"],
            x: [0, flake.wobble * config.intensity, -flake.wobble * config.intensity, 0],
            opacity: [0, 0.9, 0.9, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
