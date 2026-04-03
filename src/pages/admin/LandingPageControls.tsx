import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Loader2, Sliders, GripVertical } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

const adminFetch = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, { ...options, credentials: "include", headers: { "Content-Type": "application/json", ...options.headers } });
  if (res.status === 401) { window.location.href = "/admin"; throw new Error("Unauthorized"); }
  return res.json();
};

const sections = [
  { key: "hero", label: "Hero Slider", desc: "Main carousel with 6 slides" },
  { key: "events_ticker", label: "Events Ticker", desc: "Scrolling event strip below header" },
  { key: "about", label: "About Section", desc: "Foundation story and pillars" },
  { key: "programs", label: "Our Programs", desc: "6 program cards" },
  { key: "sustainability", label: "Make a Difference", desc: "Sustainability initiatives" },
  { key: "causes", label: "Our Causes", desc: "5 cause cards" },
  { key: "impact", label: "Impact Numbers", desc: "Animated stat counters" },
  { key: "testimonials", label: "Testimonials", desc: "Voices of Change carousel" },
  { key: "reels", label: "Impact in Action", desc: "Video reels section" },
  { key: "get_involved", label: "Get Involved", desc: "CTA for volunteers and donors" },
  { key: "news", label: "News & Stories", desc: "Latest 3 articles" },
  { key: "gallery", label: "Photo Gallery", desc: "Recent gallery images" },
  { key: "partners", label: "Our Partners", desc: "Partner logos grid" },
  { key: "sponsors", label: "Our Supporters", desc: "Sponsor logos grid" },
  { key: "contact", label: "Contact Section", desc: "Contact form and info" },
];

const LandingPageControls = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch(`${API_BASE_URL}/admin/settings.php`)
      .then((res) => setSettings(res.data || {}))
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const isEnabled = (key: string) => settings[`section_${key}_enabled`] !== "0";
  const toggleSection = (key: string) => {
    const settingKey = `section_${key}_enabled`;
    setSettings((prev) => ({ ...prev, [settingKey]: prev[settingKey] === "0" ? "1" : "0" }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await adminFetch(`${API_BASE_URL}/admin/settings.php`, { method: "PUT", body: JSON.stringify(settings) });
      toast.success("Landing page settings saved!");
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Sliders className="w-5 h-5 text-primary" />Landing Page Sections</CardTitle>
          <CardDescription>Enable or disable sections on the public landing page. Sections with no data are automatically hidden regardless of this setting.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {sections.map((section) => (
              <div key={section.key} className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground/30" />
                  <div>
                    <p className="text-sm font-medium">{section.label}</p>
                    <p className="text-xs text-muted-foreground">{section.desc}</p>
                  </div>
                </div>
                <Switch checked={isEnabled(section.key)} onCheckedChange={() => toggleSection(section.key)} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={save} disabled={saving} size="lg" className="w-full rounded-xl">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Settings
      </Button>
    </div>
  );
};

export default LandingPageControls;
