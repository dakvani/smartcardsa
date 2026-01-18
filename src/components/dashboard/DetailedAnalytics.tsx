import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { Loader2, Globe, Monitor, Smartphone, Tablet } from "lucide-react";

interface DetailedAnalyticsProps {
  profileId: string;
  period: 7 | 30;
}

interface ClickData {
  country: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(262, 83%, 58%)",
  "hsl(199, 89%, 48%)",
  "hsl(142, 71%, 45%)",
  "hsl(43, 96%, 56%)",
  "hsl(4, 90%, 58%)",
];

const deviceIcons: Record<string, React.ElementType> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

export function DetailedAnalytics({ profileId, period }: DetailedAnalyticsProps) {
  const [clicks, setClicks] = useState<ClickData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetailedClicks();
  }, [profileId, period]);

  const loadDetailedClicks = async () => {
    setLoading(true);
    try {
      const startDate = startOfDay(subDays(new Date(), period - 1));

      const { data, error } = await supabase
        .from("link_clicks")
        .select("country, device_type, browser, os")
        .eq("profile_id", profileId)
        .gte("clicked_at", startDate.toISOString());

      if (error) throw error;
      setClicks(data || []);
    } catch (error) {
      console.error("Failed to load detailed analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Aggregate data
  const aggregateByField = (field: keyof ClickData) => {
    const counts: Record<string, number> = {};
    clicks.forEach(click => {
      const value = click[field] || "Unknown";
      counts[value] = (counts[value] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  const countryData = aggregateByField("country");
  const deviceData = aggregateByField("device_type");
  const browserData = aggregateByField("browser");
  const osData = aggregateByField("os");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (clicks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Globe className="w-10 h-10 mx-auto mb-2 opacity-50" />
        <p>No click data available yet</p>
        <p className="text-sm">Click analytics will appear when visitors click your links</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Countries */}
        <div className="p-4 bg-secondary/30 rounded-xl">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Top Countries
          </h4>
          {countryData.length > 0 ? (
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={countryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {countryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No location data</p>
          )}
        </div>

        {/* Devices */}
        <div className="p-4 bg-secondary/30 rounded-xl">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Devices
          </h4>
          <div className="space-y-3">
            {deviceData.length > 0 ? deviceData.map((device, index) => {
              const Icon = deviceIcons[device.name.toLowerCase()] || Monitor;
              const percentage = ((device.value / clicks.length) * 100).toFixed(1);
              return (
                <div key={device.name} className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{device.name}</span>
                      <span className="text-muted-foreground">{percentage}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            }) : (
              <p className="text-sm text-muted-foreground text-center py-8">No device data</p>
            )}
          </div>
        </div>

        {/* Browsers */}
        <div className="p-4 bg-secondary/30 rounded-xl">
          <h4 className="font-semibold mb-4">Browsers</h4>
          <div className="space-y-2">
            {browserData.length > 0 ? browserData.map((browser, index) => {
              const percentage = ((browser.value / clicks.length) * 100).toFixed(1);
              return (
                <div key={browser.name} className="flex items-center justify-between text-sm">
                  <span>{browser.name}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-16 h-2 rounded-full bg-secondary overflow-hidden"
                    >
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                    <span className="text-muted-foreground w-12 text-right">{percentage}%</span>
                  </div>
                </div>
              );
            }) : (
              <p className="text-sm text-muted-foreground text-center py-4">No browser data</p>
            )}
          </div>
        </div>

        {/* Operating Systems */}
        <div className="p-4 bg-secondary/30 rounded-xl">
          <h4 className="font-semibold mb-4">Operating Systems</h4>
          <div className="space-y-2">
            {osData.length > 0 ? osData.map((os, index) => {
              const percentage = ((os.value / clicks.length) * 100).toFixed(1);
              return (
                <div key={os.name} className="flex items-center justify-between text-sm">
                  <span>{os.name}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-16 h-2 rounded-full bg-secondary overflow-hidden"
                    >
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                    <span className="text-muted-foreground w-12 text-right">{percentage}%</span>
                  </div>
                </div>
              );
            }) : (
              <p className="text-sm text-muted-foreground text-center py-4">No OS data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
