import { useEffect, useState, useCallback } from "react";
import { Moon, Sun, Monitor, Eye, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type Theme = "light" | "dark" | "system" | "high-contrast" | "protanopia" | "deuteranopia" | "tritanopia";

const themeConfig: Record<Theme, { icon: typeof Sun; label: string; category: "standard" | "accessibility" }> = {
  light: { icon: Sun, label: "Light", category: "standard" },
  dark: { icon: Moon, label: "Dark", category: "standard" },
  system: { icon: Monitor, label: "System", category: "standard" },
  "high-contrast": { icon: Eye, label: "High Contrast", category: "accessibility" },
  protanopia: { icon: Palette, label: "Protanopia", category: "accessibility" },
  deuteranopia: { icon: Palette, label: "Deuteranopia", category: "accessibility" },
  tritanopia: { icon: Palette, label: "Tritanopia", category: "accessibility" },
};

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "system";
    }
    return "system";
  });
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Check for logged in user
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
      
      // Load theme from database if user is logged in
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("theme_preference")
          .eq("user_id", user.id)
          .single();
        
        if (profile?.theme_preference) {
          setThemeState(profile.theme_preference as Theme);
          localStorage.setItem("theme", profile.theme_preference);
        }
      }
    };
    
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUserId(session?.user?.id || null);
      
      if (event === "SIGNED_IN" && session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("theme_preference")
          .eq("user_id", session.user.id)
          .single();
        
        if (profile?.theme_preference) {
          setThemeState(profile.theme_preference as Theme);
          localStorage.setItem("theme", profile.theme_preference);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (newTheme: Theme) => {
      let effectiveTheme: "light" | "dark";
      
      // Remove all theme classes
      root.classList.remove("light", "dark", "high-contrast", "protanopia", "deuteranopia", "tritanopia");
      
      if (newTheme === "system") {
        effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(effectiveTheme);
      } else if (newTheme === "high-contrast" || newTheme === "protanopia" || newTheme === "deuteranopia" || newTheme === "tritanopia") {
        // Accessibility themes - add both the base dark class and the accessibility class
        root.classList.add("dark", newTheme);
        effectiveTheme = "dark";
      } else {
        effectiveTheme = newTheme;
        root.classList.add(effectiveTheme);
      }

      setResolvedTheme(effectiveTheme);
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = useCallback(async (newTheme: Theme) => {
    setThemeState(newTheme);
    
    // Save to database if user is logged in
    if (userId) {
      const { error } = await supabase
        .from("profiles")
        .update({ theme_preference: newTheme })
        .eq("user_id", userId);
      
      if (error) {
        console.error("Failed to save theme preference:", error);
      }
    }
  }, [userId]);

  return { theme, setTheme, resolvedTheme };
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const CurrentIcon = themeConfig[theme]?.icon || Monitor;

  const standardThemes = Object.entries(themeConfig).filter(([_, config]) => config.category === "standard");
  const accessibilityThemes = Object.entries(themeConfig).filter(([_, config]) => config.category === "accessibility");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label={`Current theme: ${themeConfig[theme]?.label || theme}. Click to change theme`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <CurrentIcon className="h-5 w-5" aria-hidden="true" />
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" role="menu" aria-label="Theme options" className="w-48">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Standard</DropdownMenuLabel>
        {standardThemes.map(([key, config]) => {
          const Icon = config.icon;
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => setTheme(key as Theme)}
              role="menuitemradio"
              aria-checked={theme === key}
            >
              <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>{config.label}</span>
              {theme === key && (
                <span className="ml-auto text-xs text-primary">✓</span>
              )}
            </DropdownMenuItem>
          );
        })}
        
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Accessibility</DropdownMenuLabel>
        {accessibilityThemes.map(([key, config]) => {
          const Icon = config.icon;
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => setTheme(key as Theme)}
              role="menuitemradio"
              aria-checked={theme === key}
            >
              <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>{config.label}</span>
              {theme === key && (
                <span className="ml-auto text-xs text-primary">✓</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
