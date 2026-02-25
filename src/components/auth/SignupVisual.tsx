import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const demoProfiles = [
  {
    name: "@creator",
    title: "Digital creator & artist",
    links: ["My Portfolio", "Latest Video", "Shop Merch", "Tip Jar"],
    gradient: "from-violet-500/60 to-pink-500/60",
    bgGradient: "from-violet-500/20 to-pink-500/30",
    avatar: "🎨",
  },
  {
    name: "@musicprod",
    title: "Music producer · LA",
    links: ["New Album", "Spotify", "Book a Session", "Beats Store"],
    gradient: "from-rose-500/60 to-orange-500/60",
    bgGradient: "from-rose-500/20 to-orange-500/30",
    avatar: "🎵",
  },
  {
    name: "@fitcoach",
    title: "Fitness coach & nutritionist",
    links: ["Workout Plans", "1:1 Coaching", "YouTube", "Free Guide"],
    gradient: "from-emerald-500/60 to-teal-500/60",
    bgGradient: "from-emerald-500/20 to-teal-500/30",
    avatar: "💪",
  },
  {
    name: "@designer",
    title: "UI/UX designer · Freelance",
    links: ["Dribbble", "Case Studies", "Hire Me", "Newsletter"],
    gradient: "from-blue-500/60 to-indigo-500/60",
    bgGradient: "from-blue-500/20 to-indigo-500/30",
    avatar: "✏️",
  },
];

export function SignupVisual() {
  const [activeProfile, setActiveProfile] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProfile((p) => (p + 1) % demoProfiles.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const profile = demoProfiles[activeProfile];

  return (
    <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700" />

      {/* Animated orbs */}
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 25, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 left-16 w-64 h-64 rounded-full bg-emerald-300/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, -30, 0], scale: [1.1, 0.9, 1.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-16 right-16 w-96 h-96 rounded-full bg-teal-300/15 blur-3xl"
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 flex flex-col items-center px-8"
      >
        {/* Heading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/50 text-sm font-medium tracking-wider uppercase mb-6"
        >
          Profiles for every creator
        </motion.p>

        {/* Phone mockup with rotating profiles */}
        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* Phone frame */}
          <div className="w-[240px] h-[480px] rounded-[36px] bg-white/10 backdrop-blur-xl p-2.5 shadow-2xl border border-white/20">
            <div className="w-full h-full rounded-[28px] overflow-hidden relative">
              {/* BG gradient */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProfile}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`absolute inset-0 bg-gradient-to-b ${profile.bgGradient}`}
                />
              </AnimatePresence>

              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black/30 rounded-b-xl z-10" />

              {/* Profile content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProfile}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="pt-10 px-5 text-center"
                >
                  {/* Avatar */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${profile.gradient} mb-3 flex items-center justify-center text-2xl shadow-lg`}
                  >
                    {profile.avatar}
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-white font-bold text-sm"
                  >
                    {profile.name}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-white/50 text-xs mt-0.5 mb-5"
                  >
                    {profile.title}
                  </motion.p>

                  {/* Links */}
                  <div className="space-y-2">
                    {profile.links.map((link, i) => (
                      <motion.div
                        key={link}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.07 }}
                        className="w-full py-2.5 px-3 rounded-xl bg-white/15 backdrop-blur text-white/80 text-xs font-medium"
                      >
                        {link}
                      </motion.div>
                    ))}
                  </div>

                  {/* Social row */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="flex justify-center gap-3 mt-4"
                  >
                    {["🐦", "📸", "🎬", "🔗"].map((icon, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.05, type: "spring" }}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs"
                      >
                        {icon}
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [-6, 6, -6], x: [0, 3, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-12 top-16 bg-white/15 backdrop-blur-xl rounded-xl px-3 py-2 border border-white/20"
          >
            <span className="text-white text-xs font-medium">⚡ NFC Ready</span>
          </motion.div>
          <motion.div
            animate={{ y: [6, -6, 6], x: [0, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -left-14 top-1/2 bg-white/15 backdrop-blur-xl rounded-xl px-3 py-2 border border-white/20"
          >
            <span className="text-white text-xs font-medium">📊 Analytics</span>
          </motion.div>
          <motion.div
            animate={{ y: [-4, 8, -4] }}
            transition={{ duration: 3.5, repeat: Infinity }}
            className="absolute -right-10 bottom-24 bg-white/15 backdrop-blur-xl rounded-xl px-3 py-2 border border-white/20"
          >
            <span className="text-white text-xs font-medium">🎨 Themes</span>
          </motion.div>
        </motion.div>

        {/* Profile dots */}
        <div className="flex gap-2 mt-6">
          {demoProfiles.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveProfile(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeProfile
                  ? "bg-white w-6"
                  : "bg-white/30 w-2 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/40 text-xs mt-6 text-center max-w-[200px]"
        >
          Swipe through creator profiles. Yours could be next.
        </motion.p>
      </motion.div>
    </div>
  );
}
