import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, Loader2, Sliders, GripVertical, Upload, X, Image as ImageIcon } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { uploadImage } from "@/lib/admin-api";

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

const sectionImages = [
  { key: "about_section_image", label: "About Section Image", desc: "Photo shown in the About section" },
  { key: "programs_education_image", label: "Education Program", desc: "Education card image" },
  { key: "programs_healthcare_image", label: "Healthcare Program", desc: "Healthcare card image" },
  { key: "programs_livelihood_image", label: "Livelihood Program", desc: "Livelihood card image" },
  { key: "programs_dental_image", label: "Dental Treatment", desc: "Dental card image" },
  { key: "programs_sanskrit_image", label: "Learning Sanskrit", desc: "Sanskrit card image" },
  { key: "programs_food_image", label: "Food Distribution", desc: "Annadanam card image" },
  { key: "sustainability_bg_image", label: "Sustainability Background", desc: "Make a Difference section background" },
];

const LandingPageControls = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

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

  const handleImageUpload = async (file: File, key: string) => {
    setUploadingKey(key);
    try {
      const result = await uploadImage(file, "general");
      if (result.path) {
        setSettings((prev) => ({ ...prev, [key]: result.path }));
        toast.success("Image uploaded!");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    }
    setUploadingKey(null);
  };

  const removeImage = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: "" }));
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
      {/* Section Toggles */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Sliders className="w-5 h-5 text-primary" />Landing Page Sections</CardTitle>
          <CardDescription>Enable or disable sections on the public landing page.</CardDescription>
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

      {/* Section Image Uploads */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><ImageIcon className="w-5 h-5 text-primary" />Section Images</CardTitle>
          <CardDescription>Upload or replace images for landing page sections. Leave empty to use defaults.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sectionImages.map((img) => (
              <div key={img.key} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                <div className="w-20 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {settings[img.key] ? (
                    <img src={settings[img.key]} alt={img.label} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{img.label}</p>
                  <p className="text-xs text-muted-foreground">{img.desc}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {settings[img.key] && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeImage(img.key)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <label className="cursor-pointer">
                    <Button variant="outline" size="sm" className="pointer-events-none" disabled={uploadingKey === img.key}>
                      {uploadingKey === img.key ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Upload className="h-3 w-3 mr-1" />}
                      {settings[img.key] ? "Replace" : "Upload"}
                    </Button>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, img.key);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
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
