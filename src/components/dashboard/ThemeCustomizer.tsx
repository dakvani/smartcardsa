import { useState } from "react";
import { Palette, ChevronDown, ChevronUp } from "lucide-react";

interface ThemeCustomizerProps {
  themeName: string;
  themeGradient: string;
  customBgColor: string | null;
  customAccentColor: string | null;
  gradientDirection: string;
  onUpdate: (updates: {
    theme_name?: string;
    theme_gradient?: string;
    custom_bg_color?: string | null;
    custom_accent_color?: string | null;
    gradient_direction?: string;
  }) => void;
}

const presetThemes = [
  { name: "Midnight", gradient: "from-indigo-900 via-purple-900 to-pink-900", colors: ["#312e81", "#581c87", "#831843"] },
  { name: "Sunset", gradient: "from-orange-500 via-pink-500 to-purple-600", colors: ["#f97316", "#ec4899", "#9333ea"] },
  { name: "Ocean", gradient: "from-cyan-500 via-blue-500 to-indigo-600", colors: ["#06b6d4", "#3b82f6", "#4f46e5"] },
  { name: "Forest", gradient: "from-green-600 via-emerald-500 to-teal-500", colors: ["#16a34a", "#10b981", "#14b8a6"] },
  { name: "Minimal", gradient: "from-gray-100 via-gray-200 to-gray-300", colors: ["#f3f4f6", "#e5e7eb", "#d1d5db"] },
  { name: "Rose Gold", gradient: "from-rose-400 via-pink-300 to-amber-200", colors: ["#fb7185", "#f9a8d4", "#fde68a"] },
  { name: "Northern Lights", gradient: "from-green-400 via-cyan-500 to-purple-600", colors: ["#4ade80", "#06b6d4", "#9333ea"] },
  { name: "Coral Reef", gradient: "from-red-400 via-orange-300 to-yellow-200", colors: ["#f87171", "#fdba74", "#fef08a"] },
  { name: "Lavender Dream", gradient: "from-purple-300 via-pink-200 to-indigo-300", colors: ["#c4b5fd", "#fbcfe8", "#a5b4fc"] },
  { name: "Deep Space", gradient: "from-slate-900 via-purple-900 to-slate-900", colors: ["#0f172a", "#581c87", "#0f172a"] },
  { name: "Autumn", gradient: "from-amber-600 via-orange-500 to-red-600", colors: ["#d97706", "#f97316", "#dc2626"] },
  { name: "Ice", gradient: "from-blue-100 via-cyan-100 to-teal-100", colors: ["#dbeafe", "#cffafe", "#ccfbf1"] },
];

const gradientDirections = [
  { value: "to-b", label: "↓ Top to Bottom" },
  { value: "to-t", label: "↑ Bottom to Top" },
  { value: "to-r", label: "→ Left to Right" },
  { value: "to-l", label: "← Right to Left" },
  { value: "to-br", label: "↘ Diagonal" },
  { value: "to-tl", label: "↖ Diagonal Up" },
];

export function ThemeCustomizer({
  themeName,
  themeGradient,
  customBgColor,
  customAccentColor,
  gradientDirection,
  onUpdate,
}: ThemeCustomizerProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCustom, setIsCustom] = useState(themeName === "Custom");

  const handlePresetSelect = (theme: typeof presetThemes[0]) => {
    setIsCustom(false);
    onUpdate({
      theme_name: theme.name,
      theme_gradient: theme.gradient,
      custom_bg_color: null,
      custom_accent_color: null,
    });
  };

  const handleCustomColorChange = (type: "bg" | "accent", color: string) => {
    setIsCustom(true);
    if (type === "bg") {
      onUpdate({
        theme_name: "Custom",
        custom_bg_color: color,
      });
    } else {
      onUpdate({
        theme_name: "Custom",
        custom_accent_color: color,
      });
    }
  };

  const handleDirectionChange = (direction: string) => {
    // Update gradient direction
    const currentGradient = themeGradient;
    const gradientWithoutDirection = currentGradient.replace(/to-[a-z]+/, "");
    const newGradient = `${gradientWithoutDirection.replace("from-", `${direction} from-`)}`.replace(/\s+/g, " ").trim();
    
    onUpdate({
      gradient_direction: direction,
      theme_gradient: themeGradient.includes("to-") 
        ? themeGradient.replace(/to-[a-z]+/, direction)
        : `${direction} ${themeGradient}`,
    });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">Theme</label>
      
      {/* Preset Themes Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {presetThemes.map(theme => (
          <button
            key={theme.name}
            onClick={() => handlePresetSelect(theme)}
            className={`aspect-square rounded-xl bg-gradient-to-b ${theme.gradient} transition-all relative group ${
              themeName === theme.name && !isCustom
                ? "ring-2 ring-primary ring-offset-2"
                : "hover:scale-105"
            }`}
            title={theme.name}
          >
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-xl transition-opacity text-white text-xs font-medium">
              {theme.name}
            </span>
          </button>
        ))}
      </div>

      {/* Advanced Options Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Palette className="w-4 h-4" />
        <span>Custom Colors</span>
        {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showAdvanced && (
        <div className="space-y-4 p-4 bg-secondary/50 rounded-xl">
          {/* Custom Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-2">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customBgColor || "#1e1b4b"}
                  onChange={(e) => handleCustomColorChange("bg", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-input cursor-pointer"
                />
                <input
                  type="text"
                  value={customBgColor || ""}
                  onChange={(e) => handleCustomColorChange("bg", e.target.value)}
                  placeholder="#1e1b4b"
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-background"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-2">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customAccentColor || "#8b5cf6"}
                  onChange={(e) => handleCustomColorChange("accent", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-input cursor-pointer"
                />
                <input
                  type="text"
                  value={customAccentColor || ""}
                  onChange={(e) => handleCustomColorChange("accent", e.target.value)}
                  placeholder="#8b5cf6"
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-background"
                />
              </div>
            </div>
          </div>

          {/* Gradient Direction */}
          <div>
            <label className="block text-xs text-muted-foreground mb-2">Gradient Direction</label>
            <div className="grid grid-cols-3 gap-2">
              {gradientDirections.map(dir => (
                <button
                  key={dir.value}
                  onClick={() => handleDirectionChange(dir.value)}
                  className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                    gradientDirection === dir.value || themeGradient.includes(dir.value)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input hover:border-primary/50"
                  }`}
                >
                  {dir.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {isCustom && customBgColor && (
            <div>
              <label className="block text-xs text-muted-foreground mb-2">Preview</label>
              <div
                className="h-16 rounded-xl"
                style={{
                  background: customAccentColor
                    ? `linear-gradient(to bottom, ${customBgColor}, ${customAccentColor})`
                    : customBgColor,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
