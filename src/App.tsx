import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AnimatedRoutes } from "./components/AnimatedRoutes";
import { SkipLink } from "./components/accessibility/SkipLink";
import { KeyboardShortcutsHelp } from "./components/accessibility/KeyboardShortcuts";
import { FocusVisibilityManager } from "./components/accessibility/FocusRing";
import { LoadingScreen } from "./components/LoadingScreen";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content after a brief delay to ensure smooth transition
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FocusVisibilityManager />
        <Toaster />
        <Sonner />
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
        <BrowserRouter>
          {showContent && (
            <>
              <SkipLink />
              <KeyboardShortcutsHelp />
              <AnimatedRoutes />
            </>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
