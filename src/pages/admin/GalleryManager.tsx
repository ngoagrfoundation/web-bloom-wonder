import { useEffect, useState, useRef } from "react";
import { getGalleryImages, uploadGalleryImage, updateGalleryImage, deleteGalleryImage } from "@/lib/admin-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2, Edit, Upload, X, FolderOpen, CheckSquare, Square, Inbox, Images } from "lucide-react";
import { toast } from "sonner";

const defaultFolders = ["sustainability", "education", "healthcare", "community", "livelihood", "events", "volunteers", "others"];

interface GalleryImage { id: number; src: string; alt: string; category: string; caption: string; tags?: string; sort_order: number; }

const GalleryManager = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [editImage, setEditImage] = useState<GalleryImage | null>(null);
  const [uploadForm, setUploadForm] = useState({ alt: "", category: "community", caption: "", tags: "", customCategory: "" });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [editCustomCategory, setEditCustomCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => { setLoading(true); try { const result = await getGalleryImages(); setImages(result.data || []); } catch { toast.error("Failed to load gallery"); } setLoading(false); };
  useEffect(() => { fetchData(); }, []);

  const allFolders = Array.from(new Set([...defaultFolders, ...images.map(img => img.category).filter(c => c && !defaultFolders.includes(c))]));
  const filteredImages = images.filter(img => {
    if (filterCategory !== "all" && img.category !== filterCategory) return false;
    if (searchQuery && !img.alt.toLowerCase().includes(searchQuery.toLowerCase()) && !img.caption?.toLowerCase().includes(searchQuery.toLowerCase()) && !(img.tags || "").toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });
  const folderCounts = images.reduce<Record<string, number>>((acc, img) => { acc[img.category] = (acc[img.category] || 0) + 1; return acc; }, {});

  const handleUpload = async () => {
    if (selectedFiles.length === 0) { toast.error("Please select at least one image"); return; }
    setUploading(true);
    const category = uploadForm.category === "others" ? uploadForm.customCategory || "others" : uploadForm.category;
    let success = 0;
    setUploadProgress({ current: 0, total: selectedFiles.length });

    for (let i = 0; i < selectedFiles.length; i++) {
      setUploadProgress({ current: i + 1, total: selectedFiles.length });
      try {
        const formData = new FormData();
        formData.append("image", selectedFiles[i]);
        formData.append("alt", uploadForm.alt || selectedFiles[i].name.replace(/\.[^.]+$/, ""));
        formData.append("category", category);
        formData.append("caption", uploadForm.caption);
        formData.append("tags", uploadForm.tags);
        const result = await uploadGalleryImage(formData);
        if (!result.error) success++;
      } catch {}
    }

    toast.success(`${success}/${selectedFiles.length} images uploaded!`);
    setShowUpload(false);
    setSelectedFiles([]);
    setUploadForm({ alt: "", category: "community", caption: "", tags: "", customCategory: "" });
    setUploadProgress({ current: 0, total: 0 });
    fetchData();
    setUploading(false);
  };

  const handleUpdate = async () => {
    if (!editImage) return;
    const category = editImage.category === "others" ? editCustomCategory || "others" : editImage.category;
    try { await updateGalleryImage({ id: editImage.id, alt: editImage.alt, category, caption: editImage.caption, tags: editImage.tags }); toast.success("Updated"); setEditImage(null); fetchData(); }
    catch { toast.error("Update failed"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this image?")) return;
    try { await deleteGalleryImage(id); toast.success("Deleted"); fetchData(); } catch { toast.error("Failed"); }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.size || !confirm(`Delete ${selectedIds.size} images?`)) return;
    for (const id of selectedIds) { try { await deleteGalleryImage(id); } catch {} }
    toast.success(`${selectedIds.size} deleted`); setSelectedIds(new Set()); fetchData();
  };

  const toggleSelect = (id: number) => { setSelectedIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; }); };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    if (files.length > 0) {
      setSelectedFiles(files);
      setShowUpload(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  return (
    <div
      className="space-y-4"
      ref={dropRef}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-primary/10 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="bg-background border-2 border-dashed border-primary rounded-2xl p-12 text-center">
            <Images className="h-12 w-12 text-primary mx-auto mb-3" />
            <p className="text-lg font-medium text-foreground">Drop images here to upload</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{images.length} images</p>
        <div className="flex gap-2">
          {selectedIds.size > 0 && <Button variant="destructive" size="sm" onClick={handleBulkDelete}><Trash2 className="h-4 w-4 mr-1" /> Delete {selectedIds.size}</Button>}
          <Button onClick={() => setShowUpload(true)} className="rounded-lg"><Plus className="h-4 w-4 mr-2" /> Upload Images</Button>
        </div>
      </div>

      {/* Folder Filters */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="py-3 flex flex-wrap gap-2 items-center">
          <Input placeholder="Search alt/caption/tags..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-52 h-9" />
          <Button variant={filterCategory === "all" ? "default" : "outline"} size="sm" className="h-9 gap-1" onClick={() => setFilterCategory("all")}>
            <FolderOpen className="h-3 w-3" /> All <Badge variant="secondary" className="ml-1">{images.length}</Badge>
          </Button>
          {allFolders.map(folder => (
            <Button key={folder} variant={filterCategory === folder ? "default" : "outline"} size="sm" className="h-9 gap-1" onClick={() => setFilterCategory(folder)}>
              {folder.charAt(0).toUpperCase() + folder.slice(1)}
              {folderCounts[folder] ? <Badge variant="secondary" className="ml-1">{folderCounts[folder]}</Badge> : null}
            </Button>
          ))}
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="aspect-video rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : filteredImages.length === 0 ? (
        <Card className="rounded-xl shadow-sm"><CardContent className="py-16 flex flex-col items-center text-muted-foreground gap-2">
          <Inbox className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm">{filterCategory === "all" && !searchQuery ? "No gallery images yet. Upload your first image!" : "No images match filters."}</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredImages.map((img) => (
            <Card key={img.id} className={`overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow ${selectedIds.has(img.id) ? 'ring-2 ring-primary' : ''}`}>
              <div className="aspect-video relative">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute top-2 left-2">
                  <Button size="icon" variant="secondary" className="h-7 w-7 rounded-lg" onClick={() => toggleSelect(img.id)}>
                    {selectedIds.has(img.id) ? <CheckSquare className="h-3 w-3" /> : <Square className="h-3 w-3" />}
                  </Button>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button size="icon" variant="secondary" className="h-7 w-7 rounded-lg" onClick={() => { setEditImage(img); setEditCustomCategory(img.category); }}><Edit className="h-3 w-3" /></Button>
                  <Button size="icon" variant="destructive" className="h-7 w-7 rounded-lg" onClick={() => handleDelete(img.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{img.alt || "No title"}</p>
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  <Badge variant="outline" className="text-[10px]"><FolderOpen className="h-2.5 w-2.5 mr-0.5" />{img.category}</Badge>
                  {img.tags && img.tags.split(",").filter(Boolean).map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t.trim()}</Badge>)}
                </div>
                {img.caption && <p className="text-xs text-muted-foreground mt-1 truncate">{img.caption}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Upload Images</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Image Files</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                {selectedFiles.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedFiles.slice(0, 5).map((f, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{f.name}</Badge>
                      ))}
                      {selectedFiles.length > 5 && <Badge variant="outline" className="text-xs">+{selectedFiles.length - 5} more</Badge>}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedFiles([])}><X className="h-3 w-3 mr-1" /> Clear</Button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-foreground">Click to select or drag & drop</p>
                    <p className="text-xs text-muted-foreground mt-1">Multiple images supported (max 5MB each)</p>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
                  </label>
                )}
              </div>
            </div>
            <div><Label>Alt Text / Title (shared)</Label><Input value={uploadForm.alt} onChange={(e) => setUploadForm(f => ({ ...f, alt: e.target.value }))} placeholder="Describe the images (or leave blank for filename)" /></div>
            <div>
              <Label>Folder</Label>
              <Select value={uploadForm.category} onValueChange={(v) => setUploadForm(f => ({ ...f, category: v }))}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{allFolders.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}</SelectContent>
              </Select>
              {uploadForm.category === "others" && <Input value={uploadForm.customCategory} onChange={(e) => setUploadForm(f => ({ ...f, customCategory: e.target.value }))} placeholder="Custom folder name" className="mt-2" />}
            </div>
            <div><Label>Tags (comma-separated)</Label><Input value={uploadForm.tags} onChange={(e) => setUploadForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. outdoor, 2026, hyderabad" /></div>
            <div><Label>Caption (shared)</Label><Textarea value={uploadForm.caption} onChange={(e) => setUploadForm(f => ({ ...f, caption: e.target.value }))} placeholder="Short caption" rows={2} /></div>
            {uploading && uploadProgress.total > 0 && (
              <div className="space-y-1">
                <Progress value={(uploadProgress.current / uploadProgress.total) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">Uploading {uploadProgress.current}/{uploadProgress.total}...</p>
              </div>
            )}
            <Button onClick={handleUpload} disabled={uploading} className="w-full">
              {uploading ? `Uploading ${uploadProgress.current}/${uploadProgress.total}...` : `Upload ${selectedFiles.length || ""} Image${selectedFiles.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editImage} onOpenChange={() => { setEditImage(null); setEditCustomCategory(""); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Image</DialogTitle></DialogHeader>
          {editImage && (
            <div className="space-y-4">
              <img src={editImage.src} alt={editImage.alt} className="w-full h-40 object-cover rounded-lg" />
              <div><Label>Alt Text / Title</Label><Input value={editImage.alt} onChange={(e) => setEditImage({ ...editImage, alt: e.target.value })} /></div>
              <div>
                <Label>Folder</Label>
                <Select value={allFolders.includes(editImage.category) ? editImage.category : "others"} onValueChange={(v) => { setEditImage({ ...editImage, category: v }); if (v !== "others") setEditCustomCategory(v); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{allFolders.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}</SelectContent>
                </Select>
                {editImage.category === "others" && <Input value={editCustomCategory} onChange={(e) => setEditCustomCategory(e.target.value)} placeholder="Custom folder" className="mt-2" />}
              </div>
              <div><Label>Tags (comma-separated)</Label><Input value={editImage.tags || ""} onChange={(e) => setEditImage({ ...editImage, tags: e.target.value })} placeholder="e.g. outdoor, 2026" /></div>
              <div><Label>Caption</Label><Textarea value={editImage.caption} onChange={(e) => setEditImage({ ...editImage, caption: e.target.value })} rows={2} /></div>
              <Button onClick={handleUpdate} className="w-full">Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryManager;
