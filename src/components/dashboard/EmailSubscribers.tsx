import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Mail, Trash2, Download, Users } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

interface EmailSubscribersProps {
  profileId: string;
  emailCollectionEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function EmailSubscribers({ 
  profileId, 
  emailCollectionEnabled, 
  onToggle 
}: EmailSubscribersProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscribers();
  }, [profileId]);

  const loadSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from("email_subscribers")
        .select("*")
        .eq("profile_id", profileId)
        .order("subscribed_at", { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error: any) {
      console.error("Failed to load subscribers:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id: string) => {
    try {
      const { error } = await supabase
        .from("email_subscribers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setSubscribers(subscribers.filter(s => s.id !== id));
      toast.success("Subscriber removed");
    } catch (error: any) {
      toast.error("Failed to remove subscriber");
    }
  };

  const exportCSV = () => {
    if (subscribers.length === 0) {
      toast.error("No subscribers to export");
      return;
    }

    const csv = [
      "Email,Subscribed At",
      ...subscribers.map(s => `${s.email},${s.subscribed_at}`)
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported subscribers!");
  };

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Email Collection</p>
            <p className="text-sm text-muted-foreground">
              Allow visitors to subscribe to your updates
            </p>
          </div>
        </div>
        <Switch
          checked={emailCollectionEnabled}
          onCheckedChange={onToggle}
        />
      </div>

      {/* Subscribers List */}
      {emailCollectionEnabled && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}</span>
            </div>
            {subscribers.length > 0 && (
              <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>No subscribers yet</p>
            </div>
          ) : (
            <div className="border border-border rounded-xl divide-y divide-border max-h-64 overflow-y-auto">
              {subscribers.map(subscriber => (
                <div key={subscriber.id} className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-medium text-sm">{subscriber.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(subscriber.subscribed_at), "MMM d, yyyy")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSubscriber(subscriber.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
