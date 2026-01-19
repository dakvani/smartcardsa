import { motion } from "framer-motion";
import { AnimationConfig, defaultConfig } from "./types";

interface LightningAnimationProps {
  config?: AnimationConfig;
}

export function LightningAnimation({ config = defaultConfig }: LightningAnimationProps) {
  const boltCount = Math.floor(3 * config.intensity);
  const bolts = Array.from({ length: boltCount }, (_, i) => ({
    id: i,
    x: 15 + Math.random() * 70,
    delay: i * 2 + Math.random() * 3,
    duration: 0.15 / config.speed,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dark overlay flash */}
      {bolts.map((bolt) => (
        <motion.div
          key={`flash-${bolt.id}`}
          className="absolute inset-0 bg-white/30"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.8 * config.intensity, 0, 0.4 * config.intensity, 0],
          }}
          transition={{
            duration: bolt.duration * 3,
            repeat: Infinity,
            delay: bolt.delay,
            repeatDelay: 4 / config.speed,
          }}
        />
      ))}
      
      {/* Lightning bolts */}
      {bolts.map((bolt) => (
        <motion.svg
          key={bolt.id}
          className="absolute"
          style={{ left: `${bolt.x}%`, top: 0 }}
          width="60"
          height="200"
          viewBox="0 0 60 200"
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scaleY: [0, 1, 1, 0],
          }}
          transition={{
            duration: bolt.duration * 2,
            repeat: Infinity,
            delay: bolt.delay,
            repeatDelay: 4 / config.speed,
          }}
        >
          <path
            d="M30 0 L25 60 L40 65 L20 120 L35 125 L15 200"
            stroke={`rgba(255, 255, 255, ${0.9 * config.intensity})`}
            strokeWidth="3"
            fill="none"
            filter="url(#glow)"
          />
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </motion.svg>
      ))}
    </div>
  );
}
