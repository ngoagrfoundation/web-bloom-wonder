import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Building2, Phone, Globe, Loader2, Bell, Upload, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { uploadImage } from "@/lib/admin-api";

const adminFetch = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, { ...options, credentials: "include", headers: { "Content-Type": "application/json", ...options.headers } });
  if (res.status === 401) { window.location.href = "/admin"; throw new Error("Unauthorized"); }
  return res.json();
};

const SiteSettings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
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
      if (logoFile) await handleImageUpload(logoFile, "logo_url");
      if (heroFile) await handleImageUpload(heroFile, "hero_bg_url");
      await adminFetch(`${API_BASE_URL}/admin/settings.php`, { method: "PUT", body: JSON.stringify(settings) });
      toast.success("Settings saved!");
      setLogoFile(null);
      setHeroFile(null);
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold">Site Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your foundation's profile, contact info, and social links</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" />Organization Profile</CardTitle>
          <CardDescription>Basic information about your foundation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Organization Name</Label><Input value={settings.org_name || ""} onChange={(e) => update("org_name", e.target.value)} /></div>
          <div><Label>Tagline</Label><Input value={settings.tagline || ""} onChange={(e) => update("tagline", e.target.value)} /></div>
          <div><Label>About Text</Label><Textarea value={settings.about_text || ""} onChange={(e) => update("about_text", e.target.value)} rows={4} /></div>
          {/* Logo upload */}
          <div>
            <Label>Logo Image</Label>
            {settings.logo_url && (
              <div className="relative mt-1 inline-block">
                <img src={settings.logo_url} alt="Logo" className="h-16 object-contain" />
                <Button size="icon" variant="destructive" className="absolute -top-1 -right-1 h-5 w-5" onClick={() => update("logo_url", "")}><X className="h-3 w-3" /></Button>
              </div>
            )}
            <div className="border-2 border-dashed rounded-lg p-3 text-center mt-1">
              <label className="cursor-pointer">
                <Upload className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">Upload logo</p>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageUpload(f, "logo_url");
                }} />
              </label>
            </div>
          </div>
          {/* Hero background */}
          <div>
            <Label>Hero Background Image</Label>
            {settings.hero_bg_url && (
              <div className="relative mt-1">
                <img src={settings.hero_bg_url} alt="Hero" className="w-full h-24 object-cover rounded" />
                <Button size="icon" variant="destructive" className="absolute top-1 right-1 h-5 w-5" onClick={() => update("hero_bg_url", "")}><X className="h-3 w-3" /></Button>
              </div>
            )}
            <div className="border-2 border-dashed rounded-lg p-3 text-center mt-1">
              <label className="cursor-pointer">
                <Upload className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                <p className="text-xs text-muted-foreground">Upload hero background</p>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageUpload(f, "hero_bg_url");
                }} />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Phone className="w-5 h-5" />Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Email</Label><Input value={settings.email || ""} onChange={(e) => update("email", e.target.value)} /></div>
          <div><Label>Phone</Label><Input value={settings.phone || ""} onChange={(e) => update("phone", e.target.value)} /></div>
          <div><Label>Address</Label><Textarea value={settings.address || ""} onChange={(e) => update("address", e.target.value)} rows={2} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" />Notifications</CardTitle>
          <CardDescription>Admin email for form submission alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div><Label>Notification Email</Label><Input value={settings.notification_email || ""} onChange={(e) => update("notification_email", e.target.value)} placeholder="admin@agrfoundation.ngo" /></div>
          <p className="text-xs text-muted-foreground mt-1">An email will be sent to this address when someone submits a form</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" />Social Media Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Facebook</Label><Input value={settings.facebook || ""} onChange={(e) => update("facebook", e.target.value)} placeholder="https://facebook.com/..." /></div>
          <div><Label>Instagram</Label><Input value={settings.instagram || ""} onChange={(e) => update("instagram", e.target.value)} placeholder="https://instagram.com/..." /></div>
          <div><Label>Twitter / X</Label><Input value={settings.twitter || ""} onChange={(e) => update("twitter", e.target.value)} placeholder="https://x.com/..." /></div>
          <div><Label>YouTube</Label><Input value={settings.youtube || ""} onChange={(e) => update("youtube", e.target.value)} placeholder="https://youtube.com/..." /></div>
          <div><Label>LinkedIn</Label><Input value={settings.linkedin || ""} onChange={(e) => update("linkedin", e.target.value)} placeholder="https://linkedin.com/..." /></div>
        </CardContent>
      </Card>

      <Button onClick={save} disabled={saving || uploading} size="lg" className="w-full">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save All Settings
      </Button>
    </div>
  );
};

export default SiteSettings;
