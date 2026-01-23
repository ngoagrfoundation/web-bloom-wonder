import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import GalleryLightbox, { GalleryImage } from "./GalleryLightbox";
import AnimatedSection, { StaggerContainer, StaggerItem } from "./AnimatedSection";
import bananaLeafWorkshop from "@/assets/gallery/banana-leaf-workshop.jpg";
import biodegradableBag from "@/assets/gallery/biodegradable-bag.jpg";
import bananaLeafLunch from "@/assets/gallery/banana-leaf-lunch.jpg";

const featuredImages: GalleryImage[] = [
  {
    id: "1",
    src: bananaLeafWorkshop,
    alt: "Banana leaf packaging workshop",
    category: "sustainability",
    caption: "Women learning eco-friendly banana leaf packaging techniques",
  },
  {
    id: "2",
    src: biodegradableBag,
    alt: "Biodegradable bag",
    category: "sustainability",
    caption: "Handcrafted biodegradable bags as plastic alternatives",
  },
  {
    id: "3",
    src: bananaLeafLunch,
    alt: "Traditional lunch on banana leaves",
    category: "sustainability",
    caption: "Community meal served on fresh banana leaves - traditional and eco-friendly",
  },
  {
    id: "4",
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
    alt: "Children in classroom",
    category: "education",
    caption: "Students engaged in interactive learning at our education center",
  },
  {
    id: "5",
    src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
    alt: "Health camp",
    category: "healthcare",
    caption: "Free health check-up camp in rural community",
  },
  {
    id: "6",
    src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800",
    alt: "Community gathering",
    category: "community",
    caption: "Community members participating in awareness program",
  },
];

const GallerySection = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="py-24 section-cream">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-14">
          <span className="text-secondary font-medium text-sm uppercase tracking-wider">
            Our Work in Action
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 mb-4">
            Photo Gallery
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explore moments captured from our programs and community events.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14">
          {featuredImages.map((image, index) => (
            <StaggerItem key={image.id}>
              <motion.button
                onClick={() => openLightbox(index)}
                className="relative overflow-hidden rounded-xl group aspect-square w-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm font-medium line-clamp-2">{image.caption}</p>
                </div>
              </motion.button>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <AnimatedSection className="text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
          >
            View Full Gallery
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>

        <GalleryLightbox
          images={featuredImages}
          currentIndex={currentImageIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setCurrentImageIndex}
        />
      </div>
    </section>
  );
};

export default GallerySection;
