import { motion } from "framer-motion";
import { AnimationConfig, defaultConfig } from "./types";

interface AuroraAnimationProps {
  config?: AnimationConfig;
}

export function AuroraAnimation({ config = defaultConfig }: AuroraAnimationProps) {
  const waveCount = Math.floor(4 * config.intensity);
  const waves = Array.from({ length: waveCount }, (_, i) => ({
    id: i,
    color: [
      "rgba(34, 197, 94, 0.3)", // green
      "rgba(6, 182, 212, 0.25)", // cyan
      "rgba(139, 92, 246, 0.3)", // purple
      "rgba(236, 72, 153, 0.2)", // pink
    ][i % 4],
    duration: (8 + i * 2) / config.speed,
    delay: i * 0.5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {waves.map((wave) => (
        <motion.div
          key={wave.id}
          className="absolute inset-x-0 top-0 h-2/3"
          style={{
            background: `linear-gradient(180deg, ${wave.color} 0%, transparent 100%)`,
            filter: `blur(${30 * config.intensity}px)`,
          }}
          animate={{
            x: ["-20%", "20%", "-10%", "15%", "-20%"],
            scaleX: [1, 1.3, 0.9, 1.2, 1],
            opacity: [0.4, 0.7, 0.5, 0.8, 0.4].map(v => v * config.intensity),
          }}
          transition={{
            duration: wave.duration,
            repeat: Infinity,
            delay: wave.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Shimmer curtain effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "200% 0%"],
        }}
        transition={{
          duration: 5 / config.speed,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
