import { useEffect, useState } from "react";
import { getGalleryImages, uploadGalleryImage, updateGalleryImage, deleteGalleryImage } from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit, Upload, X } from "lucide-react";
import { toast } from "sonner";

const categories = ["sustainability", "education", "healthcare", "community", "livelihood", "events", "volunteers"];

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  caption: string;
  sort_order: number;
}

const GalleryManager = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [editImage, setEditImage] = useState<GalleryImage | null>(null);
  const [uploadForm, setUploadForm] = useState({ alt: "", category: "community", caption: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getGalleryImages();
      setImages(result.data || []);
    } catch { toast.error("Failed to load gallery"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpload = async () => {
    if (!selectedFile) { toast.error("Please select an image"); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("alt", uploadForm.alt);
      formData.append("category", uploadForm.category);
      formData.append("caption", uploadForm.caption);
      const result = await uploadGalleryImage(formData);
      if (result.error) { toast.error(result.error); } else {
        toast.success("Image uploaded!");
        setShowUpload(false);
        setSelectedFile(null);
        setUploadForm({ alt: "", category: "community", caption: "" });
        fetchData();
      }
    } catch { toast.error("Upload failed"); }
    setUploading(false);
  };

  const handleUpdate = async () => {
    if (!editImage) return;
    try {
      await updateGalleryImage({ id: editImage.id, alt: editImage.alt, category: editImage.category, caption: editImage.caption });
      toast.success("Image updated");
      setEditImage(null);
      fetchData();
    } catch { toast.error("Update failed"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this image?")) return;
    try {
      await deleteGalleryImage(id);
      toast.success("Image deleted");
      fetchData();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{images.length} images</span>
        <Button onClick={() => setShowUpload(true)}>
          <Plus className="h-4 w-4 mr-2" /> Upload Image
        </Button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading...</div>
      ) : images.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No gallery images yet. Upload your first image!</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <Card key={img.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => setEditImage(img)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(img.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{img.alt || "No title"}</p>
                <p className="text-xs text-muted-foreground">{img.category} • {img.caption?.slice(0, 50)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upload Image</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image File</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                {selectedFile ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{selectedFile.name}</span>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to select image (max 5MB)</p>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
                  </label>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Alt Text / Title</Label>
              <Input value={uploadForm.alt} onChange={(e) => setUploadForm(f => ({ ...f, alt: e.target.value }))} placeholder="Describe the image" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={uploadForm.category} onValueChange={(v) => setUploadForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Caption</Label>
              <Textarea value={uploadForm.caption} onChange={(e) => setUploadForm(f => ({ ...f, caption: e.target.value }))} placeholder="Short caption" rows={2} />
            </div>
            <Button onClick={handleUpload} disabled={uploading} className="w-full">
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editImage} onOpenChange={() => setEditImage(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Image</DialogTitle></DialogHeader>
          {editImage && (
            <div className="space-y-4">
              <img src={editImage.src} alt={editImage.alt} className="w-full h-40 object-cover rounded" />
              <div className="space-y-2">
                <Label>Alt Text / Title</Label>
                <Input value={editImage.alt} onChange={(e) => setEditImage({ ...editImage, alt: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={editImage.category} onValueChange={(v) => setEditImage({ ...editImage, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Caption</Label>
                <Textarea value={editImage.caption} onChange={(e) => setEditImage({ ...editImage, caption: e.target.value })} rows={2} />
              </div>
              <Button onClick={handleUpdate} className="w-full">Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryManager;
