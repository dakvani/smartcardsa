import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Shield, ExternalLink } from "lucide-react";

function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export default function Auth() {
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const inIframe = useMemo(() => isInIframe(), []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    if (inIframe) {
      window.open(`${window.location.origin}/auth`, "_blank", "noopener,noreferrer");
      toast.info("Complete sign-in in the new tab that just opened.");
      return;
    }
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result?.error) {
        toast.error(result.error.message || "Failed to sign in with Google");
      }
    } catch {
      toast.error("Failed to sign in with Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    if (inIframe) {
      window.open(`${window.location.origin}/auth`, "_blank", "noopener,noreferrer");
      toast.info("Complete sign-in in the new tab that just opened.");
      return;
    }
    setAppleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: window.location.origin,
      });
      if (result?.error) {
        toast.error(result.error.message || "Failed to sign in with Apple");
      }
    } catch {
      toast.error("Failed to sign in with Apple");
    } finally {
      setAppleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Social Auth */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-10 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-2xl tracking-tight">SmartCard</span>
          </div>

          <h1 className="text-3xl font-bold mb-2 tracking-tight">Get started</h1>
          <p className="text-muted-foreground mb-10 text-[15px] leading-relaxed">
            Sign in or create your account instantly using your social profile. No passwords needed.
          </p>

          {inIframe && (
            <a
              href={window.location.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full mb-4 px-4 py-3 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open in new tab for best experience
            </a>
          )}

          <div className="space-y-3">
            {/* Google */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-14 text-[15px] font-medium rounded-xl border-border/60 hover:border-foreground/20 hover:bg-accent/50 transition-all"
              onClick={handleGoogleLogin}
              disabled={googleLoading || appleLoading}
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-3" />
              ) : (
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Continue with Google
            </Button>

            {/* Apple */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-14 text-[15px] font-medium rounded-xl border-border/60 hover:border-foreground/20 hover:bg-accent/50 transition-all"
              onClick={handleAppleLogin}
              disabled={googleLoading || appleLoading}
            >
              {appleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-3" />
              ) : (
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              )}
              Continue with Apple
            </Button>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>

          <div className="mt-10 pt-6 border-t border-border/40">
            <Link
              to="/admin-login"
              className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Login
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center gradient-dark p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="w-[280px] h-[580px] rounded-[40px] bg-primary-foreground/10 backdrop-blur p-2.5 shadow-elevated">
            <div className="w-full h-full rounded-[34px] bg-gradient-to-b from-violet-600 to-pink-600 overflow-hidden relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground rounded-b-2xl" />
              <div className="pt-14 px-5 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary-foreground/20 backdrop-blur mb-3 animate-pulse" />
                <div className="h-3.5 w-20 mx-auto bg-primary-foreground/40 rounded-full mb-1.5" />
                <div className="h-2.5 w-28 mx-auto bg-primary-foreground/20 rounded-full mb-7" />
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="w-full py-3.5 px-4 rounded-xl bg-primary-foreground/20 backdrop-blur text-primary-foreground font-medium text-xs mb-2.5"
                  >
                    Link {i}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-6 top-16 w-16 h-16 rounded-2xl gradient-primary opacity-50 blur-xl"
          />
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -left-6 bottom-28 w-20 h-20 rounded-2xl gradient-secondary opacity-50 blur-xl"
          />
        </motion.div>
      </div>
    </div>
  );
}
