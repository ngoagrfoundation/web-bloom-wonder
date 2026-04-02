import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Quote, Inbox } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface Testimonial { id: number; quote: string; name: string; role: string; photo: string; is_published: number; sort_order: number; }

const adminFetch = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, { ...options, credentials: "include", headers: { "Content-Type": "application/json", ...options.headers } });
  if (res.status === 401) { window.location.href = "/admin"; throw new Error("Unauthorized"); }
  return res.json();
};

const TestimonialsManager = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ quote: "", name: "", role: "", photo: "", is_published: 1, sort_order: 0 });
  const [publishFilter, setPublishFilter] = useState("all");

  const load = async () => { setLoading(true); try { const res = await adminFetch(`${API_BASE_URL}/admin/testimonials.php`); setItems(res.data || []); } catch { toast.error("Failed to load"); } setLoading(false); };
  useEffect(() => { load(); }, []);

  const filteredItems = items.filter(t => {
    if (publishFilter === "published" && !t.is_published) return false;
    if (publishFilter === "draft" && t.is_published) return false;
    return true;
  });

  const openNew = () => { setEditing(null); setForm({ quote: "", name: "", role: "", photo: "", is_published: 1, sort_order: items.length }); setDialogOpen(true); };
  const openEdit = (t: Testimonial) => { setEditing(t); setForm({ quote: t.quote, name: t.name, role: t.role, photo: t.photo, is_published: t.is_published, sort_order: t.sort_order }); setDialogOpen(true); };

  const save = async () => {
    if (!form.quote || !form.name || !form.role) { toast.error("Quote, name, and role are required"); return; }
    try {
      if (editing) { await adminFetch(`${API_BASE_URL}/admin/testimonials.php`, { method: "PUT", body: JSON.stringify({ id: editing.id, ...form }) }); toast.success("Updated"); }
      else { await adminFetch(`${API_BASE_URL}/admin/testimonials.php`, { method: "POST", body: JSON.stringify(form) }); toast.success("Added"); }
      setDialogOpen(false); load();
    } catch { toast.error("Failed to save"); }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete?")) return;
    try { await adminFetch(`${API_BASE_URL}/admin/testimonials.php?id=${id}`, { method: "DELETE" }); toast.success("Deleted"); load(); }
    catch { toast.error("Failed"); }
  };

  const togglePublish = async (t: Testimonial) => {
    await adminFetch(`${API_BASE_URL}/admin/testimonials.php`, { method: "PUT", body: JSON.stringify({ id: t.id, is_published: t.is_published ? 0 : 1 }) });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{items.length} testimonials</p>
        <Button onClick={openNew} className="rounded-lg"><Plus className="w-4 h-4 mr-2" />Add Testimonial</Button>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardContent className="py-3">
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
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 h-9">#</TableHead>
                <TableHead className="h-9">Quote</TableHead>
                <TableHead className="h-9">Name</TableHead>
                <TableHead className="h-9">Role</TableHead>
                <TableHead className="h-9">Published</TableHead>
                <TableHead className="text-right h-9">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-sm">Loading...</TableCell></TableRow>
              ) : filteredItems.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="py-16">
                  <div className="flex flex-col items-center text-muted-foreground gap-2"><Inbox className="h-8 w-8 text-muted-foreground/40" /><p className="text-sm">No testimonials found</p></div>
                </TableCell></TableRow>
              ) : filteredItems.map((t, i) => (
                <TableRow key={t.id} className="hover:bg-muted/30">
                  <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="flex items-start gap-2"><Quote className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" /><span className="line-clamp-2 text-sm">{t.quote}</span></div>
                  </TableCell>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.role}</TableCell>
                  <TableCell><Switch checked={!!t.is_published} onCheckedChange={() => togglePublish(t)} /></TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(t)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => remove(t.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Quote *</Label><Textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={4} /></div>
            <div><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Role / Title *</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Education Program Beneficiary" /></div>
            <div><Label>Photo URL (optional)</Label><Input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} /></div>
              <div className="flex items-end gap-2 pb-1"><Switch checked={!!form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v ? 1 : 0 })} /><Label>Published</Label></div>
            </div>
            <Button onClick={save} className="w-full">{editing ? "Update" : "Add"} Testimonial</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestimonialsManager;
