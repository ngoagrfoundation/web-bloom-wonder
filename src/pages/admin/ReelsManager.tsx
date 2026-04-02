import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Video, GripVertical } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface Reel {
  id: number;
  title: string;
  video_url: string;
  thumbnail: string;
  description: string;
  is_published: number;
  sort_order: number;
}

const adminFetch = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, { ...options, credentials: "include", headers: { "Content-Type": "application/json", ...options.headers } });
  if (res.status === 401) { window.location.href = "/admin"; throw new Error("Unauthorized"); }
  return res.json();
};

const ReelsManager = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Reel | null>(null);
  const [form, setForm] = useState({ title: "", video_url: "", thumbnail: "", description: "", is_published: 1, sort_order: 0 });

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminFetch(`${API_BASE_URL}/admin/reels.php`);
      setReels(res.data || []);
    } catch { toast.error("Failed to load reels"); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", video_url: "", thumbnail: "", description: "", is_published: 1, sort_order: reels.length });
    setDialogOpen(true);
  };

  const openEdit = (r: Reel) => {
    setEditing(r);
    setForm({ title: r.title, video_url: r.video_url, thumbnail: r.thumbnail, description: r.description, is_published: r.is_published, sort_order: r.sort_order });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.title || !form.video_url) { toast.error("Title and video URL are required"); return; }
    try {
      if (editing) {
        await adminFetch(`${API_BASE_URL}/admin/reels.php`, { method: "PUT", body: JSON.stringify({ id: editing.id, ...form }) });
        toast.success("Reel updated");
      } else {
        await adminFetch(`${API_BASE_URL}/admin/reels.php`, { method: "POST", body: JSON.stringify(form) });
        toast.success("Reel added");
      }
      setDialogOpen(false);
      load();
    } catch { toast.error("Failed to save"); }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this reel?")) return;
    try {
      await adminFetch(`${API_BASE_URL}/admin/reels.php?id=${id}`, { method: "DELETE" });
      toast.success("Deleted");
      load();
    } catch { toast.error("Failed to delete"); }
  };

  const togglePublish = async (r: Reel) => {
    await adminFetch(`${API_BASE_URL}/admin/reels.php`, { method: "PUT", body: JSON.stringify({ id: r.id, is_published: r.is_published ? 0 : 1 }) });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reels Manager</h2>
          <p className="text-sm text-muted-foreground">Manage video reels shown on the landing page</p>
        </div>
        <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" />Add Reel</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Video URL</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : reels.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No reels yet. Add your first one!</TableCell></TableRow>
              ) : reels.map((r, i) => (
                <TableRow key={r.id}>
                  <TableCell><GripVertical className="w-4 h-4 text-muted-foreground" />{i + 1}</TableCell>
                  <TableCell>
                    {r.thumbnail ? <img src={r.thumbnail} alt="" className="w-12 h-16 object-cover rounded" /> : <Video className="w-12 h-16 text-muted-foreground" />}
                  </TableCell>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">{r.video_url}</TableCell>
                  <TableCell>
                    <Switch checked={!!r.is_published} onCheckedChange={() => togglePublish(r)} />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Reel" : "Add Reel"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Video URL * (YouTube, Instagram, or direct link)</Label><Input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." /></div>
            <div><Label>Thumbnail URL</Label><Input value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} placeholder="https://..." /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
            <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
            <div className="flex items-center gap-2"><Switch checked={!!form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v ? 1 : 0 })} /><Label>Published</Label></div>
            <Button onClick={save} className="w-full">{editing ? "Update" : "Add"} Reel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReelsManager;
