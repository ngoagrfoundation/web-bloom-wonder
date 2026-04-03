import { useState, useEffect } from "react";
import { Play, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchPublicReels, fetchPublicSettings } from "@/lib/api";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Reel {
  id: number | string;
  title: string;
  video_url: string;
  thumbnail: string;
  description?: string;
}

const ReelsSection = () => {
  const [reels, setReels] = useState<Reel[]>([]);
  const [activeReel, setActiveReel] = useState<Reel | null>(null);
  const [loading, setLoading] = useState(true);
  const [maxCount, setMaxCount] = useState(10);

  useEffect(() => {
    Promise.all([
      fetchPublicReels(),
      fetchPublicSettings(),
    ]).then(([data, settings]) => {
      const manualReels: Reel[] = (data || []).map((r: Reel) => ({ ...r }));
      setReels(manualReels);
      if (settings?.reels_homepage_count) setMaxCount(parseInt(settings.reels_homepage_count) || 10);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (reels.length === 0) return null;

  const displayReels = reels.slice(0, maxCount);

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

  const isDirectVideo = (url: string) => /\.(mp4|webm)$/i.test(url);

  return (
    <section className="py-16 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-background/50 font-medium text-sm uppercase tracking-wider">Watch Our Work</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 mt-2">
            Impact in Action
          </h2>
          <p className="text-background/70 max-w-xl mx-auto text-sm">
            See our programs and community initiatives making real differences.
          </p>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {displayReels.map((reel) => (
            <div
              key={reel.id}
              className="flex-shrink-0 w-[280px] md:w-[320px] snap-start group cursor-pointer"
              onClick={() => setActiveReel(reel)}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-background/10 mb-2">
                <img
                  src={reel.thumbnail || "/placeholder.svg"}
                  alt={reel.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-semibold text-sm text-white truncate">{reel.title}</h3>
                  {reel.description && (
                    <p className="text-white/70 text-xs mt-0.5 line-clamp-1">{reel.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link to="/gallery?tab=reels" className="inline-flex items-center gap-2 text-background/70 hover:text-background font-medium transition-colors group text-sm">
            View All Reels
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <Dialog open={!!activeReel} onOpenChange={() => setActiveReel(null)}>
        <DialogContent className="sm:max-w-[720px] p-0 bg-black border-none">
          {activeReel && (
            <div className="aspect-video w-full">
              {isDirectVideo(activeReel.video_url) ? (
                <video src={activeReel.video_url} className="w-full h-full rounded-lg" controls autoPlay />
              ) : (
                <iframe
                  src={getEmbedUrl(activeReel.video_url)}
                  className="w-full h-full rounded-lg"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={activeReel.title}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReelsSection;
