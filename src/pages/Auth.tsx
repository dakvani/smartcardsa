import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, Loader2, Shield, CheckCircle2, XCircle, Mail, AlertCircle } from "lucide-react";
import { useUsernameCheck } from "@/hooks/use-username-check";
import { VerificationSentScreen } from "@/components/auth/VerificationSentScreen";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(
    searchParams.get("signup") === "true" ? "signup" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(searchParams.get("username") || "");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { isChecking: usernameChecking, isTaken: usernameTaken, suggestions: usernameSuggestions, hasChecked: usernameHasChecked } = useUsernameCheck(mode === "signup" ? username : "");

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
    // Validate email before any action
    const emailResult = emailSchema.safeParse(email.trim());
    if (!emailResult.success) {
      setEmailError(emailResult.error.errors[0].message);
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    setEmailError("");

    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/settings`,
        });

        if (error) {
          toast.error(error.message);
        } else {
          setResetSent(true);
          toast.success("Password reset email sent! Check your inbox.");
        }
      } else if (mode === "signup") {
        if (usernameTaken) {
          toast.error("This username is already taken. Please choose a different one.");
          setLoading(false);
          return;
        }
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
          setVerificationSent(true);
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

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (error: any) {
      toast.error("Failed to sign in with Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  const switchMode = (newMode: "login" | "signup" | "forgot") => {
    setMode(newMode);
    setResetSent(false);
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
            {mode === "forgot" 
              ? "Reset your password" 
              : mode === "signup" 
                ? "Create your account" 
                : "Welcome back"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {mode === "forgot"
              ? "Enter your email and we'll send you a reset link."
              : mode === "signup"
                ? "Start building your SmartCard in minutes."
                : "Log in to manage your SmartCard."}
          </p>

          {mode !== "forgot" && (
            <>
              {/* Google Login Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 mb-4"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>
            </>
          )}

          {verificationSent ? (
            <VerificationSentScreen
              email={email}
              username={username}
              onBackToLogin={() => { setVerificationSent(false); switchMode("login"); }}
              onTryAgain={() => setVerificationSent(false)}
            />
          
          ) : mode === "forgot" && resetSent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">Check your email</h2>
              <p className="text-muted-foreground">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Button variant="outline" onClick={() => switchMode("login")} className="mt-4">
                Back to login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
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
                  {/* Username availability feedback */}
                  {username.trim().length >= 3 && (
                    <div className="mt-2">
                      {usernameChecking ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Checking...</span>
                        </div>
                      ) : usernameHasChecked && !usernameTaken ? (
                        <div className="flex items-center gap-2 text-sm text-green-500">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{username} is available</span>
                        </div>
                      ) : usernameHasChecked && usernameTaken ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-destructive">
                            <XCircle className="w-3 h-3" />
                            <span>{username} is taken</span>
                          </div>
                          {usernameSuggestions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              <span className="text-xs text-muted-foreground">Try:</span>
                              {usernameSuggestions.map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setUsername(s)}
                                  className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  placeholder="you@example.com"
                  className={`w-full h-12 px-4 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-ring ${emailError ? 'border-destructive' : 'border-input'}`}
                  required
                />
                {emailError && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-sm text-destructive">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{emailError}</span>
                  </div>
                )}
              </div>

              {mode !== "forgot" && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Password</label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => switchMode("forgot")}
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
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
              )}

              <Button type="submit" variant="gradient" className="w-full h-12" disabled={loading || (mode === "signup" && (usernameTaken || usernameChecking))}>
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : mode === "forgot" ? (
                  "Send reset link"
                ) : mode === "signup" ? (
                  "Create account"
                ) : (
                  "Log in"
                )}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "forgot" ? (
              <>
                Remember your password?{" "}
                <button
                  onClick={() => switchMode("login")}
                  className="text-primary font-medium hover:underline"
                >
                  Back to login
                </button>
              </>
            ) : mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => switchMode("login")}
                  className="text-primary font-medium hover:underline"
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => switchMode("signup")}
                  className="text-primary font-medium hover:underline"
                >
                  Sign up
                </button>
              </>
            )}
          </p>

          {mode !== "forgot" && (
            <div className="mt-8 pt-6 border-t border-border">
              <Link
                to="/admin-login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Shield className="w-4 h-4" />
                Admin Login
              </Link>
            </div>
          )}
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
