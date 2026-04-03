import { useState, useEffect } from "react";
import { Play, Youtube } from "lucide-react";
import { fetchYouTubeVideos, YouTubeVideo } from "@/lib/api";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const YouTubeSection = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchYouTubeVideos()
      .then((data) => setVideos(data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading || videos.length === 0) return null;

  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch")) {
      const id = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return url;
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-red-600 mb-2">
            <Youtube className="w-5 h-5" />
            <span className="font-medium text-sm uppercase tracking-wider">Our YouTube Channel</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Latest Videos
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Watch our latest content directly from our YouTube channel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos.slice(0, 8).map((video) => (
            <button
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="group text-left rounded-xl overflow-hidden bg-card border border-border hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-2 text-foreground">{video.title}</h3>
                {video.description && (
                  <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{video.description}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={!!activeVideo} onOpenChange={() => setActiveVideo(null)}>
        <DialogContent className="sm:max-w-[720px] p-0 bg-black border-none">
          {activeVideo && (
            <div className="aspect-video w-full">
              <iframe
                src={getEmbedUrl(activeVideo.video_url)}
                className="w-full h-full rounded-lg"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={activeVideo.title}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default YouTubeSection;
