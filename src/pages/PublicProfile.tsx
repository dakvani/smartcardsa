import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { SocialIcons } from "@/components/profile/SocialIcons";

interface SocialLinks {
  instagram?: string;
  twitter?: string;
  youtube?: string;
  facebook?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

interface Profile {
  id: string;
  user_id: string;
  username: string;
  title: string;
  bio: string;
  avatar_url: string | null;
  theme_gradient: string;
  social_links: SocialLinks;
}

interface LinkItem {
  id: string;
  title: string;
  url: string;
  visible: boolean;
}

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!username) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username.toLowerCase())
          .maybeSingle();

        if (profileError) throw profileError;
        
        if (!profileData) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setProfile({
          ...profileData,
          social_links: (profileData.social_links as SocialLinks) || {},
        });

        // Record view
        await supabase.from("profile_views").insert({
          profile_id: profileData.id,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        });

        // Fetch visible links
        const { data: linksData, error: linksError } = await supabase
          .from("links")
          .select("*")
          .eq("user_id", profileData.user_id)
          .eq("visible", true)
          .order("position", { ascending: true });

        if (linksError) throw linksError;
        setLinks(linksData || []);
      } catch (error) {
        console.error("Error loading profile:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [username]);

  const handleLinkClick = async (linkId: string, url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    
    try {
      const { data: currentLink } = await supabase
        .from("links")
        .select("click_count")
        .eq("id", linkId)
        .single();
      
      if (currentLink) {
        await supabase
          .from("links")
          .update({ click_count: (currentLink.click_count || 0) + 1 })
          .eq("id", linkId);
      }
    } catch {
      // Silently fail - click tracking is not critical
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900">
        <Loader2 className="w-8 h-8 animate-spin text-primary-foreground" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">This SmartCard doesn't exist yet.</p>
          <Link 
            to={`/auth?signup=true&username=${username}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold"
          >
            Claim @{username}
          </Link>
        </div>
        <Link to="/" className="mt-8 text-sm text-muted-foreground hover:text-foreground">
          ← Back to SmartCard
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${profile.theme_gradient} py-12 px-4`}>
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-primary-foreground/20 backdrop-blur mb-4 flex items-center justify-center overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-primary-foreground">
                {profile.username[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground">{profile.title}</h1>
          {profile.bio && (
            <p className="text-primary-foreground/70 mt-2 max-w-xs mx-auto">{profile.bio}</p>
          )}
          
          {/* Social Icons */}
          <SocialIcons socialLinks={profile.social_links || {}} />
        </motion.div>

        {/* Links */}
        <div className="space-y-4">
          {links.map((link, index) => (
            <motion.button
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleLinkClick(link.id, link.url)}
              className="w-full py-4 px-6 rounded-2xl bg-primary-foreground/20 backdrop-blur text-primary-foreground font-semibold text-center hover:bg-primary-foreground/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {link.title}
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary-foreground/50 hover:text-primary-foreground transition-colors text-sm"
          >
            <div className="w-5 h-5 rounded gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">S</span>
            </div>
            Made with SmartCard
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
