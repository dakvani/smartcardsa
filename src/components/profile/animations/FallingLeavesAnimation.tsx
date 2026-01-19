import { motion } from "framer-motion";
import { AnimationConfig, defaultConfig } from "./types";

interface FallingLeavesAnimationProps {
  config?: AnimationConfig;
}

const leafColors = [
  "bg-orange-400",
  "bg-amber-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-orange-600",
  "bg-red-400",
];

export function FallingLeavesAnimation({ config = defaultConfig }: FallingLeavesAnimationProps) {
  const leafCount = Math.floor(20 * config.intensity);
  const leaves = Array.from({ length: leafCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: leafColors[Math.floor(Math.random() * leafColors.length)],
    delay: Math.random() * 5,
    duration: (4 + Math.random() * 3) / config.speed,
    size: 8 + Math.random() * 12,
    swayAmount: 30 + Math.random() * 40,
    rotateAmount: 180 + Math.random() * 360,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className={`absolute ${leaf.color} rounded-tl-full rounded-br-full`}
          style={{
            left: `${leaf.x}%`,
            width: leaf.size * config.intensity,
            height: leaf.size * config.intensity * 0.6,
            transformOrigin: "center",
          }}
          initial={{ top: "-5%", opacity: 0, rotate: 0 }}
          animate={{
            top: ["0%", "110%"],
            x: [
              0, 
              leaf.swayAmount * config.intensity, 
              -leaf.swayAmount * config.intensity * 0.5, 
              leaf.swayAmount * config.intensity * 0.7, 
              0
            ],
            rotate: [0, leaf.rotateAmount, leaf.rotateAmount * 0.5, leaf.rotateAmount * 1.5],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: leaf.duration,
            repeat: Infinity,
            delay: leaf.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
