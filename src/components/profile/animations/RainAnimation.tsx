import { motion } from "framer-motion";
import { AnimationConfig, defaultConfig } from "./types";

interface RainAnimationProps {
  config?: AnimationConfig;
}

export function RainAnimation({ config = defaultConfig }: RainAnimationProps) {
  const dropCount = Math.floor(40 * config.intensity);
  const drops = Array.from({ length: dropCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: (0.5 + Math.random() * 0.5) / config.speed,
    opacity: 0.3 + Math.random() * 0.4,
    height: 10 + Math.random() * 20,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute w-0.5 bg-gradient-to-b from-white/60 to-transparent rounded-full"
          style={{
            left: `${drop.x}%`,
            height: drop.height * config.intensity,
            opacity: drop.opacity,
          }}
          initial={{ top: "-5%", opacity: 0 }}
          animate={{
            top: ["0%", "110%"],
            opacity: [0, drop.opacity, drop.opacity, 0],
          }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            delay: drop.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
