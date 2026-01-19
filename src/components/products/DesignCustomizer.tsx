import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignCustomization, designTemplates, NFCProduct } from "./types";
import { Upload, Link, Palette, Image, ExternalLink, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DesignCustomizerProps {
  product: NFCProduct;
  customization: DesignCustomization;
  onChange: (customization: DesignCustomization) => void;
}

export function DesignCustomizer({ product, customization, onChange }: DesignCustomizerProps) {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Array<{ id: string; username: string; title: string | null }>>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [canvaUrl, setCanvaUrl] = useState("");

  const handleColorChange = (field: keyof DesignCustomization, value: string) => {
    onChange({ ...customization, [field]: value });
  };

  const handleTextChange = (field: keyof DesignCustomization, value: string) => {
    onChange({ ...customization, [field]: value });
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = designTemplates.find((t) => t.id === templateId);
    if (template) {
      onChange({
        ...customization,
        templateId,
        backgroundColor: template.colors.bg,
        textColor: template.colors.text,
        accentColor: template.colors.accent,
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'customArtworkUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For now, create an object URL for preview (in production, upload to storage)
    const objectUrl = URL.createObjectURL(file);
    onChange({ ...customization, [field]: objectUrl });
    
    toast({
      title: "Image uploaded",
      description: "Your image has been added to the design.",
    });
  };

  const handleCanvaImport = () => {
    if (!canvaUrl) {
      toast({
        title: "Enter Canva URL",
        description: "Please paste your Canva design share link.",
        variant: "destructive",
      });
      return;
    }
    
    onChange({ ...customization, canvaDesignUrl: canvaUrl });
    toast({
      title: "Canva design imported",
      description: "Your Canva design has been linked to this product.",
    });
  };

  const loadUserProfiles = async () => {
    setLoadingProfiles(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, username, title')
          .eq('user_id', user.id);
        
        if (profilesData) {
          setProfiles(profilesData);
        }
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setLoadingProfiles(false);
    }
  };

  const handleLinkProfile = (profileId: string, username: string) => {
    onChange({
      ...customization,
      linkedProfileId: profileId,
      linkedProfileUsername: username,
    });
    toast({
      title: "Profile linked",
      description: `Your NFC product will link to @${username}`,
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Customize Your {product.name}</h3>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="templates" className="text-xs">
            <Palette className="w-4 h-4 mr-1" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="colors" className="text-xs">
            <Palette className="w-4 h-4 mr-1" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="text" className="text-xs">
            <User className="w-4 h-4 mr-1" />
            Text
          </TabsTrigger>
          <TabsTrigger value="upload" className="text-xs">
            <Upload className="w-4 h-4 mr-1" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="link" className="text-xs">
            <Link className="w-4 h-4 mr-1" />
            Link
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4 mt-4">
          <Label>Choose a Template</Label>
          <div className="grid grid-cols-3 gap-3">
            {designTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  customization.templateId === template.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div
                  className="w-full h-12 rounded-lg mb-2"
                  style={{ backgroundColor: template.colors.bg }}
                />
                <span className="text-xs font-medium">{template.name}</span>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4 mt-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bgColor">Background</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="bgColor"
                  type="color"
                  value={customization.backgroundColor}
                  onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={customization.backgroundColor}
                  onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="textColor">Text</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="textColor"
                  type="color"
                  value={customization.textColor}
                  onChange={(e) => handleColorChange("textColor", e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={customization.textColor}
                  onChange={(e) => handleColorChange("textColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="accentColor">Accent</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="accentColor"
                  type="color"
                  value={customization.accentColor}
                  onChange={(e) => handleColorChange("accentColor", e.target.value)}
                  className="w-12 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={customization.accentColor}
                  onChange={(e) => handleColorChange("accentColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="text" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={customization.name}
              onChange={(e) => handleTextChange("name", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="title">Title / Tagline</Label>
            <Input
              id="title"
              placeholder="Software Developer"
              value={customization.title}
              onChange={(e) => handleTextChange("title", e.target.value)}
              className="mt-1"
            />
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4 mt-4">
          <div>
            <Label>Upload Logo</Label>
            <div className="mt-2">
              <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                <div className="text-center">
                  <Image className="w-8 h-8 mx-auto text-muted-foreground" />
                  <span className="text-sm text-muted-foreground mt-1 block">
                    Click to upload logo
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'logoUrl')}
                  className="hidden"
                />
              </label>
              {customization.logoUrl && (
                <p className="text-sm text-green-600 mt-2">✓ Logo uploaded</p>
              )}
            </div>
          </div>

          <div>
            <Label>Upload Custom Artwork</Label>
            <div className="mt-2">
              <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                  <span className="text-sm text-muted-foreground mt-1 block">
                    Click to upload artwork
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'customArtworkUrl')}
                  className="hidden"
                />
              </label>
              {customization.customArtworkUrl && (
                <p className="text-sm text-green-600 mt-2">✓ Artwork uploaded</p>
              )}
            </div>
          </div>

          <div>
            <Label>Import from Canva</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Paste Canva design URL..."
                value={canvaUrl}
                onChange={(e) => setCanvaUrl(e.target.value)}
              />
              <Button onClick={handleCanvaImport} variant="outline">
                <ExternalLink className="w-4 h-4 mr-1" />
                Import
              </Button>
            </div>
            {customization.canvaDesignUrl && (
              <p className="text-sm text-green-600 mt-2">✓ Canva design linked</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="link" className="space-y-4 mt-4">
          <div>
            <Label>Link Your SmartCard Profile</Label>
            <p className="text-sm text-muted-foreground mt-1 mb-3">
              Connect this NFC product to your existing SmartCard profile.
            </p>
            
            {customization.linkedProfileUsername ? (
              <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                <p className="text-sm font-medium">
                  Linked to: <span className="text-primary">@{customization.linkedProfileUsername}</span>
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => onChange({ ...customization, linkedProfileId: null, linkedProfileUsername: null })}
                >
                  Unlink
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={loadUserProfiles}
                  disabled={loadingProfiles}
                  className="w-full"
                >
                  <Link className="w-4 h-4 mr-2" />
                  {loadingProfiles ? "Loading..." : "Load My Profiles"}
                </Button>
                
                {profiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {profiles.map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => handleLinkProfile(profile.id, profile.username)}
                        className="w-full p-3 text-left rounded-xl border border-border hover:border-primary/50 transition-colors"
                      >
                        <span className="font-medium">@{profile.username}</span>
                        {profile.title && (
                          <span className="text-sm text-muted-foreground ml-2">
                            {profile.title}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
