import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Video, GripVertical, Upload, X, Search, Link as LinkIcon, Inbox } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { uploadImage } from "@/lib/admin-api";

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
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [publishFilter, setPublishFilter] = useState("all");
  const [videoInputMode, setVideoInputMode] = useState<"url" | "upload">("url");

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminFetch(`${API_BASE_URL}/admin/reels.php`);
      setReels(res.data || []);
    } catch { toast.error("Failed to load reels"); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filteredReels = reels.filter(r => {
    if (publishFilter === "published" && !r.is_published) return false;
    if (publishFilter === "draft" && r.is_published) return false;
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", video_url: "", thumbnail: "", description: "", is_published: 1, sort_order: reels.length });
    setThumbnailFile(null); setVideoFile(null); setVideoInputMode("url");
    setDialogOpen(true);
  };

  const openEdit = (r: Reel) => {
    setEditing(r);
    setForm({ title: r.title, video_url: r.video_url, thumbnail: r.thumbnail, description: r.description, is_published: r.is_published, sort_order: r.sort_order });
    setThumbnailFile(null); setVideoFile(null); setVideoInputMode("url");
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.title) { toast.error("Title is required"); return; }
    if (!form.video_url && !videoFile) { toast.error("Video URL or file is required"); return; }
    setUploading(true);
    try {
      let thumbnail = form.thumbnail;
      let videoUrl = form.video_url;

      if (thumbnailFile) {
        const result = await uploadImage(thumbnailFile, "reels");
        if (result.path) thumbnail = result.path;
      }
      if (videoFile) {
        const result = await uploadImage(videoFile, "reels");
        if (result.path) videoUrl = result.path;
        else { toast.error("Video upload failed"); setUploading(false); return; }
      }

      const payload = { ...form, thumbnail, video_url: videoUrl };
      if (editing) {
        await adminFetch(`${API_BASE_URL}/admin/reels.php`, { method: "PUT", body: JSON.stringify({ id: editing.id, ...payload }) });
        toast.success("Reel updated");
      } else {
        await adminFetch(`${API_BASE_URL}/admin/reels.php`, { method: "POST", body: JSON.stringify(payload) });
        toast.success("Reel added");
      }
      setDialogOpen(false);
      load();
    } catch { toast.error("Failed to save"); }
    setUploading(false);
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this reel?")) return;
    try { await adminFetch(`${API_BASE_URL}/admin/reels.php?id=${id}`, { method: "DELETE" }); toast.success("Deleted"); load(); }
    catch { toast.error("Failed to delete"); }
  };

  const togglePublish = async (r: Reel) => {
    await adminFetch(`${API_BASE_URL}/admin/reels.php`, { method: "PUT", body: JSON.stringify({ id: r.id, is_published: r.is_published ? 0 : 1 }) });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{reels.length} reels</p>
        <Button onClick={openNew} className="rounded-lg"><Plus className="w-4 h-4 mr-2" />Add Reel</Button>
      </div>

      {/* Filters */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="py-3 flex flex-wrap gap-2 items-center">
          <Input placeholder="Search title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-48 h-9" />
          <Select value={publishFilter} onValueChange={setPublishFilter}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Unpublished</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
          ) : filteredReels.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
              <Inbox className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm">No reels found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Video URL</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReels.map((r, i) => (
                  <TableRow key={r.id} className="hover:bg-muted/30">
                    <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                    <TableCell>
                      {r.thumbnail ? <img src={r.thumbnail} alt="" className="w-12 h-16 object-cover rounded-lg" /> : <Video className="w-12 h-16 text-muted-foreground/40" />}
                    </TableCell>
                    <TableCell className="font-medium">{r.title}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">{r.video_url}</TableCell>
                    <TableCell><Switch checked={!!r.is_published} onCheckedChange={() => togglePublish(r)} /></TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(r)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => remove(r.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Reel" : "Add Reel"}</DialogTitle><DialogDescription className="sr-only">Manage reel details</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>

            {/* Video input: URL or Upload */}
            <div>
              <Label className="mb-2 block">Video Source *</Label>
              <Tabs value={videoInputMode} onValueChange={(v) => setVideoInputMode(v as "url" | "upload")}>
                <TabsList className="h-9 mb-2">
                  <TabsTrigger value="url" className="gap-1.5"><LinkIcon className="h-3.5 w-3.5" />URL</TabsTrigger>
                  <TabsTrigger value="upload" className="gap-1.5"><Upload className="h-3.5 w-3.5" />Upload Video</TabsTrigger>
                </TabsList>
                <TabsContent value="url">
                  <Input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
                </TabsContent>
                <TabsContent value="upload">
                  <div className="border-2 border-dashed rounded-lg p-3 text-center">
                    {videoFile ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm truncate">{videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(1)}MB)</span>
                        <Button variant="ghost" size="icon" onClick={() => setVideoFile(null)}><X className="h-4 w-4" /></Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                        <p className="text-xs text-muted-foreground">Upload MP4 or WebM (max 50MB)</p>
                        <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
                      </label>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Thumbnail */}
            <div>
              <Label>Thumbnail</Label>
              {form.thumbnail && !thumbnailFile && (
                <div className="relative mt-1">
                  <img src={form.thumbnail} alt="" className="w-full h-24 object-cover rounded-lg" />
                  <Button size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6" onClick={() => setForm({ ...form, thumbnail: "" })}><X className="h-3 w-3" /></Button>
                </div>
              )}
              <div className="border-2 border-dashed rounded-lg p-3 text-center mt-1">
                {thumbnailFile ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">{thumbnailFile.name}</span>
                    <Button variant="ghost" size="icon" onClick={() => setThumbnailFile(null)}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                    <p className="text-xs text-muted-foreground">Upload thumbnail</p>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                  </label>
                )}
              </div>
            </div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
              <div className="flex items-end gap-2 pb-1"><Switch checked={!!form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v ? 1 : 0 })} /><Label>Published</Label></div>
            </div>
            <Button onClick={save} disabled={uploading} className="w-full">{uploading ? "Uploading..." : editing ? "Update" : "Add"} Reel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReelsManager;
