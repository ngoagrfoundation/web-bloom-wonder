import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MobileLayout } from "@/components/mobile";
import GalleryLightbox, { GalleryImage } from "@/components/GalleryLightbox";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { fetchPublicGallery } from "@/lib/api";
import biodegradableBag from "@/assets/gallery/biodegradable-bag.jpg";
import treePlanting from "@/assets/generated/sustainability/tree-planting.jpg";
import ecoProducts from "@/assets/generated/sustainability/eco-products.jpg";
import classroomChildren from "@/assets/generated/education/classroom-children.jpg";
import healthCamp from "@/assets/generated/healthcare/health-camp.jpg";
import awarenessProgram from "@/assets/generated/community/awareness-program.jpg";
import helpingElderly from "@/assets/generated/volunteers/helping-elderly.jpg";
import tailoringTraining from "@/assets/generated/livelihood/tailoring-training.jpg";
import culturalEvent from "@/assets/generated/events/cultural-event.jpg";
import schoolSupplies from "@/assets/generated/education/school-supplies.jpg";
import elderlyCare from "@/assets/generated/healthcare/elderly-care.jpg";
import communityKitchen from "@/assets/generated/community/community-kitchen.jpg";
import volunteerTraining from "@/assets/generated/volunteers/volunteer-training.jpg";
import computerTraining from "@/assets/generated/education/computer-training.jpg";
import fundraiserGala from "@/assets/generated/events/fundraiser-gala.jpg";
import graduation from "@/assets/generated/education/graduation.jpg";
import mobileClinic from "@/assets/generated/healthcare/mobile-clinic.jpg";
import reliefDistribution from "@/assets/generated/community/relief-distribution.jpg";

const categories = [
  { id: "all", label: "All" },
  { id: "sustainability", label: "Sustainability" },
  { id: "education", label: "Education" },
  { id: "healthcare", label: "Healthcare" },
  { id: "community", label: "Community" },
  { id: "volunteers", label: "Volunteers" },
  { id: "livelihood", label: "Livelihood" },
  { id: "events", label: "Events" },
];

const staticImages: GalleryImage[] = [
  { id: "s1", src: biodegradableBag, alt: "Biodegradable bag in hand", category: "sustainability", caption: "Handcrafted biodegradable bags - sustainable alternatives to plastic" },
  { id: "s2", src: treePlanting, alt: "Tree plantation drive", category: "sustainability", caption: "Community tree plantation drive to increase green cover" },
  { id: "s3", src: ecoProducts, alt: "Eco-friendly packaging workshop", category: "sustainability", caption: "Training session on eco-friendly packaging techniques" },
  { id: "1", src: classroomChildren, alt: "Children in classroom", category: "education", caption: "Students engaged in interactive learning at our education center" },
  { id: "2", src: healthCamp, alt: "Health camp", category: "healthcare", caption: "Free health check-up camp serving rural community members" },
  { id: "3", src: awarenessProgram, alt: "Community gathering", category: "community", caption: "Community members participating in awareness program" },
  { id: "4", src: helpingElderly, alt: "Volunteers helping", category: "volunteers", caption: "Dedicated volunteers distributing supplies to families in need" },
  { id: "5", src: tailoringTraining, alt: "Skill training", category: "livelihood", caption: "Women learning tailoring skills for economic independence" },
  { id: "6", src: culturalEvent, alt: "Celebration event", category: "events", caption: "Annual foundation day celebration with beneficiaries" },
  { id: "7", src: schoolSupplies, alt: "School supplies distribution", category: "education", caption: "Back to school campaign - distributing supplies to underprivileged children" },
  { id: "8", src: elderlyCare, alt: "Senior healthcare", category: "healthcare", caption: "Health awareness session for senior citizens" },
  { id: "9", src: communityKitchen, alt: "Community kitchen", category: "community", caption: "Community kitchen serving nutritious meals daily" },
  { id: "10", src: volunteerTraining, alt: "Team meeting", category: "volunteers", caption: "Volunteer orientation and training session" },
  { id: "11", src: computerTraining, alt: "Computer training", category: "livelihood", caption: "Digital literacy program for young adults" },
  { id: "12", src: fundraiserGala, alt: "Fundraiser gala", category: "events", caption: "Annual charity gala - bringing the community together" },
  { id: "13", src: graduation, alt: "Graduation ceremony", category: "education", caption: "Skill development program graduation ceremony" },
  { id: "14", src: mobileClinic, alt: "Mobile clinic", category: "healthcare", caption: "Mobile health clinic reaching remote villages" },
  { id: "15", src: reliefDistribution, alt: "Relief distribution", category: "community", caption: "Emergency relief distribution during natural calamity" },
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(staticImages);

  useEffect(() => {
    fetchPublicGallery().then((data) => {
      if (data && data.length > 0) {
        const mapped: GalleryImage[] = data.map((img: Record<string, unknown>, i: number) => ({
          id: String(img.id || i),
          src: String(img.src || ''),
          alt: String(img.alt || ''),
          category: String(img.category || 'general'),
          caption: String(img.caption || ''),
        }));
        // Merge: DB images first, then static as fallback
        setGalleryImages([...mapped, ...staticImages]);
      }
    });
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
        <section className="relative py-20">
          <div className="absolute inset-0">
            <img src={culturalEvent} alt="Gallery hero" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
            <div className="absolute inset-0 bg-primary/85" />
          </div>
          <div className="relative container mx-auto px-4">
            <AnimatedSection className="text-center text-primary-foreground">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Photo Gallery</h1>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">Explore moments captured from our programs, events, and the communities we serve.</p>
            </AnimatedSection>
          </div>
        </section>

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

        <section className="py-12">
          <div className="container mx-auto px-4">
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

            {filteredImages.length === 0 && (
              <div className="text-center py-12"><p className="text-muted-foreground text-lg">No photos found in this category.</p></div>
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
