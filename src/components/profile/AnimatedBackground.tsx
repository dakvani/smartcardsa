import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  animationType: string | null;
}

export function AnimatedBackground({ animationType }: AnimatedBackgroundProps) {
  if (!animationType) return null;

  switch (animationType) {
    case "particles":
      return <ParticlesAnimation />;
    case "pulse":
      return <PulseAnimation />;
    case "wave":
      return <WaveAnimation />;
    case "gradient-shift":
      return <GradientShiftAnimation />;
    case "glow":
      return <GlowAnimation />;
    case "orbs":
      return <OrbsAnimation />;
    case "shimmer":
      return <ShimmerAnimation />;
    case "neon":
      return <NeonAnimation />;
    default:
      return null;
  }
}

// Floating particles like stars
function ParticlesAnimation() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2,
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
            y: [0, -20, 0],
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
function PulseAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-white/10 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// Wave motion effect
function WaveAnimation() {
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
            y: [0, -10, 0],
            scaleY: [1, 1.1, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
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
function GradientShiftAnimation() {
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
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// Glowing ring effect
function GlowAnimation() {
  return (
    <div className="absolute inset-0 flex items-start justify-center pt-12 pointer-events-none">
      <motion.div
        className="w-32 h-32 rounded-full border-2 border-white/30"
        animate={{
          boxShadow: [
            "0 0 20px rgba(255,255,255,0.2), 0 0 40px rgba(255,255,255,0.1)",
            "0 0 40px rgba(255,255,255,0.4), 0 0 80px rgba(255,255,255,0.2)",
            "0 0 20px rgba(255,255,255,0.2), 0 0 40px rgba(255,255,255,0.1)",
          ],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// Floating orbs
function OrbsAnimation() {
  const orbs = [
    { x: "10%", y: "20%", size: 100, duration: 8 },
    { x: "70%", y: "60%", size: 150, duration: 10 },
    { x: "30%", y: "70%", size: 80, duration: 7 },
    { x: "80%", y: "20%", size: 60, duration: 6 },
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
            x: [0, 30, 0, -30, 0],
            y: [0, -20, 0, 20, 0],
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
function ShimmerAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// Neon glow effects
function NeonAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scaleX: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        animate={{
          opacity: [0.3, 0.8, 0.3],
          scaleX: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
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
          className="absolute w-20 h-20 rounded-full bg-white/20 blur-2xl"
          style={pos}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
