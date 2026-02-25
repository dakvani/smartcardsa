import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Shield } from "lucide-react";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { EmailAuthForm } from "@/components/auth/EmailAuthForm";
import { AuthVisual } from "@/components/auth/AuthVisual";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) navigate("/dashboard");
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/dashboard");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }} />

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px] relative z-10"
        >
          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center shadow-lg shadow-primary/25">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl tracking-tight">SmartCard</span>
          </div>

          {/* Header */}
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold mb-1.5 tracking-tight">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-muted-foreground mb-8 text-[15px] leading-relaxed">
              {mode === "login"
                ? "Sign in to manage your smart profile and links."
                : "Get started for free. No credit card required."}
            </p>
          </motion.div>

          {/* Social Auth */}
          <SocialAuthButtons />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground tracking-wider">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email Auth */}
          <EmailAuthForm mode={mode} onToggleMode={() => setMode(mode === "login" ? "signup" : "login")} />

          {/* Terms */}
          <p className="mt-6 text-center text-[11px] text-muted-foreground leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms</a>
            {" & "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>

          {/* Admin */}
          <div className="mt-8 pt-5 border-t border-border/30">
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
      <AuthVisual />
    </div>
  );
}
