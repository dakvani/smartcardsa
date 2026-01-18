import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent 
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Plus, ExternalLink, LogOut, BarChart3, Palette, Settings, Link2, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import type { User, Session } from "@supabase/supabase-js";
import { AvatarUpload } from "@/components/dashboard/AvatarUpload";
import { SocialLinksEditor, SocialLinks } from "@/components/dashboard/SocialLinksEditor";
import { SortableLinkItem } from "@/components/dashboard/SortableLinkItem";
import { SocialIcons } from "@/components/profile/SocialIcons";

interface Profile {
  id: string;
  user_id: string;
  username: string;
  title: string;
  bio: string;
  avatar_url: string | null;
  theme_name: string;
  theme_gradient: string;
  social_links: SocialLinks;
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

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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
      if (profileData) {
        setProfile({
          ...profileData,
          social_links: (profileData.social_links as SocialLinks) || {},
        });
      }

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      } else if (session.user) {
        setTimeout(() => loadData(session.user.id), 0);
      }
    });

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
      // Convert social_links to JSON-compatible format for Supabase
      const dbUpdates = { ...updates } as Record<string, unknown>;
      if (updates.social_links) {
        dbUpdates.social_links = updates.social_links as Record<string, string>;
      }

      const { error } = await supabase
        .from("profiles")
        .update(dbUpdates)
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

  // Drag and drop handler
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex(l => l.id === active.id);
    const newIndex = links.findIndex(l => l.id === over.id);

    const reorderedLinks = arrayMove(links, oldIndex, newIndex);
    
    // Update positions
    const updatedLinks = reorderedLinks.map((link, index) => ({
      ...link,
      position: index,
    }));

    setLinks(updatedLinks);

    // Persist to database
    try {
      const updates = updatedLinks.map(link => 
        supabase.from("links").update({ position: link.position }).eq("id", link.id)
      );
      await Promise.all(updates);
    } catch (error) {
      toast.error("Failed to save order");
      loadData(user!.id); // Reload to restore state
    }
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
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                      modifiers={[restrictToVerticalAxis]}
                    >
                      <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-4">
                          {links.map(link => (
                            <SortableLinkItem
                              key={link.id}
                              link={link}
                              onUpdate={updateLink}
                              onDelete={deleteLink}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-6">
                  {/* Avatar Upload */}
                  <AvatarUpload
                    userId={user.id}
                    currentAvatarUrl={profile.avatar_url}
                    username={profile.username}
                    onUpload={(url) => updateProfile({ avatar_url: url })}
                  />

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
                  
                  {/* Social Links */}
                  <SocialLinksEditor
                    socialLinks={profile.social_links || {}}
                    onChange={(links) => setProfile({ ...profile, social_links: links })}
                    onBlur={() => updateProfile({ social_links: profile.social_links })}
                  />

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
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:w-[40%] lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-background rounded-2xl border border-border p-4">
              <p className="text-sm text-muted-foreground text-center mb-4">Live Preview</p>
              <div className={`rounded-[2rem] bg-gradient-to-b ${selectedTheme.gradient} p-6 min-h-[600px] overflow-hidden`}>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary-foreground/20 backdrop-blur mb-3 flex items-center justify-center overflow-hidden">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-primary-foreground">
                        {profile.username[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-primary-foreground">{profile.title}</h2>
                  {profile.bio && (
                    <p className="text-primary-foreground/70 text-sm mt-1">{profile.bio}</p>
                  )}
                  <SocialIcons socialLinks={profile.social_links || {}} />
                </div>
                <div className="space-y-3">
                  {links.filter(l => l.visible).map(link => (
                    <div key={link.id} className="py-3 px-4 rounded-xl bg-primary-foreground/20 backdrop-blur text-primary-foreground font-medium text-center text-sm">
                      {link.title || "Untitled Link"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
