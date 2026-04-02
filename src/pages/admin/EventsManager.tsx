import { useEffect, useState } from "react";
import { getEvents, createEvent, updateEvent, deleteEvent, uploadImage } from "@/lib/admin-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Edit, CalendarDays, Upload, X, Inbox } from "lucide-react";
import { toast } from "sonner";

const eventCategories = ["health-camp", "workshop", "cleanup", "fundraiser", "education", "community", "cultural", "others"];

interface EventData {
  id?: number; title: string; description: string; date: string; time: string;
  location: string; category: string; image: string; attendees: number; is_featured: number;
}

const emptyEvent: EventData = { title: "", description: "", date: "", time: "", location: "", category: "community", image: "", attendees: 0, is_featured: 0 };

const EventsManager = () => {
  const [events, setEvents] = useState<(EventData & { id: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EventData>(emptyEvent);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  const fetchData = async () => { setLoading(true); try { const result = await getEvents(); setEvents(result.data || []); } catch { toast.error("Failed to load events"); } setLoading(false); };
  useEffect(() => { fetchData(); }, []);

  const filteredEvents = events.filter(e => {
    if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
    if (featuredFilter === "featured" && !e.is_featured) return false;
    if (featuredFilter === "regular" && e.is_featured) return false;
    if (searchQuery && !e.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const openNew = () => { setForm(emptyEvent); setEditId(null); setImageFile(null); setShowForm(true); };
  const openEdit = (evt: EventData & { id: number }) => { setForm({ ...evt, date: evt.date?.slice(0, 10) || "" }); setEditId(evt.id); setImageFile(null); setShowForm(true); };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      let imagePath = form.image;
      if (imageFile) { setUploading(true); const result = await uploadImage(imageFile, 'events'); if (result.path) imagePath = result.path; setUploading(false); }
      const data = { ...form, image: imagePath };
      if (editId) { await updateEvent({ ...data, id: editId } as unknown as Record<string, unknown>); toast.success("Event updated"); }
      else { await createEvent(data as unknown as Record<string, unknown>); toast.success("Event created"); }
      setShowForm(false); setImageFile(null); fetchData();
    } catch { toast.error("Save failed"); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    try { await deleteEvent(id); toast.success("Event deleted"); fetchData(); } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{events.length} events</p>
        <Button onClick={openNew} className="rounded-lg"><Plus className="h-4 w-4 mr-2" /> Add Event</Button>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardContent className="py-3 flex flex-wrap gap-2 items-center">
          <Input placeholder="Search title..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-48 h-9" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {eventCategories.map(c => <SelectItem key={c} value={c}>{c.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
            <SelectTrigger className="w-[130px] h-9"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
              <Inbox className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm">No events found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="h-9">Image</TableHead>
                    <TableHead className="h-9">Title</TableHead>
                    <TableHead className="h-9">Date</TableHead>
                    <TableHead className="h-9">Location</TableHead>
                    <TableHead className="h-9">Category</TableHead>
                    <TableHead className="h-9">Featured</TableHead>
                    <TableHead className="w-[100px] h-9"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.map((evt) => (
                    <TableRow key={evt.id} className="hover:bg-muted/30">
                      <TableCell>{evt.image ? <img src={evt.image} alt={evt.title} className="w-16 h-10 object-cover rounded-lg" /> : <span className="text-xs text-muted-foreground">No image</span>}</TableCell>
                      <TableCell className="font-medium">{evt.title}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{evt.date ? new Date(evt.date).toLocaleDateString("en-IN") : "—"}</TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">{evt.location || "—"}</TableCell>
                      <TableCell><span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">{evt.category}</span></TableCell>
                      <TableCell>{evt.is_featured ? "⭐" : "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-0.5">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(evt)}><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(evt.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5" />{editId ? "Edit Event" : "New Event"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title *</Label><Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Event title" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} /></div>
              <div><Label>Time</Label><Input value={form.time} onChange={(e) => setForm(f => ({ ...f, time: e.target.value }))} placeholder="9:00 AM - 5:00 PM" /></div>
            </div>
            <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Event location" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v }))}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{eventCategories.map(c => <SelectItem key={c} value={c}>{c.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Expected Attendees</Label><Input type="number" value={form.attendees} onChange={(e) => setForm(f => ({ ...f, attendees: parseInt(e.target.value) || 0 }))} /></div>
            </div>
            <div>
              <Label>Event Image</Label>
              {form.image && !imageFile && (
                <div className="relative"><img src={form.image} alt="Event" className="w-full h-32 object-cover rounded-lg" />
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
            <div className="flex items-center gap-2"><Switch checked={!!form.is_featured} onCheckedChange={(v) => setForm(f => ({ ...f, is_featured: v ? 1 : 0 }))} /><Label>Featured Event</Label></div>
            <Button onClick={handleSave} disabled={saving || uploading} className="w-full">{saving ? "Saving..." : uploading ? "Uploading..." : editId ? "Update Event" : "Create Event"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsManager;
