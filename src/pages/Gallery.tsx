import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/mobile";
import GalleryLightbox, { GalleryImage } from "@/components/GalleryLightbox";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { fetchPublicGallery } from "@/lib/api";
import { ImageIcon } from "lucide-react";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([{ id: "all", label: "All" }]);

  useEffect(() => {
    fetchPublicGallery()
      .then((data) => {
        if (data && data.length > 0) {
          const mapped: GalleryImage[] = data.map((img: Record<string, unknown>, i: number) => ({
            id: String(img.id || i),
            src: String(img.src || ''),
            alt: String(img.alt || ''),
            category: String(img.category || 'general'),
            caption: String(img.caption || ''),
          }));
          setGalleryImages(mapped);
          // Build dynamic categories
          const cats = new Set(mapped.map(img => img.category));
          setCategories([
            { id: "all", label: "All" },
            ...Array.from(cats).map(c => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1) })),
          ]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredImages = selectedCategory === "all"
    ? galleryImages
    : galleryImages.filter((img) => img.category === selectedCategory);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <MobileLayout>
      <main className="pt-14 md:pt-20">
        <section className="relative py-20 bg-primary">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Photo Gallery</h1>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">Explore moments captured from our programs, events, and the communities we serve.</p>
            </AnimatedSection>
          </div>
        </section>

        {categories.length > 1 && (
          <section className="py-8 border-b border-border sticky top-14 md:top-16 bg-background/95 backdrop-blur-sm z-20">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-center">
                {categories.map((category) => (
                  <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                {[...Array(8)].map((_, i) => <div key={i} className="break-inside-avoid aspect-video rounded-xl bg-muted animate-pulse" />)}
              </div>
            ) : galleryImages.length === 0 ? (
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
    </MobileLayout>
  );
};

export default Gallery;
