import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, QrCode, Share2, Pencil, Plus, BarChart3, Eye } from "lucide-react";

const steps = [
  {
    id: "create",
    icon: Plus,
    title: "Create links",
    description: "Add your important links",
    content: (
      <div className="space-y-2.5">
        {[
          { label: "My Portfolio", url: "portfolio.com" },
          { label: "YouTube Channel", url: "youtube.com/@you" },
          { label: "Shop", url: "shop.example.com" },
        ].map((link, i) => (
          <motion.div
            key={link.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.12 }}
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/10 border border-white/10"
          >
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
              <Link2 className="w-3.5 h-3.5 text-white/70" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{link.label}</p>
              <p className="text-white/40 text-[10px] truncate">{link.url}</p>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
              className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center flex-shrink-0"
            >
              <span className="text-emerald-300 text-[10px]">✓</span>
            </motion.div>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-dashed border-white/20 text-white/30 text-xs cursor-pointer hover:text-white/50 hover:border-white/30 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add another link
        </motion.div>
      </div>
    ),
  },
  {
    id: "edit",
    icon: Pencil,
    title: "Customize",
    description: "Style your profile",
    content: (
      <div className="space-y-3">
        {/* Theme selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Theme</p>
          <div className="flex gap-2">
            {[
              "from-violet-500 to-pink-500",
              "from-emerald-500 to-teal-500",
              "from-blue-500 to-indigo-500",
              "from-orange-500 to-red-500",
            ].map((g, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.08, type: "spring" }}
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${g} ${i === 0 ? "ring-2 ring-white/50 ring-offset-2 ring-offset-transparent" : ""} cursor-pointer hover:scale-110 transition-transform`}
              />
            ))}
          </div>
        </motion.div>

        {/* Font */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Font style</p>
          <div className="flex gap-2">
            {["Modern", "Classic", "Bold"].map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium ${i === 0 ? "bg-white/20 text-white" : "bg-white/5 text-white/50"}`}
              >
                {f}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10"
        >
          <span className="text-white/60 text-xs">Show social icons</span>
          <div className="w-9 h-5 rounded-full bg-emerald-500/60 flex items-center justify-end px-0.5">
            <motion.div
              layoutId="toggle"
              className="w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    id: "share",
    icon: Share2,
    title: "Share & track",
    description: "QR codes & analytics",
    content: (
      <div className="space-y-3">
        {/* QR Code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="flex justify-center"
        >
          <div className="w-28 h-28 bg-white rounded-2xl p-2 shadow-lg">
            <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-0.5">
              {Array.from({ length: 25 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.02 }}
                  className={`rounded-sm ${
                    [0,1,2,4,5,6,10,12,14,15,16,18,19,20,24].includes(i)
                      ? "bg-gray-900"
                      : "bg-gray-100"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-3 gap-2"
        >
          {[
            { icon: Eye, value: "2.4K", label: "Views" },
            { icon: Link2, value: "847", label: "Clicks" },
            { icon: BarChart3, value: "35%", label: "CTR" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="text-center p-2 rounded-xl bg-white/5 border border-white/10"
            >
              <stat.icon className="w-3.5 h-3.5 text-white/40 mx-auto mb-1" />
              <p className="text-white font-bold text-sm">{stat.value}</p>
              <p className="text-white/30 text-[9px]">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Share buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex justify-center gap-2"
        >
          {["Copy Link", "Download QR"].map((label, i) => (
            <div
              key={label}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-medium ${
                i === 0
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/50 border border-white/10"
              }`}
            >
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    ),
  },
];

export function LoginVisual() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((s) => (s + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const step = steps[activeStep];

  return (
    <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-violet-600 to-indigo-700" />

      {/* Animated orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-72 h-72 rounded-full bg-pink-400/15 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1.1, 0.9, 1.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-violet-300/15 blur-3xl"
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10 flex flex-col items-center px-8 max-w-sm w-full"
      >
        {/* Step indicators */}
        <div className="flex gap-3 mb-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.button
                key={s.id}
                onClick={() => setActiveStep(i)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                  i === activeStep
                    ? "bg-white/20 text-white border border-white/30"
                    : "bg-white/5 text-white/40 border border-transparent hover:bg-white/10"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {s.title}
              </motion.button>
            );
          })}
        </div>

        {/* Card */}
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-full"
        >
          <div className="w-full rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 p-6 shadow-2xl">
            {/* Card header */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-white/80" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{step.title}</h3>
                    <p className="text-white/40 text-xs">{step.description}</p>
                  </div>
                </div>

                {/* Step content */}
                {step.content}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mt-6 w-full max-w-[200px]">
          {steps.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden"
            >
              <motion.div
                className="h-full bg-white/60 rounded-full"
                initial={{ width: "0%" }}
                animate={{
                  width: i === activeStep ? "100%" : i < activeStep ? "100%" : "0%",
                }}
                transition={{
                  duration: i === activeStep ? 4 : 0.3,
                  ease: i === activeStep ? "linear" : "easeOut",
                }}
              />
            </div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/30 text-xs mt-5 text-center"
        >
          Create · Customize · Share · Track
        </motion.p>
      </motion.div>
    </div>
  );
}
