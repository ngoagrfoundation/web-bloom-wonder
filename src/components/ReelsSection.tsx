import { useState, useEffect } from "react";
import { Play, X } from "lucide-react";
import { fetchPublicReels } from "@/lib/api";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Reel {
  id: number;
  title: string;
  video_url: string;
  thumbnail: string;
  description?: string;
}

const staticReels: Reel[] = [
  {
    id: 1,
    title: "Lake Cleaning Drive",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "/placeholder.svg",
    description: "Our volunteers cleaning local lakes",
  },
  {
    id: 2,
    title: "Education Program",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "/placeholder.svg",
    description: "Empowering children through education",
  },
  {
    id: 3,
    title: "Healthcare Camp",
    video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "/placeholder.svg",
    description: "Free medical camps in rural areas",
  },
];

const ReelsSection = () => {
  const [reels, setReels] = useState<Reel[]>(staticReels);
  const [activeReel, setActiveReel] = useState<Reel | null>(null);

  useEffect(() => {
    fetchPublicReels().then((data) => {
      if (data && data.length > 0) setReels(data);
    });
  }, []);

  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch")) {
      const id = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes("youtube.com/embed/")) {
      return url.includes("?") ? url + "&autoplay=1" : url + "?autoplay=1";
    }
    return url;
  };

  return (
    <section className="py-24 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Our Reels
          </h2>
          <p className="text-background/70 max-w-xl mx-auto">
            Watch our impact stories and community initiatives in action.
          </p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="flex-shrink-0 w-[220px] md:w-[260px] snap-start group cursor-pointer"
              onClick={() => setActiveReel(reel)}
            >
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-background/10 mb-3">
                <img
                  src={reel.thumbnail || "/placeholder.svg"}
                  alt={reel.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                    <Play className="w-6 h-6 text-primary-foreground fill-current ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-sm truncate">{reel.title}</h3>
              {reel.description && (
                <p className="text-background/60 text-xs mt-1 line-clamp-2">{reel.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!activeReel} onOpenChange={() => setActiveReel(null)}>
        <DialogContent className="sm:max-w-[400px] p-0 bg-black border-none">
          <button
            onClick={() => setActiveReel(null)}
            className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
          >
            <X className="w-4 h-4" />
          </button>
          {activeReel && (
            <div className="aspect-[9/16] w-full">
              <iframe
                src={getEmbedUrl(activeReel.video_url)}
                className="w-full h-full rounded-lg"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={activeReel.title}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReelsSection;
