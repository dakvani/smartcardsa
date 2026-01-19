import { useEffect, useState } from "react";

/**
 * Hook to detect if user prefers reduced motion
 * Returns true if user has enabled "Reduce motion" in their OS settings
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Get animation settings based on reduced motion preference
 * Use this to conditionally disable or simplify animations
 */
export function useAnimationSettings() {
  const prefersReducedMotion = useReducedMotion();

  return {
    prefersReducedMotion,
    // Transition settings
    transition: prefersReducedMotion 
      ? { duration: 0 } 
      : { duration: 0.3, ease: "easeInOut" },
    // Spring settings for framer-motion
    spring: prefersReducedMotion 
      ? { duration: 0 } 
      : { type: "spring", stiffness: 300, damping: 30 },
    // Fade animation
    fadeAnimation: prefersReducedMotion 
      ? {} 
      : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
    // Scale animation
    scaleAnimation: prefersReducedMotion 
      ? {} 
      : { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 } },
    // Slide animation
    slideAnimation: prefersReducedMotion 
      ? {} 
      : { initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 20, opacity: 0 } },
  };
}

/**
 * CSS class helper for reduced motion
 * Returns empty string if reduced motion is preferred, otherwise returns the animation class
 */
export function useAnimationClass(animationClass: string): string {
  const prefersReducedMotion = useReducedMotion();
  return prefersReducedMotion ? "" : animationClass;
}
