import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email({ message: "Please enter a valid email" });

interface EmailSignupProps {
  profileId: string;
}

export function EmailSignup({ profileId }: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("email_subscribers")
        .insert({
          profile_id: profileId,
          email: email.toLowerCase().trim(),
        });

      if (error) {
        if (error.code === "23505") {
          toast.error("You're already subscribed!");
        } else {
          throw error;
        }
        return;
      }

      setSubscribed(true);
      toast.success("Successfully subscribed!");
    } catch (error: any) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-primary-foreground/20 backdrop-blur">
        <Check className="w-5 h-5 text-green-400" />
        <span className="text-primary-foreground font-medium">Thanks for subscribing!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2 p-2 rounded-2xl bg-primary-foreground/20 backdrop-blur">
        <div className="flex-1 flex items-center gap-2 px-4">
          <Mail className="w-4 h-4 text-primary-foreground/70 flex-shrink-0" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 bg-transparent text-primary-foreground placeholder:text-primary-foreground/50 outline-none text-sm"
            required
            maxLength={255}
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-primary-foreground text-background hover:bg-primary-foreground/90 rounded-xl px-4"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </Button>
      </div>
    </form>
  );
}
