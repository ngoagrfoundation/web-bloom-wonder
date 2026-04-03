import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchPublicEvents } from "@/lib/api";

interface TickerEvent {
  id: string;
  title: string;
  date: string;
  location: string;
}

const EventsTicker = () => {
  const [events, setEvents] = useState<TickerEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicEvents()
      .then((data) => {
        if (data && data.length > 0) {
          const upcoming = data
            .filter((e: Record<string, unknown>) => new Date(String(e.date)) >= new Date())
            .slice(0, 10)
            .map((e: Record<string, unknown>) => ({
              id: String(e.id),
              title: String(e.title),
              date: String(e.date),
              location: String(e.location || ""),
            }));
          setEvents(upcoming);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || events.length === 0) return null;

  const displayEvents = [...events, ...events];

  return (
    <div className="bg-amber-500 text-black py-3.5 overflow-hidden shadow-sm">
      <div className="flex items-center">
        <div className="flex-shrink-0 px-4 flex items-center gap-1.5 border-r border-black/20">
          <CalendarDays className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wide">Upcoming</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex animate-ticker whitespace-nowrap">
            {displayEvents.map((event, i) => (
              <Link
                key={`${event.id}-${i}`}
                to="/events"
                className="inline-flex items-center gap-2 px-6 text-sm hover:text-black/70 transition-colors"
              >
                <span className="font-semibold">{event.title}</span>
                <span className="text-black/60 text-xs">
                  {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
                <span className="text-black/30">•</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsTicker;
