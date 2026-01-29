import { useState } from "react";
import { Calendar, Grid, List, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/mobile";
import EventCard, { Event } from "@/components/EventCard";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const events: Event[] = [
  {
    id: "1",
    title: "Annual Health Camp 2026",
    description: "Free health check-ups including eye tests, dental care, and general consultation for the entire community.",
    date: "2026-02-15",
    time: "9:00 AM - 5:00 PM",
    location: "AGR Community Center, Sector 12, Mumbai",
    category: "health-camp",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800",
    attendees: 150,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Women Empowerment Workshop",
    description: "Learn essential skills for financial independence including tailoring, computer basics, and entrepreneurship.",
    date: "2026-02-20",
    time: "10:00 AM - 4:00 PM",
    location: "Skill Development Center, Andheri East",
    category: "workshop",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800",
    attendees: 45,
  },
  {
    id: "3",
    title: "Community Clean-Up Drive",
    description: "Join us in making our neighborhood cleaner and greener. Equipment and refreshments will be provided.",
    date: "2026-02-25",
    time: "7:00 AM - 12:00 PM",
    location: "Various locations across Mumbai",
    category: "community",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?w=800",
    attendees: 200,
  },
  {
    id: "4",
    title: "Charity Fundraiser Gala",
    description: "An evening of celebration, performances, and giving. All proceeds support our education initiatives.",
    date: "2026-03-05",
    time: "6:00 PM - 10:00 PM",
    location: "Grand Ballroom, Taj Hotel, Mumbai",
    category: "fundraiser",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
    attendees: 300,
    isFeatured: true,
  },
  {
    id: "5",
    title: "Back to School Campaign",
    description: "Distribution of school supplies and uniforms to underprivileged children for the new academic year.",
    date: "2026-03-10",
    time: "10:00 AM - 2:00 PM",
    location: "AGR Foundation Office, Bandra",
    category: "education",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
    attendees: 100,
  },
  {
    id: "6",
    title: "Senior Citizens Health Awareness",
    description: "Special program focused on health issues affecting seniors with free consultations and medicine distribution.",
    date: "2026-03-15",
    time: "9:00 AM - 1:00 PM",
    location: "Community Hall, Dadar",
    category: "health-camp",
    image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800",
    attendees: 80,
  },
];

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

  const filteredEvents = selectedCategory === "all"
    ? events
    : events.filter((event) => event.category === selectedCategory);

  const featuredEvents = filteredEvents.filter((event) => event.isFeatured);
  const upcomingEvents = filteredEvents.filter((event) => !event.isFeatured);

  return (
    <MobileLayout>
      <main className="pt-14 md:pt-20">
        {/* Hero Section */}
        <section className="py-16 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200')" }}
          />
          <div className="absolute inset-0 bg-primary/85" />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection className="text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Upcoming Events
              </h1>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
                Join us in making a difference. Explore our upcoming programs, workshops, and community gatherings.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Filters & View Toggle */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                <Filter size={18} className="text-muted-foreground flex-shrink-0" />
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                  aria-label="List view"
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <AnimatedSection>
                <h2 className="text-2xl font-display font-bold text-foreground mb-8 flex items-center gap-2">
                  <Calendar className="text-secondary" />
                  Featured Events
                </h2>
              </AnimatedSection>
              <StaggerContainer
                className={`grid gap-6 ${
                  viewMode === "grid" ? "md:grid-cols-2" : "grid-cols-1"
                }`}
              >
                {featuredEvents.map((event) => (
                  <StaggerItem key={event.id}>
                    <EventCard event={event} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>
        )}

        {/* All Events */}
        <section className="py-12 section-cream">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-2xl font-display font-bold text-foreground mb-8">
                All Upcoming Events
              </h2>
            </AnimatedSection>

            {upcomingEvents.length > 0 ? (
              <StaggerContainer
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 max-w-3xl"
                }`}
              >
                {upcomingEvents.map((event) => (
                  <StaggerItem key={event.id}>
                    <EventCard event={event} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground text-lg">
                  No events found in this category. Check back soon!
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-secondary/10">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center">
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">
                Want to Host an Event?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Partner with us to organize community events, workshops, or fundraisers. Together, we can create lasting impact.
              </p>
              <a href="/#contact" className="btn-primary">
                Contact Us
              </a>
            </AnimatedSection>
          </div>
        </section>
      </main>
    </MobileLayout>
  );
};

export default Events;