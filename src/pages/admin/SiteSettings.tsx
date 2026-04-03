import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Building2, Phone, Globe, Loader2, Bell, Upload, X, BarChart3, ImageIcon } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { uploadImage } from "@/lib/admin-api";

const adminFetch = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, { ...options, credentials: "include", headers: { "Content-Type": "application/json", ...options.headers } });
  if (res.status === 401) { window.location.href = "/admin"; throw new Error("Unauthorized"); }
  return res.json();
};

const heroSlides = [
  { key: "hero_slide_1", label: "Slide 1 — Community Volunteers" },
  { key: "hero_slide_2", label: "Slide 2 — Education Program" },
  { key: "hero_slide_3", label: "Slide 3 — Healthcare Initiative" },
  { key: "hero_slide_4", label: "Slide 4 — Skill Development" },
  { key: "hero_slide_5", label: "Slide 5 — Sanskrit Classes" },
  { key: "hero_slide_6", label: "Slide 6 — Dental Treatment" },
];

const SiteSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    adminFetch(`${API_BASE_URL}/admin/settings.php`)
      .then((res) => setSettings(res.data || {}))
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const update = (key: string, value: string) => setSettings((prev) => ({ ...prev, [key]: value }));

  const handleImageUpload = async (file: File, key: string) => {
    setUploading(true);
    try {
      const result = await uploadImage(file, "general");
      if (result.path) {
        update(key, result.path);
        toast.success("Image uploaded");
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch { toast.error("Upload failed"); }
    setUploading(false);
  };

  const save = async () => {
    setSaving(true);
    try {
      await adminFetch(`${API_BASE_URL}/admin/settings.php`, { method: "PUT", body: JSON.stringify(settings) });
      toast.success("Settings saved!");
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };

  if (loading) return (
    <div className="flex justify-center py-12">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  const ImageUploadField = ({ settingKey, label }: { settingKey: string; label: string }) => (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      {settings[settingKey] && (
        <div className="relative inline-block">
          <img src={settings[settingKey]} alt={label} className="h-20 w-auto object-contain rounded-lg border" />
          <Button size="icon" variant="destructive" className="absolute -top-1 -right-1 h-5 w-5" onClick={() => update(settingKey, "")}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      <div className="border-2 border-dashed rounded-lg p-3 text-center hover:border-primary/50 transition-colors">
        <label className="cursor-pointer">
          <Upload className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
          <p className="text-xs text-muted-foreground">Upload image</p>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImageUpload(f, settingKey);
          }} />
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Organization Profile */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg"><Building2 className="w-5 h-5 text-primary" />Organization Profile</CardTitle>
          <CardDescription>Basic information about your foundation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Organization Name</Label><Input value={settings.org_name || ""} onChange={(e) => update("org_name", e.target.value)} /></div>
            <div><Label>Tagline</Label><Input value={settings.tagline || ""} onChange={(e) => update("tagline", e.target.value)} /></div>
          </div>
          <div><Label>About Text</Label><Textarea value={settings.about_text || ""} onChange={(e) => update("about_text", e.target.value)} rows={3} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <ImageUploadField settingKey="logo_url" label="Logo Image" />
            <ImageUploadField settingKey="hero_bg_url" label="Default Hero Background" />
          </div>
        </CardContent>
      </Card>

      {/* Hero Slides */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg"><ImageIcon className="w-5 h-5 text-primary" />Hero Slide Images</CardTitle>
          <CardDescription>Override the 6 hero carousel images. Leave empty to use bundled defaults.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {heroSlides.map(slide => (
              <ImageUploadField key={slide.key} settingKey={slide.key} label={slide.label} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Impact Numbers */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg"><BarChart3 className="w-5 h-5 text-primary" />Impact Numbers</CardTitle>
          <CardDescription>Edit the "Our Impact in Numbers" section on the landing page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="grid grid-cols-3 gap-3 items-end">
                <div>
                  <Label className="text-xs">Value</Label>
                  <Input value={settings[`impact_stat_${i}_value`] || ""} onChange={(e) => update(`impact_stat_${i}_value`, e.target.value)} placeholder="e.g. 1500" />
                </div>
                <div>
                  <Label className="text-xs">Suffix</Label>
                  <Input value={settings[`impact_stat_${i}_suffix`] || ""} onChange={(e) => update(`impact_stat_${i}_suffix`, e.target.value)} placeholder="e.g. +" />
                </div>
                <div>
                  <Label className="text-xs">Label</Label>
                  <Input value={settings[`impact_stat_${i}_label`] || ""} onChange={(e) => update(`impact_stat_${i}_label`, e.target.value)} placeholder="e.g. Beneficiaries" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg"><Phone className="w-5 h-5 text-primary" />Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Email</Label><Input value={settings.email || ""} onChange={(e) => update("email", e.target.value)} /></div>
            <div><Label>Phone</Label><Input value={settings.phone || ""} onChange={(e) => update("phone", e.target.value)} /></div>
          </div>
          <div><Label>Address</Label><Textarea value={settings.address || ""} onChange={(e) => update("address", e.target.value)} rows={2} /></div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg"><Bell className="w-5 h-5 text-primary" />Notifications</CardTitle>
          <CardDescription>Admin email for form submission alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div><Label>Notification Email</Label><Input value={settings.notification_email || ""} onChange={(e) => update("notification_email", e.target.value)} placeholder="admin@agrfoundation.ngo" /></div>
          <p className="text-xs text-muted-foreground mt-1">An email will be sent to this address when someone submits a form</p>
        </CardContent>
      </Card>

      {/* YouTube Integration */}
      <Card className="rounded-xl shadow-sm border-red-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg"><Youtube className="w-5 h-5 text-red-600" />YouTube Auto-Sync</CardTitle>
          <CardDescription>Connect your YouTube channel to auto-display videos on the website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>YouTube API Key</Label>
            <Input value={settings.youtube_api_key || ""} onChange={(e) => update("youtube_api_key", e.target.value)} placeholder="AIzaSy..." />
            <p className="text-xs text-muted-foreground mt-1">Your Google Cloud YouTube Data API v3 key</p>
          </div>
          <div>
            <Label>YouTube Channel ID</Label>
            <Input value={settings.youtube_channel_id || ""} onChange={(e) => update("youtube_channel_id", e.target.value)} placeholder="UC..." />
            <p className="text-xs text-muted-foreground mt-1">Find at youtube.com/account_advanced or from your channel URL</p>
          </div>
          <div>
            <Label>Max Videos to Fetch</Label>
            <Input type="number" value={settings.youtube_max_results || "20"} onChange={(e) => update("youtube_max_results", e.target.value)} placeholder="20" min="1" max="50" />
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg"><Globe className="w-5 h-5 text-primary" />Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Facebook</Label><Input value={settings.facebook || ""} onChange={(e) => update("facebook", e.target.value)} placeholder="https://facebook.com/..." /></div>
            <div><Label>Instagram</Label><Input value={settings.instagram || ""} onChange={(e) => update("instagram", e.target.value)} placeholder="https://instagram.com/..." /></div>
            <div><Label>Twitter / X</Label><Input value={settings.twitter || ""} onChange={(e) => update("twitter", e.target.value)} placeholder="https://x.com/..." /></div>
            <div><Label>YouTube</Label><Input value={settings.youtube || ""} onChange={(e) => update("youtube", e.target.value)} placeholder="https://youtube.com/..." /></div>
            <div><Label>LinkedIn</Label><Input value={settings.linkedin || ""} onChange={(e) => update("linkedin", e.target.value)} placeholder="https://linkedin.com/..." /></div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={save} disabled={saving || uploading} size="lg" className="w-full rounded-xl">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save All Settings
      </Button>
    </div>
  );
};

export default SiteSettings;
