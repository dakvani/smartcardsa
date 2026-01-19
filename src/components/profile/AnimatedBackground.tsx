import { motion } from "framer-motion";
import {
  RainAnimation,
  ConfettiAnimation,
  BokehAnimation,
  SnowAnimation,
  FirefliesAnimation,
  MatrixAnimation,
  LightningAnimation,
  AuroraAnimation,
  FallingLeavesAnimation,
  BubblesAnimation,
  SparkleAnimation,
  AnimationConfig,
  defaultConfig,
} from "./animations";

interface AnimatedBackgroundProps {
  animationType: string | null;
  config?: AnimationConfig;
}

export function AnimatedBackground({ animationType, config = defaultConfig }: AnimatedBackgroundProps) {
  if (!animationType) return null;

  switch (animationType) {
    case "particles":
      return <ParticlesAnimation config={config} />;
    case "pulse":
      return <PulseAnimation config={config} />;
    case "wave":
      return <WaveAnimation config={config} />;
    case "gradient-shift":
      return <GradientShiftAnimation config={config} />;
    case "glow":
      return <GlowAnimation config={config} />;
    case "orbs":
      return <OrbsAnimation config={config} />;
    case "shimmer":
      return <ShimmerAnimation config={config} />;
    case "neon":
      return <NeonAnimation config={config} />;
    case "rain":
      return <RainAnimation config={config} />;
    case "confetti":
      return <ConfettiAnimation config={config} />;
    case "bokeh":
      return <BokehAnimation config={config} />;
    case "snow":
      return <SnowAnimation config={config} />;
    case "fireflies":
      return <FirefliesAnimation config={config} />;
    case "matrix":
      return <MatrixAnimation config={config} />;
    case "lightning":
      return <LightningAnimation config={config} />;
    case "aurora":
      return <AuroraAnimation config={config} />;
    case "leaves":
      return <FallingLeavesAnimation config={config} />;
    case "bubbles":
      return <BubblesAnimation config={config} />;
    case "sparkle":
      return <SparkleAnimation config={config} />;
    default:
      return null;
  }
}

interface AnimationProps {
  config: AnimationConfig;
}

// Floating particles like stars
function ParticlesAnimation({ config }: AnimationProps) {
  const particleCount = Math.floor(30 * config.intensity);
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: (Math.random() * 3 + 1) * config.intensity,
    duration: (Math.random() * 3 + 2) / config.speed,
    delay: Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/40"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -20 * config.intensity, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Pulsing aurora effect
function PulseAnimation({ config }: AnimationProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent"
        animate={{
          opacity: [0.3, 0.6 * config.intensity, 0.3],
          scale: [1, 1.05 * config.intensity, 1],
        }}
        transition={{
          duration: 4 / config.speed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-white/10 blur-3xl"
        animate={{
          scale: [1, 1.3 * config.intensity, 1],
          opacity: [0.2, 0.4 * config.intensity, 0.2],
        }}
        transition={{
          duration: 3 / config.speed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// Wave motion effect
function WaveAnimation({ config }: AnimationProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent"
          style={{
            borderRadius: "100% 100% 0 0",
          }}
          animate={{
            y: [0, -10 * config.intensity, 0],
            scaleY: [1, 1.1 * config.intensity, 1],
          }}
          transition={{
            duration: (3 + i * 0.5) / config.speed,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Shifting gradient colors
function GradientShiftAnimation({ config }: AnimationProps) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
        backgroundSize: "200% 200%",
      }}
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
      }}
      transition={{
        duration: 8 / config.speed,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// Glowing ring effect
function GlowAnimation({ config }: AnimationProps) {
  const glowSize = 20 * config.intensity;
  return (
    <div className="absolute inset-0 flex items-start justify-center pt-12 pointer-events-none">
      <motion.div
        className="w-32 h-32 rounded-full border-2 border-white/30"
        animate={{
          boxShadow: [
            `0 0 ${glowSize}px rgba(255,255,255,0.2), 0 0 ${glowSize * 2}px rgba(255,255,255,0.1)`,
            `0 0 ${glowSize * 2}px rgba(255,255,255,0.4), 0 0 ${glowSize * 4}px rgba(255,255,255,0.2)`,
            `0 0 ${glowSize}px rgba(255,255,255,0.2), 0 0 ${glowSize * 2}px rgba(255,255,255,0.1)`,
          ],
          scale: [1, 1.05 * config.intensity, 1],
        }}
        transition={{
          duration: 2 / config.speed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// Floating orbs
function OrbsAnimation({ config }: AnimationProps) {
  const orbs = [
    { x: "10%", y: "20%", size: 100 * config.intensity, duration: 8 / config.speed },
    { x: "70%", y: "60%", size: 150 * config.intensity, duration: 10 / config.speed },
    { x: "30%", y: "70%", size: 80 * config.intensity, duration: 7 / config.speed },
    { x: "80%", y: "20%", size: 60 * config.intensity, duration: 6 / config.speed },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10 blur-xl"
          style={{
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
          }}
          animate={{
            x: [0, 30 * config.intensity, 0, -30 * config.intensity, 0],
            y: [0, -20 * config.intensity, 0, 20 * config.intensity, 0],
            scale: [1, 1.2, 1, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Shimmer highlight effect
function ShimmerAnimation({ config }: AnimationProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 3 / config.speed,
          repeat: Infinity,
          repeatDelay: 2 / config.speed,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// Neon glow effects
function NeonAnimation({ config }: AnimationProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        animate={{
          opacity: [0.3, 0.8 * config.intensity, 0.3],
          scaleX: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2 / config.speed,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        animate={{
          opacity: [0.3, 0.8 * config.intensity, 0.3],
          scaleX: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2 / config.speed,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1 / config.speed,
        }}
      />
      {/* Corner glows */}
      {[
        { top: 0, left: 0 },
        { top: 0, right: 0 },
        { bottom: 0, left: 0 },
        { bottom: 0, right: 0 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20 blur-2xl"
          style={{ ...pos, width: 20 * config.intensity, height: 20 * config.intensity }}
          animate={{
            opacity: [0.2, 0.5 * config.intensity, 0.2],
            scale: [1, 1.3 * config.intensity, 1],
          }}
          transition={{
            duration: 3 / config.speed,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
