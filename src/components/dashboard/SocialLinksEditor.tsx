import { Instagram, Twitter, Youtube, Facebook, Linkedin, Github, Globe } from "lucide-react";

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  youtube?: string;
  facebook?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

interface SocialLinksEditorProps {
  socialLinks: SocialLinks;
  onChange: (links: SocialLinks) => void;
  onBlur: () => void;
}

const socialPlatforms = [
  { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "username" },
  { key: "twitter", label: "Twitter/X", icon: Twitter, placeholder: "username" },
  { key: "youtube", label: "YouTube", icon: Youtube, placeholder: "channel" },
  { key: "facebook", label: "Facebook", icon: Facebook, placeholder: "username" },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "username" },
  { key: "github", label: "GitHub", icon: Github, placeholder: "username" },
  { key: "website", label: "Website", icon: Globe, placeholder: "https://..." },
] as const;

export function SocialLinksEditor({ socialLinks, onChange, onBlur }: SocialLinksEditorProps) {
  const handleChange = (key: string, value: string) => {
    onChange({ ...socialLinks, [key]: value });
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Social Media Links</label>
      <div className="space-y-2">
        {socialPlatforms.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              value={(socialLinks as Record<string, string>)[key] || ""}
              onChange={(e) => handleChange(key, e.target.value)}
              onBlur={onBlur}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm"
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        These icons will appear at the bottom of your profile
      </p>
    </div>
  );
}

export { socialPlatforms };
