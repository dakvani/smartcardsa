import { motion } from "framer-motion";

export function AuthVisual() {
  return (
    <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-purple-600 to-pink-600" />
      
      {/* Animated orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-72 h-72 rounded-full bg-pink-400/30 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1.1, 0.9, 1.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-violet-400/30 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-blue-400/20 blur-3xl"
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 text-center px-12 max-w-lg"
      >
        {/* Phone mockup */}
        <div className="mx-auto mb-8 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="w-[220px] h-[450px] mx-auto rounded-[36px] bg-white/10 backdrop-blur-xl border border-white/20 p-2 shadow-2xl"
          >
            <div className="w-full h-full rounded-[30px] bg-gradient-to-b from-white/15 to-white/5 overflow-hidden relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black/30 rounded-b-xl" />
              <div className="pt-12 px-4 text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur mb-3"
                />
                <div className="h-3 w-16 mx-auto bg-white/30 rounded-full mb-1.5" />
                <div className="h-2 w-24 mx-auto bg-white/15 rounded-full mb-6" />
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.15 }}
                    className="w-full py-3 px-3 rounded-lg bg-white/15 backdrop-blur text-white/80 font-medium text-[10px] mb-2"
                  >
                    Link {i}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-4 top-12 bg-white/15 backdrop-blur-xl rounded-xl px-3 py-2 border border-white/20"
          >
            <span className="text-white text-xs font-medium">⚡ NFC Ready</span>
          </motion.div>
          <motion.div
            animate={{ y: [8, -8, 8] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -left-4 bottom-24 bg-white/15 backdrop-blur-xl rounded-xl px-3 py-2 border border-white/20"
          >
            <span className="text-white text-xs font-medium">📊 Analytics</span>
          </motion.div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">
          Your Digital Identity,
          <br />
          <span className="text-white/80">Reimagined</span>
        </h2>
        <p className="text-white/60 text-sm leading-relaxed">
          Create a stunning smart profile. Share it with a tap. Track every interaction.
        </p>
      </motion.div>
    </div>
  );
}
