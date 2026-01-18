import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, GripVertical, Eye, EyeOff, Trash2, ExternalLink, LogOut, BarChart3, Palette, Settings, Link2 } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

interface LinkItem {
  id: string;
  title: string;
  url: string;
  visible: boolean;
}

const tabs = [
  { id: "links", label: "Links", icon: Link2 },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

const themes = [
  { name: "Midnight", gradient: "from-indigo-900 via-purple-900 to-pink-900" },
  { name: "Sunset", gradient: "from-orange-500 via-pink-500 to-purple-600" },
  { name: "Ocean", gradient: "from-cyan-500 via-blue-500 to-indigo-600" },
  { name: "Forest", gradient: "from-green-600 via-emerald-500 to-teal-500" },
  { name: "Minimal", gradient: "from-gray-100 via-gray-200 to-gray-300" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("links");
  const [links, setLinks] = useState<LinkItem[]>([
    { id: "1", title: "My Portfolio", url: "https://example.com", visible: true },
    { id: "2", title: "Latest Video", url: "https://youtube.com", visible: true },
  ]);
  const [profileTitle, setProfileTitle] = useState("@creator");
  const [bio, setBio] = useState("Digital creator & artist");
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        setProfileTitle(`@${session.user.user_metadata?.username || "creator"}`);
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/auth");
      else setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const addLink = () => {
    setLinks([...links, { id: Date.now().toString(), title: "New Link", url: "", visible: true }]);
  };

  const updateLink = (id: string, field: keyof LinkItem, value: string | boolean) => {
    setLinks(links.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const deleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
    toast.success("Link deleted");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-xl">SmartCard</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="gradient" size="sm">
              <ExternalLink className="w-4 h-4" /> Share
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Editor Panel */}
          <div className="flex-1 lg:w-[60%]">
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-background rounded-xl border border-border mb-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-background rounded-2xl border border-border p-6">
              {activeTab === "links" && (
                <div className="space-y-4">
                  <Button onClick={addLink} variant="gradient" className="w-full">
                    <Plus className="w-5 h-5" /> Add New Link
                  </Button>
                  {links.map(link => (
                    <motion.div
                      key={link.id}
                      layout
                      className="p-4 bg-secondary/50 rounded-xl border border-border"
                    >
                      <div className="flex items-start gap-3">
                        <GripVertical className="w-5 h-5 text-muted-foreground mt-2 cursor-grab" />
                        <div className="flex-1 space-y-3">
                          <input
                            value={link.title}
                            onChange={(e) => updateLink(link.id, "title", e.target.value)}
                            placeholder="Link Title"
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm font-medium"
                          />
                          <input
                            value={link.url}
                            onChange={(e) => updateLink(link.id, "url", e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                          />
                        </div>
                        <button onClick={() => updateLink(link.id, "visible", !link.visible)} className="p-2 hover:bg-secondary rounded-lg">
                          {link.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                        </button>
                        <button onClick={() => deleteLink(link.id)} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Profile Title</label>
                    <input value={profileTitle} onChange={(e) => setProfileTitle(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-input bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-input bg-background resize-none" rows={2} maxLength={80} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3">Theme</label>
                    <div className="grid grid-cols-5 gap-3">
                      {themes.map(theme => (
                        <button
                          key={theme.name}
                          onClick={() => setSelectedTheme(theme)}
                          className={`aspect-square rounded-xl bg-gradient-to-b ${theme.gradient} ${selectedTheme.name === theme.name ? "ring-2 ring-primary ring-offset-2" : ""}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-secondary/50 rounded-xl text-center">
                    <p className="text-4xl font-bold">1,234</p>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                  </div>
                  <div className="p-6 bg-secondary/50 rounded-xl text-center">
                    <p className="text-4xl font-bold">567</p>
                    <p className="text-sm text-muted-foreground">Total Clicks</p>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/50 rounded-xl">
                    <p className="font-medium mb-1">Your SmartCard URL</p>
                    <p className="text-sm text-muted-foreground">smartcard.online/{user.user_metadata?.username || "yourname"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:w-[40%] flex justify-center">
            <div className="sticky top-24">
              <p className="text-sm text-muted-foreground text-center mb-4">Live Preview</p>
              <div className="w-[280px] h-[580px] rounded-[40px] bg-foreground p-3 shadow-elevated">
                <div className={`w-full h-full rounded-[32px] bg-gradient-to-b ${selectedTheme.gradient} overflow-hidden relative`}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground rounded-b-2xl" />
                  <div className="pt-12 px-6 text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-primary-foreground/20 backdrop-blur mb-4" />
                    <h3 className="text-primary-foreground font-bold text-lg">{profileTitle}</h3>
                    <p className="text-primary-foreground/70 text-sm mt-1">{bio}</p>
                    <div className="mt-6 space-y-3">
                      {links.filter(l => l.visible).map(link => (
                        <div key={link.id} className="w-full py-3 px-4 rounded-xl bg-primary-foreground/20 backdrop-blur text-primary-foreground text-sm font-medium">
                          {link.title || "Untitled"}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
