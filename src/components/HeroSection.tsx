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
  },
  {
    image: educationImage,
    alt: "Education program for rural children",
  },
  {
    image: healthcareImage,
    alt: "Healthcare initiative in villages",
  },
  {
    image: livelihoodImage,
    alt: "Livelihood and skill development",
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
      className="relative h-[70vh] min-h-[500px] pt-20 bg-gradient-to-br from-background to-muted"
    >
      <div className="container mx-auto px-4 h-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 h-full items-center">
          {/* Left: Text Content */}
          <div className="space-y-6 animate-slide-up order-2 lg:order-1">
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Empowering Communities,
              <br />
              <span className="text-primary">Transforming Lives</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-lg leading-relaxed">
              Dedicated to uplifting rural communities through education, healthcare, 
              and sustainable livelihood programs across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#about" className="btn-primary">
                Learn More
              </a>
              <a
                href="#get-involved"
                className="border border-border text-foreground hover:bg-muted transition-all duration-200 px-6 py-3 rounded-lg font-medium text-center"
              >
                Get Involved
              </a>
            </div>
          </div>

          {/* Right: Image Carousel */}
          <div className="relative h-[280px] md:h-[350px] lg:h-full order-1 lg:order-2">
            <div className="overflow-hidden rounded-2xl h-full" ref={emblaRef}>
              <div className="flex h-full">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className="flex-[0_0_100%] min-w-0 relative h-full"
                  >
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={scrollPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-lg"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-lg"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === selectedIndex
                      ? "bg-primary w-6"
                      : "bg-background/60 hover:bg-background/80"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
