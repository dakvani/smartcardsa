import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);
  const contentScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      navigate(`/auth?signup=true&username=${encodeURIComponent(username.trim())}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Dark gradient background with blur */}
      <motion.div 
        className="absolute inset-0 gradient-dark"
        style={{ y: backgroundY }}
      />
      
      {/* Faded blurry orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [-30, 30, -30], rotate: [0, 8, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[5%] w-96 h-96 rounded-full bg-primary/10 blur-[100px]"
        />
        <motion.div
          animate={{ y: [30, -30, 30], rotate: [0, -8, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-[5%] w-[500px] h-[500px] rounded-full bg-accent/15 blur-[120px]"
        />
        <motion.div
          animate={{ x: [-20, 20, -20], y: [20, -20, 20] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-muted/10 blur-[150px]"
        />
      </div>

      <motion.div 
        className="container mx-auto px-4 relative z-10"
        style={{ opacity: contentOpacity, scale: contentScale }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-8 text-foreground/80"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Trusted by 30M+ creators worldwide</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance text-foreground/95"
          >
            Everything you are.{" "}
            <span className="gradient-text">In one simple link.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Join millions of creators using SmartCard for their link in bio. One link to help you share everything you create, curate, and sell.
          </motion.p>

          {/* Claim Input */}
          <motion.form
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.3 }}
            onSubmit={handleClaim}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto"
          >
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="text-muted-foreground font-medium">smartcard.online/</span>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                placeholder="yourname"
                className="w-full h-14 pl-[156px] pr-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary/30 transition-all"
              />
            </div>
            <Button type="submit" variant="hero" className="w-full sm:w-auto shadow-glow">
              Claim your SmartCard
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.form>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 flex flex-col items-center"
          >
            <p className="text-sm text-muted-foreground mb-4">Trusted by creators at</p>
            <div className="flex items-center gap-8 text-muted-foreground/40">
              {["TikTok", "Instagram", "YouTube", "Spotify", "Twitch"].map((brand, index) => (
                <motion.span 
                  key={brand} 
                  className="text-lg font-semibold"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  {brand}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 80, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-20 flex justify-center"
        >
          <div className="relative">
            {/* Phone frame */}
            <motion.div 
              className="w-[280px] h-[580px] rounded-[40px] bg-card/80 backdrop-blur-xl p-3 shadow-elevated border border-border/30"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <div className="w-full h-full rounded-[32px] bg-gradient-to-b from-primary/20 to-accent/30 overflow-hidden relative backdrop-blur-sm">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-card rounded-b-2xl" />
                
                {/* Profile content */}
                <div className="pt-12 px-6 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/60 to-accent/60 mb-4 shadow-glow" />
                  <h3 className="text-foreground font-bold text-lg">@creator</h3>
                  <p className="text-muted-foreground text-sm mt-1">Digital creator & artist</p>
                  
                  {/* Links */}
                  <div className="mt-6 space-y-3">
                    {["My Portfolio", "Latest Video", "Shop Merch", "Tip Jar"].map((link, i) => (
                      <motion.div
                        key={link}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="w-full py-3 px-4 rounded-xl glass text-foreground/80 text-sm font-medium"
                      >
                        {link}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Glow effect */}
            <div className="absolute -inset-8 bg-primary/10 blur-[80px] -z-10 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
