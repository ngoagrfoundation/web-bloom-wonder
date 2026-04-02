import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { submitForm } from "@/lib/api";
import { CalendarDays, User, Mail, Phone, Users } from "lucide-react";

const eventCategories = [
  "health-camp", "workshop", "cleanup", "fundraiser", "education", "community", "cultural", "others"
];

interface EventRegistrationFormProps {
  eventTitle?: string;
  eventCategory?: string;
  onSuccess?: () => void;
}

const EventRegistrationForm = ({ eventTitle = "", eventCategory = "", onSuccess }: EventRegistrationFormProps) => {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    participants: 1,
    event_title: eventTitle,
    event_category: eventCategory || "community",
    special_requirements: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await submitForm("event_registration", form);
      toast.success("Registration successful! We'll contact you with event details.");
      onSuccess?.();
    } catch {
      toast.error("Registration failed. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Event Registration
        </h3>
        {eventTitle && (
          <p className="text-sm text-muted-foreground mt-1">Registering for: <strong>{eventTitle}</strong></p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-1"><User className="h-3 w-3" /> Full Name *</Label>
          <Input value={form.full_name} onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Your full name" required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Mail className="h-3 w-3" /> Email *</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" required />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Phone className="h-3 w-3" /> Phone *</Label>
            <Input type="tel" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" required />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Event Category</Label>
            <Select value={form.event_category} onValueChange={(v) => setForm(f => ({ ...f, event_category: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {eventCategories.map(c => (
                  <SelectItem key={c} value={c}>{c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1"><Users className="h-3 w-3" /> Number of Participants</Label>
            <Input type="number" min={1} max={50} value={form.participants} onChange={(e) => setForm(f => ({ ...f, participants: parseInt(e.target.value) || 1 }))} />
          </div>
        </div>
        {!eventTitle && (
          <div className="space-y-2">
            <Label>Event Name</Label>
            <Input value={form.event_title} onChange={(e) => setForm(f => ({ ...f, event_title: e.target.value }))} placeholder="Which event are you registering for?" />
          </div>
        )}
        <div className="space-y-2">
          <Label>Special Requirements</Label>
          <Textarea value={form.special_requirements} onChange={(e) => setForm(f => ({ ...f, special_requirements: e.target.value }))} placeholder="Any dietary needs, accessibility requirements, or other notes..." rows={3} />
        </div>
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Registering..." : "Register Now"}
        </Button>
      </form>
    </div>
  );
};

export default EventRegistrationForm;