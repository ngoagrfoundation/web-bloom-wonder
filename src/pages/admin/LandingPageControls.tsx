import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Globe,
  LayoutTemplate,
  Loader2,
  Monitor,
  Phone,
  Save,
  Sliders,
  Upload,
  Video,
  X,
  Image as ImageIcon,
} from "lucide-react";
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
  { key: "youtube", label: "YouTube Section", desc: "Latest YouTube videos grid" },
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

const heroSlides = [
  { index: 1, label: "Slide 1", title: "Our Motto is,", subtitle: "Building a self-sustainable and eco-friendly society", link: "/#about" },
  { index: 2, label: "Slide 2", title: "Education for All,", subtitle: "Building Futures", link: "/programs/education" },
  { index: 3, label: "Slide 3", title: "Healthcare Access,", subtitle: "Saving Lives", link: "/programs/healthcare" },
  { index: 4, label: "Slide 4", title: "Skill Development,", subtitle: "Creating Opportunities", link: "/focus/skill-development" },
  { index: 5, label: "Slide 5", title: "Free Online,", subtitle: "Sanskrit Classes", link: "/programs/learning-sanskrit" },
  { index: 6, label: "Slide 6", title: "Free Dental,", subtitle: "Treatment Camp", link: "/programs/dental-treatment" },
];

const LandingPageControls = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [initialSettings, setInitialSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    adminFetch(`${API_BASE_URL}/admin/settings.php`)
      .then((res) => {
        const loadedSettings = res.data || {};
        setSettings(loadedSettings);
        setInitialSettings(loadedSettings);
      })
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const isEnabled = (key: string) => settings[`section_${key}_enabled`] !== "0";
  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };
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
      setInitialSettings(settings);
      toast.success("Landing page settings saved!");
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };

  const hasUnsavedChanges = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(initialSettings),
    [initialSettings, settings],
  );

  const visibleSectionCount = useMemo(
    () => sections.filter((section) => isEnabled(section.key)).length,
    [settings],
  );

  const imageOverrideCount = useMemo(
    () => sectionImages.filter((image) => Boolean(settings[image.key])).length,
    [settings],
  );

  const heroOverrideCount = useMemo(
    () => heroSlides.filter((slide) => {
      return Boolean(
        settings[`hero_slide_${slide.index}`] ||
        settings[`hero_slide_${slide.index}_title`] ||
        settings[`hero_slide_${slide.index}_subtitle`] ||
        settings[`hero_slide_${slide.index}_description`] ||
        settings[`hero_slide_${slide.index}_link`] ||
        settings[`hero_slide_${slide.index}_cta_label`],
      );
    }).length,
    [settings],
  );

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary via-primary to-emerald-700 p-6 text-primary-foreground shadow-sm lg:p-8">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/85">
              <Monitor className="h-3.5 w-3.5" />
              Homepage Control Center
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">AGR Foundation Landing Page</h1>
              <p className="mt-2 text-sm leading-6 text-white/80 lg:text-base">
                The Landing Page menu now manages homepage visibility, hero content, impact messaging, section media,
                and contact details in one place.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">Visible Sections</p>
                <p className="mt-2 text-3xl font-semibold">{visibleSectionCount}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">Custom Images</p>
                <p className="mt-2 text-3xl font-semibold">{imageOverrideCount}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/70">Hero Overrides</p>
                <p className="mt-2 text-3xl font-semibold">{heroOverrideCount}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              className="gap-2 bg-white text-foreground hover:bg-white/90"
              onClick={() => window.open("/", "_blank")}
            >
              <ArrowUpRight className="h-4 w-4" />
              Open Homepage
            </Button>
            <Badge variant={hasUnsavedChanges ? "secondary" : "outline"} className="h-10 rounded-full px-4 text-sm">
              {hasUnsavedChanges ? "Unsaved changes" : "All changes saved"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Sliders className="w-5 h-5 text-primary" />Landing Page Sections</CardTitle>
            <CardDescription>Enable or disable sections on the public landing page.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {sections.map((section) => (
              <div
                key={section.key}
                className={`rounded-2xl border p-4 transition-colors ${
                  isEnabled(section.key) ? "border-primary/20 bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{section.label}</p>
                      <Badge variant={isEnabled(section.key) ? "default" : "outline"}>
                        {isEnabled(section.key) ? "Live" : "Hidden"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{section.desc}</p>
                  </div>
                  <Switch checked={isEnabled(section.key)} onCheckedChange={() => toggleSection(section.key)} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><CheckCircle2 className="w-5 h-5 text-emerald-600" />Homepage Status</CardTitle>
            <CardDescription>Quick health check for the homepage configuration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl bg-muted/40 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Contact details</p>
                  <p className="text-xs text-muted-foreground">Phone, email, or address available for the contact block.</p>
                </div>
                <Badge variant={settings.phone || settings.email || settings.address ? "default" : "outline"}>
                  {settings.phone || settings.email || settings.address ? "Ready" : "Needs setup"}
                </Badge>
              </div>
            </div>
            <div className="rounded-2xl bg-muted/40 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Hero slider</p>
                  <p className="text-xs text-muted-foreground">Slides, images, and CTA copy can now be managed here.</p>
                </div>
                <Badge variant="outline">{heroSlides.length} slides</Badge>
              </div>
            </div>
            <div className="rounded-2xl bg-muted/40 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">Video sections</p>
                  <p className="text-xs text-muted-foreground">Reels and YouTube titles plus counts are now editable here.</p>
                </div>
                <Badge variant="outline">Enhanced</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><LayoutTemplate className="w-5 h-5 text-primary" />Hero Slide Content</CardTitle>
            <CardDescription>Edit slide copy and links without leaving the Landing Page workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {heroSlides.map((slide) => (
              <div key={slide.index} className="rounded-2xl border border-border p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{slide.label}</p>
                    <p className="text-xs text-muted-foreground">{slide.title} {slide.subtitle}</p>
                  </div>
                  <Badge variant="outline">Hero</Badge>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`hero-title-${slide.index}`}>Title</Label>
                    <Input
                      id={`hero-title-${slide.index}`}
                      value={settings[`hero_slide_${slide.index}_title`] || ""}
                      onChange={(e) => updateSetting(`hero_slide_${slide.index}_title`, e.target.value)}
                      placeholder={slide.title}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`hero-subtitle-${slide.index}`}>Subtitle</Label>
                    <Input
                      id={`hero-subtitle-${slide.index}`}
                      value={settings[`hero_slide_${slide.index}_subtitle`] || ""}
                      onChange={(e) => updateSetting(`hero_slide_${slide.index}_subtitle`, e.target.value)}
                      placeholder={slide.subtitle}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`hero-description-${slide.index}`}>Description</Label>
                  <Textarea
                    id={`hero-description-${slide.index}`}
                    rows={3}
                    value={settings[`hero_slide_${slide.index}_description`] || ""}
                    onChange={(e) => updateSetting(`hero_slide_${slide.index}_description`, e.target.value)}
                    placeholder="Override the slide description"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`hero-link-${slide.index}`}>Primary link</Label>
                    <Input
                      id={`hero-link-${slide.index}`}
                      value={settings[`hero_slide_${slide.index}_link`] || ""}
                      onChange={(e) => updateSetting(`hero_slide_${slide.index}_link`, e.target.value)}
                      placeholder={slide.link}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`hero-cta-${slide.index}`}>Primary button label</Label>
                    <Input
                      id={`hero-cta-${slide.index}`}
                      value={settings[`hero_slide_${slide.index}_cta_label`] || ""}
                      onChange={(e) => updateSetting(`hero_slide_${slide.index}_cta_label`, e.target.value)}
                      placeholder="Learn More"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><FileText className="w-5 h-5 text-primary" />Homepage Copy</CardTitle>
              <CardDescription>Control the major landing-page headlines and supporting text.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-title">About section title</Label>
                <Input id="about-title" value={settings.about_title || ""} onChange={(e) => updateSetting("about_title", e.target.value)} placeholder={`About ${settings.org_name || "AGR Foundation"}`} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-subtitle">About section subtitle</Label>
                <Input id="about-subtitle" value={settings.about_subtitle || ""} onChange={(e) => updateSetting("about_subtitle", e.target.value)} placeholder={settings.tagline || "Empowering Communities, Sustaining the Future."} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="programs-title">Programs title</Label>
                <Input id="programs-title" value={settings.programs_title || ""} onChange={(e) => updateSetting("programs_title", e.target.value)} placeholder="Our Programs" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="programs-description">Programs description</Label>
                <Textarea id="programs-description" rows={3} value={settings.programs_description || ""} onChange={(e) => updateSetting("programs_description", e.target.value)} placeholder="Describe the programs section on the homepage." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="impact-title">Impact title</Label>
                <Input id="impact-title" value={settings.impact_title || ""} onChange={(e) => updateSetting("impact_title", e.target.value)} placeholder="Our Impact in Numbers" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="impact-description">Impact description</Label>
                <Textarea id="impact-description" rows={3} value={settings.impact_description || ""} onChange={(e) => updateSetting("impact_description", e.target.value)} placeholder="Explain the impact section." />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><BarChart3 className="w-5 h-5 text-primary" />Impact Stats</CardTitle>
              <CardDescription>Update the four counters shown on the landing page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="grid gap-3 rounded-2xl border border-border p-3 md:grid-cols-3">
                  <Input value={settings[`impact_stat_${i}_value`] || ""} onChange={(e) => updateSetting(`impact_stat_${i}_value`, e.target.value)} placeholder="Value" />
                  <Input value={settings[`impact_stat_${i}_suffix`] || ""} onChange={(e) => updateSetting(`impact_stat_${i}_suffix`, e.target.value)} placeholder="Suffix" />
                  <Input value={settings[`impact_stat_${i}_label`] || ""} onChange={(e) => updateSetting(`impact_stat_${i}_label`, e.target.value)} placeholder="Label" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Video className="w-5 h-5 text-primary" />Video Sections</CardTitle>
            <CardDescription>Refine the landing-page Reels and YouTube sections.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reels-title">Reels title</Label>
              <Input id="reels-title" value={settings.reels_title || ""} onChange={(e) => updateSetting("reels_title", e.target.value)} placeholder="Impact in Action" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reels-description">Reels description</Label>
              <Textarea id="reels-description" rows={3} value={settings.reels_description || ""} onChange={(e) => updateSetting("reels_description", e.target.value)} placeholder="Describe the reels section." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reels-count">Homepage reels count</Label>
              <Input id="reels-count" type="number" min="1" max="20" value={settings.reels_homepage_count || ""} onChange={(e) => updateSetting("reels_homepage_count", e.target.value)} placeholder="10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube-title">YouTube title</Label>
              <Input id="youtube-title" value={settings.youtube_title || ""} onChange={(e) => updateSetting("youtube_title", e.target.value)} placeholder="Latest Videos" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube-description">YouTube description</Label>
              <Textarea id="youtube-description" rows={3} value={settings.youtube_description || ""} onChange={(e) => updateSetting("youtube_description", e.target.value)} placeholder="Describe the YouTube section." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube-homepage-count">Homepage YouTube count</Label>
              <Input id="youtube-homepage-count" type="number" min="1" max="12" value={settings.youtube_homepage_count || ""} onChange={(e) => updateSetting("youtube_homepage_count", e.target.value)} placeholder="8" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Phone className="w-5 h-5 text-primary" />Contact Block</CardTitle>
            <CardDescription>Control homepage contact information, social links, and the map embed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-title">Contact title</Label>
              <Input id="contact-title" value={settings.contact_title || ""} onChange={(e) => updateSetting("contact_title", e.target.value)} placeholder="Contact Us" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-description">Contact description</Label>
              <Textarea id="contact-description" rows={3} value={settings.contact_description || ""} onChange={(e) => updateSetting("contact_description", e.target.value)} placeholder="Have questions or want to get involved? Reach out to us." />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Input value={settings.email || ""} onChange={(e) => updateSetting("email", e.target.value)} placeholder="Email" />
              <Input value={settings.phone || ""} onChange={(e) => updateSetting("phone", e.target.value)} placeholder="Phone" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-address">Address</Label>
              <Textarea id="contact-address" rows={3} value={settings.address || ""} onChange={(e) => updateSetting("address", e.target.value)} placeholder="Office address" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Input value={settings.facebook || ""} onChange={(e) => updateSetting("facebook", e.target.value)} placeholder="Facebook URL" />
              <Input value={settings.instagram || ""} onChange={(e) => updateSetting("instagram", e.target.value)} placeholder="Instagram URL" />
              <Input value={settings.twitter || ""} onChange={(e) => updateSetting("twitter", e.target.value)} placeholder="X / Twitter URL" />
              <Input value={settings.linkedin || ""} onChange={(e) => updateSetting("linkedin", e.target.value)} placeholder="LinkedIn URL" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-map">Google Maps embed URL</Label>
              <Textarea id="contact-map" rows={3} value={settings.contact_map_embed_url || ""} onChange={(e) => updateSetting("contact_map_embed_url", e.target.value)} placeholder="https://www.google.com/maps/embed?pb=..." />
            </div>
            <div className="rounded-2xl bg-muted/40 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Globe className="h-4 w-4 text-primary" />
                  Contact section readiness
                </div>
                <Badge variant={settings.phone || settings.email || settings.address ? "default" : "outline"}>
                  {settings.phone || settings.email || settings.address ? "Ready" : "Missing basics"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><LayoutTemplate className="w-5 h-5 text-primary" />Hero Slide Images</CardTitle>
          <CardDescription>Replace hero slider images directly from the landing-page manager.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {heroSlides.map((slide) => {
            const imageKey = `hero_slide_${slide.index}`;
            return (
              <div key={slide.index} className="rounded-2xl border border-border p-4">
                <div className="mb-4 h-36 overflow-hidden rounded-xl bg-muted">
                  {settings[imageKey] ? (
                    <img src={settings[imageKey]} alt={slide.label} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{slide.label}</p>
                  <p className="text-xs text-muted-foreground">{slide.title} {slide.subtitle}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  {settings[imageKey] && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeImage(imageKey)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <label className="cursor-pointer flex-1">
                    <Button variant="outline" size="sm" className="pointer-events-none w-full" disabled={uploadingKey === imageKey}>
                      {uploadingKey === imageKey ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <Upload className="h-3 w-3 mr-1" />}
                      {settings[imageKey] ? "Replace" : "Upload"}
                    </Button>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, imageKey);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="sticky bottom-4 z-20 rounded-2xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Landing page updates are ready to publish.</p>
            <p className="text-xs text-muted-foreground">This workspace now controls homepage visibility, hero content, media overrides, videos, and contact details.</p>
          </div>
          <Button onClick={save} disabled={saving || !hasUnsavedChanges} size="lg" className="rounded-xl">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {hasUnsavedChanges ? "Save Landing Page" : "All Changes Saved"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPageControls;
