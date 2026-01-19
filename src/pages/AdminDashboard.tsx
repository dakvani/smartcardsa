import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Database, 
  Users, 
  ShoppingBag, 
  Star, 
  Heart, 
  Eye, 
  Mail,
  Link,
  Palette,
  Shield,
  RefreshCw,
  ChevronRight,
  BarChart3,
  Package
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTableViewer } from "@/components/admin/AdminTableViewer";
import { AdminUserManager } from "@/components/admin/AdminUserManager";

interface TableStats {
  name: string;
  count: number;
  icon: React.ElementType;
  description: string;
  color: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<TableStats[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkAdminAndLoadStats();
  }, []);

  const checkAdminAndLoadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (rolesError || !roles || roles.length === 0) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsAdmin(true);
      await loadStats();
    } catch (error) {
      console.error("Error checking admin status:", error);
      setLoading(false);
    }
  };

  const loadStats = async () => {
    setRefreshing(true);
    try {
      const [
        profilesRes,
        ordersRes,
        reviewsRes,
        wishlistRes,
        viewsRes,
        subscribersRes,
        linksRes,
        templatesRes,
        rolesRes
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("nfc_orders").select("id", { count: "exact", head: true }),
        supabase.from("product_reviews").select("id", { count: "exact", head: true }),
        supabase.from("product_wishlist").select("id", { count: "exact", head: true }),
        supabase.from("profile_views").select("id", { count: "exact", head: true }),
        supabase.from("email_subscribers").select("id", { count: "exact", head: true }),
        supabase.from("links").select("id", { count: "exact", head: true }),
        supabase.from("profile_templates").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("id", { count: "exact", head: true }),
      ]);

      setStats([
        { name: "Profiles", count: profilesRes.count || 0, icon: Users, description: "User profiles", color: "text-blue-500" },
        { name: "Orders", count: ordersRes.count || 0, icon: ShoppingBag, description: "NFC product orders", color: "text-green-500" },
        { name: "Reviews", count: reviewsRes.count || 0, icon: Star, description: "Product reviews", color: "text-yellow-500" },
        { name: "Wishlist Items", count: wishlistRes.count || 0, icon: Heart, description: "Saved products", color: "text-red-500" },
        { name: "Profile Views", count: viewsRes.count || 0, icon: Eye, description: "Analytics data", color: "text-purple-500" },
        { name: "Subscribers", count: subscribersRes.count || 0, icon: Mail, description: "Email subscribers", color: "text-cyan-500" },
        { name: "Links", count: linksRes.count || 0, icon: Link, description: "User links", color: "text-orange-500" },
        { name: "Templates", count: templatesRes.count || 0, icon: Palette, description: "Profile templates", color: "text-pink-500" },
        { name: "User Roles", count: rolesRes.count || 0, icon: Shield, description: "Role assignments", color: "text-indigo-500" },
      ]);
    } catch (error) {
      console.error("Error loading stats:", error);
      toast({
        title: "Error",
        description: "Failed to load database statistics.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading admin dashboard...
          </div>
        </main>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access the admin dashboard.
                Please contact an administrator if you believe this is an error.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => navigate("/")}>Return Home</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const totalRecords = stats.reduce((acc, stat) => acc + stat.count, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main id="main-content" className="flex-1 pt-24 pb-16">
        <div className="container px-4 mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <Database className="w-8 h-8 text-primary" />
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage and monitor your application data
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={loadStats}
                  disabled={refreshing}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button onClick={() => navigate("/admin/orders")}>
                  <Package className="w-4 h-4 mr-2" />
                  Manage Orders
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Records</p>
                    <p className="text-4xl font-bold text-foreground">{totalRecords.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-12 h-12 text-primary/50" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{stat.name}</p>
                        <p className="text-2xl font-bold">{stat.count.toLocaleString()}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Tabs for different management views */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs defaultValue="tables" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
                <TabsTrigger value="tables" className="gap-2">
                  <Database className="w-4 h-4" />
                  Database Tables
                </TabsTrigger>
                <TabsTrigger value="users" className="gap-2">
                  <Users className="w-4 h-4" />
                  User Management
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tables">
                <AdminTableViewer />
              </TabsContent>

              <TabsContent value="users">
                <AdminUserManager />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
