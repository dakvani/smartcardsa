import { motion } from "framer-motion";

// Animated Card Graphics - floating credit card with NFC waves
export function CardAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* NFC Waves */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-24 h-24 border-2 border-white/30 rounded-full"
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut",
          }}
        />
      ))}
      
      {/* Credit Card */}
      <motion.div
        className="relative w-28 h-18 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl"
        animate={{ 
          rotateY: [0, 10, -10, 0],
          y: [0, -5, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Chip */}
        <div className="absolute top-3 left-3 w-6 h-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-sm" />
        
        {/* Lines */}
        <div className="absolute bottom-4 left-3 right-3 space-y-1">
          <div className="h-1.5 bg-white/40 rounded-full w-3/4" />
          <div className="h-1 bg-white/30 rounded-full w-1/2" />
        </div>
        
        {/* NFC Symbol */}
        <motion.div
          className="absolute top-2 right-2"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg className="w-5 h-5 text-white/60" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-4h2v2h-2zm0-2h2V7h-2z" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Animated Sticker Graphics - peeling sticker effect
export function StickerAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Sparkles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
      
      {/* Sticker */}
      <motion.div
        className="relative"
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl flex items-center justify-center"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* QR Code Pattern */}
          <div className="grid grid-cols-4 gap-1 p-2">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className={`w-3 h-3 rounded-sm ${i % 3 === 0 ? 'bg-white/80' : 'bg-white/40'}`}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Peel Effect */}
        <motion.div
          className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-tl-2xl"
          animate={{ 
            rotate: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: "bottom left" }}
        />
      </motion.div>
    </div>
  );
}

// Animated Band Graphics - rotating wristband
export function BandAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Pulse ring */}
      <motion.div
        className="absolute w-32 h-32 border-2 border-white/20 rounded-full"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Wristband */}
      <motion.div
        className="relative"
        animate={{ rotateX: [0, 15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ perspective: "500px" }}
      >
        <motion.div
          className="w-32 h-12 bg-gradient-to-r from-white/30 via-white/50 to-white/30 rounded-full border-2 border-white/40 shadow-xl relative overflow-hidden"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Band texture */}
          <div className="absolute inset-0 flex items-center justify-center gap-1">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="w-0.5 h-6 bg-white/40 rounded-full"
                animate={{ scaleY: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
          
          {/* NFC chip indicator */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-6 bg-gradient-to-br from-emerald-300 to-green-500 rounded-md"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

// Animated Keychain Graphics - swinging keychain
export function KeychainAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center pt-8">
      {/* Keyring */}
      <div className="absolute top-4 w-8 h-8 border-4 border-white/40 rounded-full" />
      
      {/* Chain */}
      <motion.div
        className="relative"
        animate={{ rotate: [-15, 15, -15] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "top center" }}
      >
        {/* Chain links */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-white/40 to-white/60" />
        
        {/* Keychain body */}
        <motion.div
          className="w-20 h-28 bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl flex flex-col items-center justify-center gap-2 p-3"
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Logo area */}
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-white font-bold text-lg">NFC</span>
          </motion.div>
          
          {/* Tap indicator */}
          <motion.div
            className="text-white/60 text-xs font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            TAP ME
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Animated Review Card Graphics - stars and ratings
export function ReviewCardAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Floating stars */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${15 + i * 17}%`,
            top: `${20 + (i % 2) * 10}%`,
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.div>
      ))}
      
      {/* Review card */}
      <motion.div
        className="relative w-28 h-20 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-xl p-3"
        animate={{ 
          y: [0, -5, 0],
          rotateZ: [-2, 2, -2],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Star rating */}
        <div className="flex gap-0.5 mb-2">
          {[...Array(5)].map((_, i) => (
            <motion.svg
              key={i}
              className="w-4 h-4 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 24 24"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity, repeatDelay: 2 }}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </motion.svg>
          ))}
        </div>
        
        {/* Review text lines */}
        <div className="space-y-1">
          <motion.div 
            className="h-1.5 bg-white/50 rounded-full w-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div 
            className="h-1.5 bg-white/40 rounded-full w-3/4"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
        </div>
        
        {/* Google logo hint */}
        <motion.div
          className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs font-bold bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">G</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Export all animations mapped by category
export const productAnimations = {
  card: CardAnimation,
  sticker: StickerAnimation,
  band: BandAnimation,
  keychain: KeychainAnimation,
  review: ReviewCardAnimation,
};
