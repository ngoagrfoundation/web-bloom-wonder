import { useEffect, useState } from "react";
import { getEvents, createEvent, updateEvent, deleteEvent } from "@/lib/admin-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Edit, CalendarDays } from "lucide-react";
import { toast } from "sonner";

const eventCategories = ["health-camp", "workshop", "cleanup", "fundraiser", "education", "community", "cultural"];

interface EventData {
  id?: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  attendees: number;
  is_featured: number;
}

const emptyEvent: EventData = {
  title: "", description: "", date: "", time: "", location: "", category: "community", image: "", attendees: 0, is_featured: 0,
};

const EventsManager = () => {
  const [events, setEvents] = useState<(EventData & { id: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<EventData>(emptyEvent);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getEvents();
      setEvents(result.data || []);
    } catch { toast.error("Failed to load events"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => { setForm(emptyEvent); setEditId(null); setShowForm(true); };
  const openEdit = (evt: EventData & { id: number }) => {
    setForm({ ...evt, date: evt.date?.slice(0, 10) || "" });
    setEditId(evt.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      if (editId) {
        await updateEvent({ ...form, id: editId } as unknown as Record<string, unknown>);
        toast.success("Event updated");
      } else {
        await createEvent(form as unknown as Record<string, unknown>);
        toast.success("Event created");
      }
      setShowForm(false);
      fetchData();
    } catch { toast.error("Save failed"); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
      toast.success("Event deleted");
      fetchData();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{events.length} events</span>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" /> Add Event
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No events yet. Create your first event!</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((evt) => (
                    <TableRow key={evt.id}>
                      <TableCell className="font-medium">{evt.title}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {evt.date ? new Date(evt.date).toLocaleDateString("en-IN") : "—"}
                      </TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">{evt.location || "—"}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">{evt.category}</span>
                      </TableCell>
                      <TableCell>{evt.is_featured ? "⭐" : "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(evt)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(evt.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              {editId ? "Edit Event" : "New Event"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Event title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input value={form.time} onChange={(e) => setForm(f => ({ ...f, time: e.target.value }))} placeholder="e.g. 9:00 AM - 5:00 PM" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Event location" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {eventCategories.map(c => <SelectItem key={c} value={c}>{c.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Expected Attendees</Label>
                <Input type="number" value={form.attendees} onChange={(e) => setForm(f => ({ ...f, attendees: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={!!form.is_featured} onCheckedChange={(v) => setForm(f => ({ ...f, is_featured: v ? 1 : 0 }))} />
              <Label>Featured Event</Label>
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Saving..." : editId ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsManager;
