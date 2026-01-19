import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { AnimatedRoutes } from "./components/AnimatedRoutes";
import { SkipLink } from "./components/accessibility/SkipLink";
import { KeyboardShortcutsHelp } from "./components/accessibility/KeyboardShortcuts";
import { FocusVisibilityManager } from "./components/accessibility/FocusRing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FocusVisibilityManager />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SkipLink />
        <KeyboardShortcutsHelp />
        <AnimatedRoutes />
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
