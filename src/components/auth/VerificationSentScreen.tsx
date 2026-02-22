import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VerificationSentScreenProps {
  email: string;
  username: string;
  onBackToLogin: () => void;
  onTryAgain: () => void;
}

const COOLDOWN_SECONDS = 60;

export function VerificationSentScreen({ email, username, onBackToLogin, onTryAgain }: VerificationSentScreenProps) {
  const [cooldown, setCooldown] = useState(COOLDOWN_SECONDS);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Verification email resent! Check your inbox.");
        setCooldown(COOLDOWN_SECONDS);
      }
    } catch {
      toast.error("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  }, [email]);

  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
        <Mail className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-xl font-semibold">Confirm your email to complete signup</h2>
      <p className="text-muted-foreground">
        We've sent a confirmation link to <strong>{email}</strong>. Open the link in your email to activate your SmartCard profile.
      </p>
      <p className="text-sm text-muted-foreground">
        Your username <strong>{username}</strong> is reserved until you confirm. Check your spam folder if you don't see it.
      </p>

      <Button
        variant="gradient"
        className="w-full h-12 mt-2"
        onClick={handleResend}
        disabled={cooldown > 0 || resending}
      >
        {resending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : cooldown > 0 ? (
          `Resend in ${cooldown}s`
        ) : (
          "Resend verification email"
        )}
      </Button>

      <div className="flex gap-3 justify-center mt-4">
        <Button variant="outline" onClick={onBackToLogin}>
          Back to login
        </Button>
        <Button variant="outline" onClick={onTryAgain}>
          Try again
        </Button>
      </div>
    </div>
  );
}
