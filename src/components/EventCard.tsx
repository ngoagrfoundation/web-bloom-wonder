import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: "community" | "fundraiser" | "workshop" | "health-camp" | "education";
  image: string;
  attendees?: number;
  isFeatured?: boolean;
}

interface EventCardProps {
  event: Event;
}

const categoryColors: Record<Event["category"], string> = {
  community: "bg-blue-100 text-blue-700",
  fundraiser: "bg-secondary/20 text-secondary-foreground",
  workshop: "bg-green-100 text-green-700",
  "health-camp": "bg-red-100 text-red-700",
  education: "bg-purple-100 text-purple-700",
};

const categoryLabels: Record<Event["category"], string> = {
  community: "Community Event",
  fundraiser: "Fundraiser",
  workshop: "Workshop",
  "health-camp": "Health Camp",
  education: "Education Program",
};

const EventCard = ({ event }: EventCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      year: date.getFullYear(),
    };
  };

  const { day, month } = formatDate(event.date);

  return (
    <motion.div
      className="card-elevated overflow-hidden group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-card rounded-lg p-2 text-center min-w-[60px] shadow-lg">
          <span className="block text-2xl font-bold text-primary">{day}</span>
          <span className="block text-xs uppercase text-muted-foreground font-medium">
            {month}
          </span>
        </div>
        {event.isFeatured && (
          <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
      </div>

      <div className="p-6">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
            categoryColors[event.category]
          }`}
        >
          {categoryLabels[event.category]}
        </span>

        <h3 className="text-xl font-display font-semibold text-foreground mb-2 line-clamp-2">
          {event.title}
        </h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          {event.attendees && (
            <div className="flex items-center gap-2">
              <Users size={16} className="text-primary" />
              <span>{event.attendees} attending</span>
            </div>
          )}
        </div>

        <button className="w-full mt-6 btn-primary text-sm">
          Register Now
        </button>
      </div>
    </motion.div>
  );
};

export default EventCard;
