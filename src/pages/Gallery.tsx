import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/mobile";
import GalleryLightbox, { GalleryImage } from "@/components/GalleryLightbox";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { fetchPublicGallery, fetchPublicReels, fetchYouTubeVideos, YouTubeVideo } from "@/lib/api";
import { ImageIcon, Play, Film } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  video_url: string;
  description?: string;
  source: "manual" | "youtube";
}

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([{ id: "all", label: "All" }]);
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");

  useEffect(() => {
    Promise.all([
      fetchPublicGallery(),
      fetchPublicReels(),
      fetchYouTubeVideos(),
    ]).then(([galleryData, reelsData, ytVideos]) => {
      // Gallery images
      if (galleryData && galleryData.length > 0) {
        const mapped: GalleryImage[] = galleryData.map((img: Record<string, unknown>, i: number) => ({
          id: String(img.id || i),
          src: String(img.src || ''),
          alt: String(img.alt || ''),
          category: String(img.category || 'general'),
          caption: String(img.caption || ''),
        }));
        setGalleryImages(mapped);
        const cats = new Set(mapped.map(img => img.category));
        setCategories([
          { id: "all", label: "All" },
          ...Array.from(cats).map(c => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1) })),
        ]);
      }

      // Videos: merge reels + YouTube
      const manualVideos: VideoItem[] = (reelsData || []).map((r: { id: number; title: string; video_url: string; thumbnail: string; description?: string }) => ({
        id: String(r.id),
        title: r.title,
        thumbnail: r.thumbnail,
        video_url: r.video_url,
        description: r.description,
        source: "manual" as const,
      }));
      const ytItems: VideoItem[] = (ytVideos || []).map((v: YouTubeVideo) => ({
        id: v.id,
        title: v.title,
        thumbnail: v.thumbnail,
        video_url: v.video_url,
        description: v.description,
        source: "youtube" as const,
      }));
      const manualUrls = new Set(manualVideos.map(v => v.video_url));
      setVideos([...manualVideos, ...ytItems.filter(v => !manualUrls.has(v.video_url))]);
    }).finally(() => setLoading(false));
  }, []);

  const filteredImages = selectedCategory === "all"
    ? galleryImages
    : galleryImages.filter((img) => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

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
    <MobileLayout>
      <main className="pt-14 md:pt-20">
        <section className="relative py-20 bg-primary">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Gallery</h1>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">Explore photos and videos from our programs, events, and communities.</p>
            </AnimatedSection>
          </div>
        </section>

        {/* Tabs: Photos / Videos */}
        <section className="border-b border-border sticky top-14 md:top-16 bg-background/95 backdrop-blur-sm z-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-1 py-3 justify-center">
              <button
                onClick={() => setActiveTab("photos")}
                className={`px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === "photos" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >
                <ImageIcon className="w-4 h-4" />
                Photos {galleryImages.length > 0 && `(${galleryImages.length})`}
              </button>
              <button
                onClick={() => setActiveTab("videos")}
                className={`px-5 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${activeTab === "videos" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >
                <Film className="w-4 h-4" />
                Videos {videos.length > 0 && `(${videos.length})`}
              </button>
            </div>

            {/* Category filter for photos */}
            {activeTab === "photos" && categories.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-3 justify-center">
                {categories.map((category) => (
                  <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedCategory === category.id ? "bg-foreground text-background" : "bg-muted/60 text-muted-foreground hover:bg-muted"}`}>
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {[...Array(8)].map((_, i) => <div key={i} className="break-inside-avoid aspect-video rounded-xl bg-muted animate-pulse" />)}
              </div>
            ) : activeTab === "photos" ? (
              galleryImages.length === 0 ? (
                <div className="text-center py-20">
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground text-lg">No photos available yet. Check back soon!</p>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-12"><p className="text-muted-foreground text-lg">No photos found in this filter.</p></div>
              ) : (
                <StaggerContainer className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                  {filteredImages.map((image, index) => (
                    <StaggerItem key={image.id} className="break-inside-avoid">
                      <motion.button onClick={() => openLightbox(index)} className="relative overflow-hidden rounded-xl group w-full" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                        <img src={image.src} alt={image.alt} className="w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-sm font-medium line-clamp-2">{image.caption}</p>
                        </div>
                      </motion.button>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )
            ) : (
              /* Videos Tab */
              videos.length === 0 ? (
                <div className="text-center py-20">
                  <Film className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground text-lg">No videos available yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videos.map((video) => (
                    <motion.button
                      key={video.id}
                      onClick={() => setActiveVideo(video)}
                      className="group text-left rounded-xl overflow-hidden bg-card border border-border hover:shadow-lg transition-shadow"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="relative aspect-video">
                        <img
                          src={video.thumbnail || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                            <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
                          </div>
                        </div>
                        {video.source === "youtube" && (
                          <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">YouTube</span>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
                        {video.description && (
                          <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{video.description}</p>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )
            )}
          </div>
        </section>

        <section className="py-16 section-cream">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center">
              <h2 className="text-3xl font-display font-bold text-foreground mb-4">Share Your Story</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Are you a beneficiary, volunteer, or donor? We'd love to feature your photos and story in our gallery.</p>
              <a href="/#contact" className="btn-primary">Contact Us</a>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <GalleryLightbox images={filteredImages} currentIndex={currentImageIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} onNavigate={setCurrentImageIndex} />

      {/* Video Player Dialog */}
      <Dialog open={!!activeVideo} onOpenChange={() => setActiveVideo(null)}>
        <DialogContent className="sm:max-w-[720px] p-0 bg-black border-none">
          {activeVideo && (
            <div className="aspect-video w-full">
              {isDirectVideo(activeVideo.video_url) ? (
                <video src={activeVideo.video_url} className="w-full h-full rounded-lg" controls autoPlay />
              ) : (
                <iframe
                  src={getEmbedUrl(activeVideo.video_url)}
                  className="w-full h-full rounded-lg"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={activeVideo.title}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default Gallery;
