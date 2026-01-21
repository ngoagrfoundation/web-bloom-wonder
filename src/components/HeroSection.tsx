import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-volunteers.jpg";
import educationImage from "@/assets/education-program.jpg";
import healthcareImage from "@/assets/healthcare-program.jpg";
import livelihoodImage from "@/assets/livelihood-program.jpg";

const slides = [
  {
    image: heroImage,
    alt: "Community volunteers working together",
    title: "Empowering Communities,",
    subtitle: "Transforming Lives",
    description: "Dedicated to uplifting rural communities through education, healthcare, and sustainable livelihood programs across India.",
  },
  {
    image: educationImage,
    alt: "Education program for rural children",
    title: "Education for All,",
    subtitle: "Building Futures",
    description: "Providing quality education and learning resources to underserved children, empowering the next generation with knowledge.",
  },
  {
    image: healthcareImage,
    alt: "Healthcare initiative in villages",
    title: "Healthcare Access,",
    subtitle: "Saving Lives",
    description: "Bringing essential healthcare services and medical support to remote villages where access is limited.",
  },
  {
    image: livelihoodImage,
    alt: "Livelihood and skill development",
    title: "Skill Development,",
    subtitle: "Creating Opportunities",
    description: "Training and supporting individuals with vocational skills to build sustainable livelihoods and self-reliance.",
  },
];

const HeroSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);

    // Auto-play
    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(autoplay);
    };
  }, [emblaApi]);

  return (
    <section
      id="home"
      className="relative h-[70vh] min-h-[500px] pt-20"
    >
      {/* Full-width Carousel */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 h-full relative"
            >
              {/* Full Background Image */}
              <img
                src={slide.image}
                alt={slide.alt}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* 40% Dark Overlay */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Overlaid Text Content */}
              <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl">
                  <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                    {slide.title}
                    <br />
                    <span className="text-secondary">{slide.subtitle}</span>
                  </h1>
                  <p className="text-white/90 text-base md:text-lg lg:text-xl max-w-lg leading-relaxed mt-4 md:mt-6">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-8">
                    <a 
                      href="#about" 
                      className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 px-6 py-3 rounded-lg font-medium text-center"
                    >
                      Learn More
                    </a>
                    <a
                      href="#get-involved"
                      className="border-2 border-white text-white hover:bg-white hover:text-foreground transition-all duration-200 px-6 py-3 rounded-lg font-medium text-center"
                    >
                      Get Involved
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "bg-white w-8"
                : "bg-white/50 w-2 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;