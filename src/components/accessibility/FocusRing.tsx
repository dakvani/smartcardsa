import { useEffect } from "react";

/**
 * Hook that adds a class to document body when user is navigating with keyboard
 * This enables showing focus rings only for keyboard users
 */
export function useFocusVisible() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-nav");
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove("keyboard-nav");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);
}

/**
 * Component that initializes focus visibility detection
 * Add this once in your app root
 */
export function FocusVisibilityManager() {
  useFocusVisible();
  return null;
}
