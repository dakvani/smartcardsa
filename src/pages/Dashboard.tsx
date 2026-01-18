import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, GripVertical, Eye, EyeOff, Trash2, ExternalLink, LogOut, BarChart3, Palette, Settings, Link2, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import type { User, Session } from "@supabase/supabase-js";

interface Profile {
  id: string;
  user_id: string;
  username: string;
  title: string;
  bio: string;
  avatar_url: string | null;
  theme_name: string;
  theme_gradient: string;
}

interface LinkItem {
  id: string;
  user_id: string;
  title: string;
  url: string;
  visible: boolean;
  position: number;
  click_count: number;
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
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState("links");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [analytics, setAnalytics] = useState({ views: 0, clicks: 0 });

  // Load user data
  const loadData = useCallback(async (userId: string) => {
    try {
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (profileError) throw profileError;
      if (profileData) setProfile(profileData);

      // Load links
      const { data: linksData, error: linksError } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", userId)
        .order("position", { ascending: true });

      if (linksError) throw linksError;
      setLinks(linksData || []);

      // Load analytics
      if (profileData) {
        const { count: viewCount } = await supabase
          .from("profile_views")
          .select("*", { count: "exact", head: true })
          .eq("profile_id", profileData.id);

        const totalClicks = (linksData || []).reduce((sum, link) => sum + (link.click_count || 0), 0);
        setAnalytics({ views: viewCount || 0, clicks: totalClicks });
      }
    } catch (error: any) {
      toast.error("Failed to load data: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      } else if (session.user) {
        // Defer data loading
        setTimeout(() => loadData(session.user.id), 0);
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      } else if (session.user) {
        loadData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, loadData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  // Profile operations
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile || !user) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profile.id);

      if (error) throw error;
      setProfile({ ...profile, ...updates });
      toast.success("Profile updated!");
    } catch (error: any) {
      toast.error("Failed to update: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Link operations
  const addLink = async () => {
    if (!user) return;
    
    const newPosition = links.length;
    const { data, error } = await supabase
      .from("links")
      .insert({
        user_id: user.id,
        title: "New Link",
        url: "",
        position: newPosition,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to add link: " + error.message);
      return;
    }

    setLinks([...links, data]);
    toast.success("Link added!");
  };

  const updateLink = async (id: string, updates: Partial<LinkItem>) => {
    const { error } = await supabase
      .from("links")
      .update(updates)
      .eq("id", id);

    if (error) {
      toast.error("Failed to update link");
      return;
    }

    setLinks(links.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteLink = async (id: string) => {
    const { error } = await supabase
      .from("links")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete link");
      return;
    }

    setLinks(links.filter(l => l.id !== id));
    toast.success("Link deleted!");
  };

  const copyProfileUrl = () => {
    if (!profile) return;
    navigator.clipboard.writeText(`${window.location.origin}/${profile.username}`);
    setCopied(true);
    toast.success("URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !profile) return null;

  const selectedTheme = themes.find(t => t.name === profile.theme_name) || themes[0];

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
            <Button variant="gradient" size="sm" onClick={copyProfileUrl}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
            </Button>
            <Link to={`/${profile.username}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">View</span>
              </Button>
            </Link>
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
                  
                  {links.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Link2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No links yet. Add your first link above!</p>
                    </div>
                  ) : (
                    links.map(link => (
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
                              onChange={(e) => updateLink(link.id, { title: e.target.value })}
                              onBlur={(e) => updateLink(link.id, { title: e.target.value })}
                              placeholder="Link Title"
                              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm font-medium"
                            />
                            <input
                              value={link.url}
                              onChange={(e) => updateLink(link.id, { url: e.target.value })}
                              onBlur={(e) => updateLink(link.id, { url: e.target.value })}
                              placeholder="https://..."
                              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                            />
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <BarChart3 className="w-3 h-3" />
                              <span>{link.click_count} clicks</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => updateLink(link.id, { visible: !link.visible })} 
                            className="p-2 hover:bg-secondary rounded-lg"
                            title={link.visible ? "Hide link" : "Show link"}
                          >
                            {link.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                          </button>
                          <button 
                            onClick={() => deleteLink(link.id)} 
                            className="p-2 hover:bg-destructive/10 rounded-lg text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Profile Title</label>
                    <input 
                      value={profile.title} 
                      onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                      onBlur={(e) => updateProfile({ title: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <textarea 
                      value={profile.bio || ""} 
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      onBlur={(e) => updateProfile({ bio: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background resize-none" 
                      rows={2} 
                      maxLength={80} 
                      placeholder="Tell your audience about yourself..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">{(profile.bio || "").length}/80 characters</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-3">Theme</label>
                    <div className="grid grid-cols-5 gap-3">
                      {themes.map(theme => (
                        <button
                          key={theme.name}
                          onClick={() => updateProfile({ theme_name: theme.name, theme_gradient: theme.gradient })}
                          className={`aspect-square rounded-xl bg-gradient-to-b ${theme.gradient} transition-all ${
                            profile.theme_name === theme.name ? "ring-2 ring-primary ring-offset-2" : "hover:scale-105"
                          }`}
                          title={theme.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-secondary/50 rounded-xl text-center">
                      <p className="text-4xl font-bold">{analytics.views.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">Total Views</p>
                    </div>
                    <div className="p-6 bg-secondary/50 rounded-xl text-center">
                      <p className="text-4xl font-bold">{analytics.clicks.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">Total Clicks</p>
                    </div>
                  </div>
                  
                  {links.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Top Performing Links</h3>
                      <div className="space-y-2">
                        {[...links]
                          .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
                          .slice(0, 5)
                          .map((link, index) => (
                            <div key={link.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                                {index + 1}
                              </span>
                              <span className="flex-1 truncate text-sm font-medium">{link.title}</span>
                              <span className="text-sm text-muted-foreground">{link.click_count} clicks</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="p-4 bg-secondary/50 rounded-xl">
                    <p className="font-medium mb-1">Your SmartCard URL</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm text-muted-foreground bg-background px-3 py-2 rounded-lg">
                        {window.location.origin}/{profile.username}
                      </code>
                      <Button variant="outline" size="sm" onClick={copyProfileUrl}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">smartcard.online/</span>
                      <input 
                        value={profile.username} 
                        onChange={(e) => setProfile({ ...profile, username: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') })}
                        onBlur={(e) => updateProfile({ username: e.target.value })}
                        className="flex-1 px-4 py-2 rounded-lg border border-input bg-background" 
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">Account: {user.email}</p>
                    <Button variant="outline" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
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
                    <div className="w-20 h-20 mx-auto rounded-full bg-primary-foreground/20 backdrop-blur mb-4 flex items-center justify-center">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-primary-foreground">{profile.username[0]?.toUpperCase()}</span>
                      )}
                    </div>
                    <h3 className="text-primary-foreground font-bold text-lg">{profile.title}</h3>
                    <p className="text-primary-foreground/70 text-sm mt-1">{profile.bio}</p>
                    <div className="mt-6 space-y-3 max-h-[320px] overflow-y-auto">
                      {links.filter(l => l.visible).map(link => (
                        <div 
                          key={link.id} 
                          className="w-full py-3 px-4 rounded-xl bg-primary-foreground/20 backdrop-blur text-primary-foreground text-sm font-medium truncate"
                        >
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
