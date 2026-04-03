import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Inbox, Upload, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { uploadImage } from "@/lib/admin-api";

interface Sponsor {
  id: number; name: string; logo: string; website_url: string;
  sort_order: number; is_published: number;
}

const adminFetch = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, { ...options, credentials: "include", headers: { "Content-Type": "application/json", ...options.headers } });
  if (res.status === 401) { window.location.href = "/admin"; throw new Error("Unauthorized"); }
  return res.json();
};

const SponsorsManager = () => {
  const [items, setItems] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [form, setForm] = useState({ name: "", logo: "", website_url: "", sort_order: 0, is_published: 1 });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { const res = await adminFetch(`${API_BASE_URL}/admin/sponsors.php`); setItems(res.data || []); }
    catch { toast.error("Failed to load"); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ name: "", logo: "", website_url: "", sort_order: items.length, is_published: 1 }); setLogoFile(null); setDialogOpen(true); };
  const openEdit = (s: Sponsor) => { setEditing(s); setForm({ name: s.name, logo: s.logo, website_url: s.website_url, sort_order: s.sort_order, is_published: s.is_published }); setLogoFile(null); setDialogOpen(true); };

  const save = async () => {
    if (!form.name) { toast.error("Name is required"); return; }
    setUploading(true);
    try {
      let logo = form.logo;
      if (logoFile) {
        const result = await uploadImage(logoFile, "sponsors");
        if (result.path) logo = result.path;
      }
      const payload = { ...form, logo };
      if (editing) {
        await adminFetch(`${API_BASE_URL}/admin/sponsors.php`, { method: "PUT", body: JSON.stringify({ id: editing.id, ...payload }) });
        toast.success("Updated");
      } else {
        await adminFetch(`${API_BASE_URL}/admin/sponsors.php`, { method: "POST", body: JSON.stringify(payload) });
        toast.success("Added");
      }
      setDialogOpen(false); load();
    } catch { toast.error("Failed to save"); }
    setUploading(false);
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this sponsor?")) return;
    try { await adminFetch(`${API_BASE_URL}/admin/sponsors.php?id=${id}`, { method: "DELETE" }); toast.success("Deleted"); load(); }
    catch { toast.error("Failed"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} sponsors</p>
        <Button onClick={openNew} className="rounded-lg"><Plus className="w-4 h-4 mr-2" />Add Sponsor</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <Card className="rounded-xl shadow-sm"><CardContent className="py-16 flex flex-col items-center text-muted-foreground gap-2"><Inbox className="h-8 w-8 text-muted-foreground/40" /><p className="text-sm">No sponsors yet</p></CardContent></Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((s) => (
            <Card key={s.id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <CardContent className="p-4 text-center">
                {s.logo ? <img src={s.logo} alt={s.name} className="h-16 mx-auto object-contain mb-3" /> : <div className="h-16 flex items-center justify-center text-muted-foreground text-2xl font-bold mb-3">{s.name[0]}</div>}
                <p className="font-medium text-sm truncate">{s.name}</p>
                {!s.is_published && <span className="text-xs text-muted-foreground">(Hidden)</span>}
                <div className="flex justify-center gap-1 mt-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(s)}><Edit className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(s.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Sponsor" : "Add Sponsor"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div>
              <Label>Logo</Label>
              {form.logo && !logoFile && (
                <div className="relative inline-block mt-1"><img src={form.logo} alt="" className="h-16 object-contain rounded-lg border" /><Button size="icon" variant="destructive" className="absolute -top-1 -right-1 h-5 w-5" onClick={() => setForm({ ...form, logo: "" })}><X className="h-3 w-3" /></Button></div>
              )}
              <div className="border-2 border-dashed rounded-lg p-3 text-center mt-1">
                {logoFile ? (
                  <div className="flex items-center justify-between"><span className="text-sm truncate">{logoFile.name}</span><Button variant="ghost" size="icon" onClick={() => setLogoFile(null)}><X className="h-4 w-4" /></Button></div>
                ) : (
                  <label className="cursor-pointer"><Upload className="h-5 w-5 mx-auto text-muted-foreground mb-1" /><p className="text-xs text-muted-foreground">Upload logo</p><input type="file" accept="image/*" className="hidden" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} /></label>
                )}
              </div>
            </div>
            <div><Label>Website URL</Label><Input value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} placeholder="https://..." /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
              <div className="flex items-end gap-2 pb-1"><Switch checked={!!form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v ? 1 : 0 })} /><Label>Published</Label></div>
            </div>
            <Button onClick={save} disabled={uploading} className="w-full">{uploading ? "Uploading..." : editing ? "Update" : "Add"} Sponsor</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorsManager;
