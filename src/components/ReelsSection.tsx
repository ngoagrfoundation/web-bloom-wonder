import { useState, useEffect } from "react";
import { Play, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchPublicReels, fetchPublicSettings, fetchYouTubeVideos, YouTubeVideo } from "@/lib/api";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Reel {
  id: number | string;
  title: string;
  video_url: string;
  thumbnail: string;
  description?: string;
  source?: "manual" | "youtube";
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
      fetchYouTubeVideos(),
    ]).then(([data, settings, ytVideos]) => {
      const manualReels: Reel[] = (data || []).map((r: Reel) => ({ ...r, source: "manual" as const }));
      const youtubeReels: Reel[] = (ytVideos || []).map((v: YouTubeVideo) => ({
        id: v.id,
        title: v.title,
        video_url: v.video_url,
        thumbnail: v.thumbnail,
        description: v.description,
        source: "youtube" as const,
      }));

      // Deduplicate: if a manual reel has the same YouTube URL, skip the YT version
      const manualUrls = new Set(manualReels.map(r => r.video_url));
      const uniqueYt = youtubeReels.filter(r => !manualUrls.has(r.video_url));
      setReels([...manualReels, ...uniqueYt]);

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
    <section className="py-24 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-background/50 font-medium text-sm uppercase tracking-wider">Watch Our Work</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 mt-2">
            Impact in Action
          </h2>
          <p className="text-background/70 max-w-xl mx-auto">
            See our programs and community initiatives making real differences.
          </p>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {displayReels.map((reel) => (
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
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                    <Play className="w-6 h-6 text-primary-foreground fill-current ml-1" />
                  </div>
                </div>
                {reel.source === "youtube" && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">YT</span>
                )}
              </div>
              <h3 className="font-semibold text-sm truncate">{reel.title}</h3>
              {reel.description && (
                <p className="text-background/60 text-xs mt-1 line-clamp-2">{reel.description}</p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/gallery" className="inline-flex items-center gap-2 text-background/70 hover:text-background font-medium transition-colors group">
            Show More
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <Dialog open={!!activeReel} onOpenChange={() => setActiveReel(null)}>
        <DialogContent className="sm:max-w-[400px] p-0 bg-black border-none">
          {activeReel && (
            <div className="aspect-[9/16] w-full">
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
