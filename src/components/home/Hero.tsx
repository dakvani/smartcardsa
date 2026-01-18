import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      navigate(`/auth?signup=true&username=${encodeURIComponent(username.trim())}`);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/50 via-background to-background" />
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [-20, 20, -20], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[10%] w-64 h-64 rounded-full gradient-primary opacity-10 blur-3xl"
        />
        <motion.div
          animate={{ y: [20, -20, 20], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-[10%] w-80 h-80 rounded-full gradient-secondary opacity-10 blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Trusted by 30M+ creators worldwide</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance"
          >
            Everything you are.{" "}
            <span className="gradient-text">In one simple link.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Join millions of creators using SmartCard for their link in bio. One link to help you share everything you create, curate, and sell.
          </motion.p>

          {/* Claim Input */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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
                className="w-full h-14 pl-[156px] pr-4 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button type="submit" variant="hero" className="w-full sm:w-auto">
              Claim your SmartCard
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.form>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 flex flex-col items-center"
          >
            <p className="text-sm text-muted-foreground mb-4">Trusted by creators at</p>
            <div className="flex items-center gap-8 opacity-50">
              {["TikTok", "Instagram", "YouTube", "Spotify", "Twitch"].map((brand) => (
                <span key={brand} className="text-lg font-semibold">{brand}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 flex justify-center"
        >
          <div className="relative">
            {/* Phone frame */}
            <div className="w-[280px] h-[580px] rounded-[40px] bg-foreground p-3 shadow-elevated">
              <div className="w-full h-full rounded-[32px] bg-gradient-to-b from-purple-900 to-pink-900 overflow-hidden relative">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground rounded-b-2xl" />
                
                {/* Profile content */}
                <div className="pt-12 px-6 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-pink-400 to-purple-600 mb-4" />
                  <h3 className="text-primary-foreground font-bold text-lg">@creator</h3>
                  <p className="text-primary-foreground/70 text-sm mt-1">Digital creator & artist</p>
                  
                  {/* Links */}
                  <div className="mt-6 space-y-3">
                    {["My Portfolio", "Latest Video", "Shop Merch", "Tip Jar"].map((link, i) => (
                      <motion.div
                        key={link}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="w-full py-3 px-4 rounded-xl bg-primary-foreground/20 backdrop-blur text-primary-foreground text-sm font-medium"
                      >
                        {link}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Glow effect */}
            <div className="absolute -inset-4 gradient-primary opacity-20 blur-3xl -z-10 rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
