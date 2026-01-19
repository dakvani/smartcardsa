import { useState, useEffect } from "react";
import { Heart, Plus, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ThemePreset {
  id: string;
  user_id: string;
  name: string;
  theme_name: string;
  theme_gradient: string;
  custom_bg_color: string | null;
  custom_accent_color: string | null;
  gradient_direction: string;
  animation_type: string | null;
  animation_speed: number;
  animation_intensity: number;
  created_at: string;
}

interface CurrentTheme {
  theme_name: string;
  theme_gradient: string;
  custom_bg_color: string | null;
  custom_accent_color: string | null;
  gradient_direction: string;
  animation_type: string | null;
  animation_speed: number;
  animation_intensity: number;
}

interface FavoritePresetsProps {
  userId: string;
  currentTheme: CurrentTheme;
  onApply: (preset: Omit<CurrentTheme, never>) => void;
}

export function FavoritePresets({ userId, currentTheme, onApply }: FavoritePresetsProps) {
  const [presets, setPresets] = useState<ThemePreset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState("");

  useEffect(() => {
    loadPresets();
  }, [userId]);

  const loadPresets = async () => {
    try {
      const { data, error } = await supabase
        .from("user_theme_presets")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPresets(data || []);
    } catch (error) {
      console.error("Error loading presets:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentAsPreset = async () => {
    if (!presetName.trim()) {
      toast.error("Please enter a name for your preset");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("user_theme_presets")
        .insert({
          user_id: userId,
          name: presetName.trim(),
          theme_name: currentTheme.theme_name,
          theme_gradient: currentTheme.theme_gradient,
          custom_bg_color: currentTheme.custom_bg_color,
          custom_accent_color: currentTheme.custom_accent_color,
          gradient_direction: currentTheme.gradient_direction || "to-b",
          animation_type: currentTheme.animation_type,
          animation_speed: currentTheme.animation_speed || 1,
          animation_intensity: currentTheme.animation_intensity || 1,
        });

      if (error) throw error;

      toast.success("Theme preset saved!");
      setPresetName("");
      setShowSaveDialog(false);
      loadPresets();
    } catch (error) {
      console.error("Error saving preset:", error);
      toast.error("Failed to save preset");
    } finally {
      setSaving(false);
    }
  };

  const applyPreset = (preset: ThemePreset) => {
    onApply({
      theme_name: preset.theme_name,
      theme_gradient: preset.theme_gradient,
      custom_bg_color: preset.custom_bg_color,
      custom_accent_color: preset.custom_accent_color,
      gradient_direction: preset.gradient_direction,
      animation_type: preset.animation_type,
      animation_speed: preset.animation_speed,
      animation_intensity: preset.animation_intensity,
    });
    toast.success(`Applied "${preset.name}" preset`);
  };

  const deletePreset = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const { error } = await supabase
        .from("user_theme_presets")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setPresets(presets.filter(p => p.id !== id));
      toast.success("Preset deleted");
    } catch (error) {
      console.error("Error deleting preset:", error);
      toast.error("Failed to delete preset");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-500" />
          Saved Presets
        </label>
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <Plus className="w-3 h-3 mr-1" />
              Save Current
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Theme Preset</DialogTitle>
              <DialogDescription>
                Save your current theme and animation settings as a preset for quick access later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Preset Name</label>
                <Input
                  placeholder="e.g., My Night Theme"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  maxLength={30}
                />
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg text-sm space-y-1">
                <p><span className="text-muted-foreground">Theme:</span> {currentTheme.theme_name}</p>
                {currentTheme.animation_type && (
                  <p><span className="text-muted-foreground">Animation:</span> {currentTheme.animation_type}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={saveCurrentAsPreset} disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Preset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {presets.length === 0 ? (
        <div className="text-center py-6 text-sm text-muted-foreground bg-secondary/30 rounded-lg">
          <Heart className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>No saved presets yet</p>
          <p className="text-xs mt-1">Save your current theme to create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className="group relative p-3 rounded-xl border border-input hover:border-primary/50 transition-all text-left overflow-hidden"
            >
              {/* Preview gradient */}
              <div 
                className={`absolute inset-0 opacity-30 ${
                  preset.custom_bg_color 
                    ? '' 
                    : `bg-gradient-${preset.gradient_direction || 'to-b'} ${preset.theme_gradient}`
                }`}
                style={preset.custom_bg_color ? {
                  background: preset.custom_accent_color
                    ? `linear-gradient(to bottom, ${preset.custom_bg_color}, ${preset.custom_accent_color})`
                    : preset.custom_bg_color,
                } : undefined}
              />
              
              <div className="relative z-10">
                <p className="font-medium text-sm truncate">{preset.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {preset.animation_type ? `${preset.theme_name} + ${preset.animation_type}` : preset.theme_name}
                </p>
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => deletePreset(preset.id, e)}
                className="absolute top-1 right-1 p-1.5 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
