import { useEffect, useState } from "react";
import { getNews, createNews, updateNews, deleteNews } from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface NewsArticle {
  id?: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  read_time: number;
  is_published: number;
  published_at?: string;
}

const emptyArticle: NewsArticle = {
  slug: "", title: "", excerpt: "", content: "", image: "",
  author: "AGR Foundation", category: "announcement", read_time: 3, is_published: 1,
};

const categories = ["success-story", "announcement", "event", "community"];

const NewsManager = () => {
  const [articles, setArticles] = useState<(NewsArticle & { id: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewsArticle>(emptyArticle);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const result = await getNews();
    if (result.data) setArticles(result.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const openNew = () => { setForm(emptyArticle); setEditId(null); setShowForm(true); };
  const openEdit = (article: NewsArticle & { id: number }) => {
    setForm(article);
    setEditId(article.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    const slug = form.slug || generateSlug(form.title);
    setSaving(true);
    try {
      if (editId) {
        await updateNews({ ...form, id: editId, slug });
        toast.success("Article updated");
      } else {
        await createNews({ ...form, slug });
        toast.success("Article created");
      }
      setShowForm(false);
      fetchData();
    } catch { toast.error("Failed to save article"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this article?")) return;
    try {
      await deleteNews(id);
      toast.success("Article deleted");
      fetchData();
    } catch { toast.error("Failed to delete"); }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{articles.length} articles</p>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> New Article</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium max-w-[300px] truncate">{article.title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{article.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={article.is_published ? "default" : "outline"}>
                      {article.is_published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {article.published_at ? new Date(article.published_at as unknown as string).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => window.open(`/news/${article.slug}`, '_blank')}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(article)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(article.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {articles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No articles yet. Create your first one!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Article" : "New Article"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value, slug: generateSlug(e.target.value) }))} />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated-from-title" />
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={form.excerpt} onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Content (HTML)</Label>
              <Textarea value={form.content} onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} rows={10} className="font-mono text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={form.image} onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input value={form.author} onChange={(e) => setForm(f => ({ ...f, author: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c.replace('-', ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Read Time (min)</Label>
                <Input type="number" value={form.read_time} onChange={(e) => setForm(f => ({ ...f, read_time: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label>Published</Label>
                <div className="pt-2">
                  <Switch checked={!!form.is_published} onCheckedChange={(v) => setForm(f => ({ ...f, is_published: v ? 1 : 0 }))} />
                </div>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Saving..." : editId ? "Update Article" : "Create Article"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewsManager;
