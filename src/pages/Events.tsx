import { useState, useEffect } from "react";
import { Calendar, Grid, List, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/mobile";
import EventCard, { Event } from "@/components/EventCard";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import EventRegistrationForm from "@/components/forms/EventRegistrationForm";
import { fetchPublicEvents } from "@/lib/api";

const categories = [
  { id: "all", label: "All Events" },
  { id: "health-camp", label: "Health Camps" },
  { id: "workshop", label: "Workshops" },
  { id: "community", label: "Community" },
  { id: "fundraiser", label: "Fundraisers" },
  { id: "education", label: "Education" },
];

const Events = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showRegModal, setShowRegModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicEvents()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped: Event[] = data.map((e: Record<string, unknown>) => ({
            id: String(e.id || ''),
            title: String(e.title || ''),
            description: String(e.description || ''),
            date: String(e.date || ''),
            time: String(e.time || ''),
            location: String(e.location || ''),
            category: String(e.category || 'community'),
            image: String(e.image || ''),
            attendees: Number(e.attendees || 0),
            isFeatured: Boolean(Number(e.is_featured)),
          }));
          setEvents(mapped);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRegister = (event: Event) => {
    setSelectedEvent(event);
    setShowRegModal(true);
  };

  const filteredEvents = selectedCategory === "all"
    ? events
    : events.filter((event) => event.category === selectedCategory);
  const featuredEvents = filteredEvents.filter((event) => event.isFeatured);
  const upcomingEvents = filteredEvents.filter((event) => !event.isFeatured);

  return (
    <MobileLayout>
      <main className="pt-14 md:pt-20">
        <section className="py-16 relative overflow-hidden bg-primary">
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection className="text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Upcoming Events</h1>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">Join us in making a difference. Explore our upcoming programs, workshops, and community gatherings.</p>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Filter size={18} className="text-muted-foreground flex-shrink-0" />
                {categories.map((category) => (
                  <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    {category.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`} aria-label="Grid view"><Grid size={20} /></button>
                <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`} aria-label="List view"><List size={20} /></button>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />)}
              </div>
            </div>
          </section>
        ) : events.length === 0 ? (
          <section className="py-20">
            <div className="container mx-auto px-4 text-center">
              <p className="text-muted-foreground text-lg">No events scheduled yet. Check back soon!</p>
            </div>
          </section>
        ) : (
          <>
            {featuredEvents.length > 0 && (
              <section className="py-12">
                <div className="container mx-auto px-4">
                  <AnimatedSection><h2 className="text-2xl font-display font-bold text-foreground mb-8 flex items-center gap-2"><Calendar className="text-secondary" />Featured Events</h2></AnimatedSection>
                  <StaggerContainer className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2" : "grid-cols-1"}`}>
                    {featuredEvents.map((event) => (<StaggerItem key={event.id}><EventCard event={event} onRegister={() => handleRegister(event)} /></StaggerItem>))}
                  </StaggerContainer>
                </div>
              </section>
            )}

            <section className="py-12 section-cream">
              <div className="container mx-auto px-4">
                <AnimatedSection><h2 className="text-2xl font-display font-bold text-foreground mb-8">All Upcoming Events</h2></AnimatedSection>
                {upcomingEvents.length > 0 ? (
                  <StaggerContainer className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-3xl"}`}>
                    {upcomingEvents.map((event) => (<StaggerItem key={event.id}><EventCard event={event} onRegister={() => handleRegister(event)} /></StaggerItem>))}
                  </StaggerContainer>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No events found in this filter. Check back soon!</p>
                  </motion.div>
                )}
              </div>
            </section>
          </>
        )}

        <section className="py-16 bg-secondary/10">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center">
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">Want to Host an Event?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Partner with us to organize community events, workshops, or fundraisers. Together, we can create lasting impact.</p>
              <a href="/#contact" className="btn-primary">Contact Us</a>
            </AnimatedSection>
          </div>
        </section>

        <Dialog open={showRegModal} onOpenChange={setShowRegModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] p-0">
            <DialogHeader className="sr-only"><DialogTitle>Event Registration</DialogTitle></DialogHeader>
            <ScrollArea className="max-h-[85vh]">
              <EventRegistrationForm eventTitle={selectedEvent?.title} eventCategory={selectedEvent?.category} onSuccess={() => setShowRegModal(false)} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </main>
    </MobileLayout>
  );
};

export default Events;
