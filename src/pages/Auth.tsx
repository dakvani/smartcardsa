import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("signup") === "true");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(searchParams.get("username") || "");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              username: username.toLowerCase().replace(/[^a-z0-9-_]/g, ''),
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Please log in instead.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Account created! You can now access your dashboard.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login")) {
            toast.error("Invalid email or password. Please try again.");
          } else {
            toast.error(error.message);
          }
        }
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-2xl">SmartCard</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isSignUp
              ? "Start building your SmartCard in minutes."
              : "Log in to manage your SmartCard."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    smartcard.online/
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                    placeholder="yourname"
                    className="w-full h-12 pl-[140px] pr-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 pr-12 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="gradient" className="w-full h-12" disabled={loading}>
              {loading ? "Loading..." : isSignUp ? "Create account" : "Log in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary font-medium hover:underline"
            >
              {isSignUp ? "Log in" : "Sign up"}
            </button>
          </p>
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
          {/* Phone mockup */}
          <div className="w-[300px] h-[620px] rounded-[44px] bg-primary-foreground/10 backdrop-blur p-3 shadow-elevated">
            <div className="w-full h-full rounded-[36px] bg-gradient-to-b from-violet-600 to-pink-600 overflow-hidden relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-foreground rounded-b-3xl" />
              
              <div className="pt-16 px-6 text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-primary-foreground/20 backdrop-blur mb-4 animate-pulse" />
                <div className="h-4 w-24 mx-auto bg-primary-foreground/40 rounded-full mb-2" />
                <div className="h-3 w-32 mx-auto bg-primary-foreground/20 rounded-full mb-8" />
                
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="w-full py-4 px-4 rounded-2xl bg-primary-foreground/20 backdrop-blur text-primary-foreground font-medium text-sm mb-3"
                  >
                    Link {i}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-8 top-20 w-20 h-20 rounded-2xl gradient-primary opacity-60 blur-xl"
          />
          <motion.div
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -left-8 bottom-32 w-24 h-24 rounded-2xl gradient-secondary opacity-60 blur-xl"
          />
        </motion.div>
      </div>
    </div>
  );
}
