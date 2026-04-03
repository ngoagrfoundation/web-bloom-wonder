import { useEffect, useState } from "react";
import { getNews, createNews, updateNews, deleteNews, uploadImage } from "@/lib/admin-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2, ExternalLink, Upload, X, Inbox } from "lucide-react";
import { toast } from "sonner";

interface NewsArticle {
  id?: number; slug: string; title: string; excerpt: string; content: string; image: string;
  author: string; category: string; read_time: number; is_published: number; published_at?: string;
  meta_title?: string; meta_description?: string;
}

const emptyArticle: NewsArticle = { slug: "", title: "", excerpt: "", content: "", image: "", author: "AGR Foundation", category: "announcement", read_time: 3, is_published: 1, meta_title: "", meta_description: "" };
const categories = ["success-story", "announcement", "event", "community"];

const NewsManager = () => {
  const [articles, setArticles] = useState<(NewsArticle & { id: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewsArticle>(emptyArticle);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => { setLoading(true); const result = await getNews(); if (result.data) setArticles(result.data); setLoading(false); };
  useEffect(() => { fetchData(); }, []);

  const filteredArticles = articles.filter(a => {
    if (categoryFilter !== "all" && a.category !== categoryFilter) return false;
    if (statusFilter === "published" && !a.is_published) return false;
    if (statusFilter === "draft" && a.is_published) return false;
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const openNew = () => { setForm(emptyArticle); setEditId(null); setImageFile(null); setShowForm(true); };
  const openEdit = (article: NewsArticle & { id: number }) => { setForm(article); setEditId(article.id); setImageFile(null); setShowForm(true); };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    const slug = form.slug || generateSlug(form.title);
    setSaving(true);
    try {
      let imagePath = form.image;
      if (imageFile) { setUploading(true); const result = await uploadImage(imageFile, 'news'); if (result.path) imagePath = result.path; setUploading(false); }
      const data = { ...form, slug, image: imagePath };
      if (editId) { await updateNews({ ...data, id: editId }); toast.success("Article updated"); }
      else { await createNews(data); toast.success("Article created"); }
      setShowForm(false); setImageFile(null); fetchData();
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this article?")) return;
    try { await deleteNews(id); toast.success("Deleted"); fetchData(); } catch { toast.error("Failed"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{articles.length} articles</p>
        <Button onClick={openNew} className="rounded-lg"><Plus className="h-4 w-4 mr-2" /> New Article</Button>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardContent className="py-3 flex flex-wrap gap-2 items-center">
          <Input placeholder="Search title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-48 h-9" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Filters</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton className="h-10 w-16 rounded-lg" />
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="h-9">Image</TableHead>
                  <TableHead className="h-9">Title</TableHead>
                  <TableHead className="h-9">Filter</TableHead>
                  <TableHead className="h-9">Status</TableHead>
                  <TableHead className="h-9">Date</TableHead>
                  <TableHead className="w-[120px] h-9">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id} className="hover:bg-muted/30">
                    <TableCell>{article.image ? <img src={article.image} alt={article.title} className="w-16 h-10 object-cover rounded-lg" /> : <span className="text-xs text-muted-foreground">No image</span>}</TableCell>
                    <TableCell className="font-medium max-w-[250px] truncate">{article.title}</TableCell>
                    <TableCell><Badge variant="secondary">{article.category}</Badge></TableCell>
                    <TableCell><Badge variant={article.is_published ? "default" : "outline"}>{article.is_published ? "Published" : "Draft"}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{article.published_at ? new Date(article.published_at).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-0.5">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(`/news/${article.slug}`, '_blank')}><ExternalLink className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(article)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(article.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredArticles.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="py-16">
                    <div className="flex flex-col items-center text-muted-foreground gap-2"><Inbox className="h-8 w-8 text-muted-foreground/40" /><p className="text-sm">No articles found</p></div>
                  </TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editId ? "Edit Article" : "New Article"}</DialogTitle><DialogDescription className="sr-only">Manage article details</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value, slug: generateSlug(e.target.value) }))} /></div>
            <div><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated" /></div>
            <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} /></div>
            <div><Label>Content (HTML)</Label><Textarea value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} rows={10} className="font-mono text-sm" /></div>
            <div>
              <Label>Article Image</Label>
              {form.image && !imageFile && (
                <div className="relative"><img src={form.image} alt="" className="w-full h-32 object-cover rounded-lg" />
                  <Button size="icon" variant="destructive" className="absolute top-1 right-1 h-6 w-6" onClick={() => setForm(f => ({ ...f, image: "" }))}><X className="h-3 w-3" /></Button>
                </div>
              )}
              <div className="border-2 border-dashed rounded-lg p-3 text-center mt-1">
                {imageFile ? (
                  <div className="flex items-center justify-between"><span className="text-sm truncate">{imageFile.name}</span><Button variant="ghost" size="icon" onClick={() => setImageFile(null)}><X className="h-4 w-4" /></Button></div>
                ) : (
                  <label className="cursor-pointer"><Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" /><p className="text-xs text-muted-foreground">Click to upload (max 5MB)</p><input type="file" accept="image/*" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} /></label>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Author</Label><Input value={form.author} onChange={(e) => setForm(f => ({ ...f, author: e.target.value }))} /></div>
              <div><Label>Filter</Label>
                <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v }))}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Read Time (min)</Label><Input type="number" value={form.read_time} onChange={(e) => setForm(f => ({ ...f, read_time: Number(e.target.value) }))} /></div>
              <div className="flex items-end gap-2 pb-1"><Switch checked={!!form.is_published} onCheckedChange={(v) => setForm(f => ({ ...f, is_published: v ? 1 : 0 }))} /><Label>Published</Label></div>
            </div>
            {/* SEO Fields */}
            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">SEO Settings</p>
              <div><Label>Meta Title</Label><Input value={form.meta_title || ""} onChange={(e) => setForm(f => ({ ...f, meta_title: e.target.value }))} placeholder="Custom title for search engines" /><p className="text-xs text-muted-foreground mt-1">{(form.meta_title || "").length}/60 characters</p></div>
              <div><Label>Meta Description</Label><Textarea value={form.meta_description || ""} onChange={(e) => setForm(f => ({ ...f, meta_description: e.target.value }))} placeholder="Brief description for search results" rows={2} /><p className="text-xs text-muted-foreground mt-1">{(form.meta_description || "").length}/160 characters</p></div>
            </div>
            <Button onClick={handleSave} disabled={saving || uploading} className="w-full">{saving ? "Saving..." : uploading ? "Uploading..." : editId ? "Update" : "Create"} Article</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsManager;
