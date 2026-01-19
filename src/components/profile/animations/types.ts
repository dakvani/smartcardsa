export interface AnimationConfig {
  speed: number; // 0.5 to 2 (multiplier)
  intensity: number; // 0.5 to 2 (multiplier)
}

export interface AnimatedBackgroundProps {
  animationType: string | null;
  config?: AnimationConfig;
}

export const defaultConfig: AnimationConfig = {
  speed: 1,
  intensity: 1,
};
