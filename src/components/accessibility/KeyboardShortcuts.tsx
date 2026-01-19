import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Command, X } from "lucide-react";

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  modifier?: "ctrl" | "alt" | "shift" | "meta";
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);

  const shortcuts: Shortcut[] = [
    { key: "h", description: "Go to Home", action: () => navigate("/"), modifier: "alt" },
    { key: "d", description: "Go to Dashboard", action: () => navigate("/dashboard"), modifier: "alt" },
    { key: "p", description: "Go to Products", action: () => navigate("/nfc-products"), modifier: "alt" },
    { key: "s", description: "Go to Settings", action: () => navigate("/settings"), modifier: "alt" },
    { key: "t", description: "Go to Templates", action: () => navigate("/templates"), modifier: "alt" },
    { key: "/", description: "Show keyboard shortcuts", action: () => setShowHelp(true) },
    { key: "Escape", description: "Close dialogs", action: () => setShowHelp(false) },
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in inputs
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement ||
      (event.target as HTMLElement)?.isContentEditable
    ) {
      return;
    }

    for (const shortcut of shortcuts) {
      const modifierMatch = 
        (!shortcut.modifier) ||
        (shortcut.modifier === "ctrl" && (event.ctrlKey || event.metaKey)) ||
        (shortcut.modifier === "alt" && event.altKey) ||
        (shortcut.modifier === "shift" && event.shiftKey) ||
        (shortcut.modifier === "meta" && event.metaKey);

      if (event.key === shortcut.key && modifierMatch) {
        event.preventDefault();
        shortcut.action();
        break;
      }
    }
  }, [navigate, shortcuts]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { showHelp, setShowHelp, shortcuts };
}

export function KeyboardShortcutsHelp() {
  const { showHelp, setShowHelp, shortcuts } = useKeyboardShortcuts();

  return (
    <AnimatePresence>
      {showHelp && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHelp(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Command className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-1 rounded-md hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Shortcuts list */}
              <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
                {shortcuts.filter(s => s.key !== "Escape").map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-muted-foreground">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.modifier && (
                        <>
                          <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border border-border">
                            {shortcut.modifier === "alt" ? "Alt" : shortcut.modifier === "ctrl" ? "Ctrl" : shortcut.modifier}
                          </kbd>
                          <span className="text-muted-foreground">+</span>
                        </>
                      )}
                      <kbd className="px-2 py-1 text-xs font-mono bg-muted rounded border border-border">
                        {shortcut.key === "/" ? "/" : shortcut.key.toUpperCase()}
                      </kbd>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Footer */}
              <div className="px-6 py-3 bg-muted/30 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded border border-border">Esc</kbd> to close
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
