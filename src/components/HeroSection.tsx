import { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { fetchPublicSettings } from "@/lib/api";
import heroImage from "@/assets/hero-volunteers.jpg";
import educationImage from "@/assets/education-program.jpg";
import healthcareImage from "@/assets/healthcare-program.jpg";
import livelihoodImage from "@/assets/livelihood-program.jpg";
import sanskritHeroImage from "@/assets/generated/sanskrit-hero.jpg";
import dentalHeroImage from "@/assets/generated/dental-hero.jpg";

interface SlideData {
  image: string;
  alt: string;
  title: string;
  subtitle: string;
  description: string;
  link: string;
  hasRegister?: boolean;
  registerType?: "sanskrit" | "dental";
}

const defaultSlides: SlideData[] = [
  { image: heroImage, alt: "Community volunteers working together", title: "Our Motto is,", subtitle: "Building a self-sustainable and eco-friendly society", description: "Dedicated to uplifting rural communities through education, healthcare, and sustainable livelihood programs across India.", link: "/#about" },
  { image: educationImage, alt: "Education program for rural children", title: "Education for All,", subtitle: "Building Futures", description: "Providing quality education and learning resources to underserved children, empowering the next generation with knowledge.", link: "/programs/education" },
  { image: healthcareImage, alt: "Healthcare initiative in villages", title: "Healthcare Access,", subtitle: "Saving Lives", description: "Bringing essential healthcare services and medical support to remote villages where access is limited.", link: "/programs/healthcare" },
  { image: livelihoodImage, alt: "Livelihood and skill development", title: "Skill Development,", subtitle: "Creating Opportunities", description: "Training and supporting individuals with vocational skills to build sustainable livelihoods and self-reliance.", link: "/focus/skill-development" },
  { image: sanskritHeroImage, alt: "Free online Sanskrit classes", title: "Free Online,", subtitle: "Sanskrit Classes", description: "Learn the ancient language of Sanskrit from the comfort of your home. Free online classes for all ages with experienced teachers.", link: "/programs/learning-sanskrit", hasRegister: true, registerType: "sanskrit" },
  { image: dentalHeroImage, alt: "Free dental treatment camp", title: "Free Dental,", subtitle: "Treatment Camp", description: "Get free dental check-ups and treatment at our community health camps. Quality dental care accessible to everyone.", link: "/programs/dental-treatment", hasRegister: true, registerType: "dental" },
];

const HeroSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slides, setSlides] = useState<SlideData[]>(defaultSlides);
  const [showSanskritForm, setShowSanskritForm] = useState(false);
  const [showDentalForm, setShowDentalForm] = useState(false);
  const [sanskritForm, setSanskritForm] = useState({ name: "", address: "", age: "", batch: "", mobile: "" });
  const [sanskritSubmitting, setSanskritSubmitting] = useState(false);
  const [dentalForm, setDentalForm] = useState({ name: "", mobile: "", address: "", problem: "" });
  const [dentalSubmitting, setDentalSubmitting] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    const autoplay = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => { emblaApi.off("select", onSelect); clearInterval(autoplay); };
  }, [emblaApi]);

  // Fetch hero slide overrides from settings
  useEffect(() => {
    fetchPublicSettings().then((settings) => {
      if (!settings) return;
      const updated = defaultSlides.map((slide, i) => {
        const override = settings[`hero_slide_${i + 1}`];
        return override ? { ...slide, image: override } : slide;
      });
      setSlides(updated);
    });
  }, []);

  const handleRegisterClick = (type: "sanskrit" | "dental") => {
    if (type === "sanskrit") setShowSanskritForm(true);
    else setShowDentalForm(true);
  };

  const handleSanskritSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sanskritForm.name || !sanskritForm.mobile || !sanskritForm.batch) { toast.error("Please fill in all required fields"); return; }
    if (!/^[6-9]\d{9}$/.test(sanskritForm.mobile)) { toast.error("Please enter a valid 10-digit mobile number"); return; }
    setSanskritSubmitting(true);
    import("@/lib/api").then(({ submitFormToAPI }) => { submitFormToAPI("sanskrit_registration", sanskritForm).catch(() => {}); });
    setTimeout(() => { toast.success("Registration successful!"); setSanskritForm({ name: "", address: "", age: "", batch: "", mobile: "" }); setSanskritSubmitting(false); setShowSanskritForm(false); }, 1000);
  };

  const handleDentalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dentalForm.name || !dentalForm.mobile) { toast.error("Please fill in all required fields"); return; }
    if (!/^[6-9]\d{9}$/.test(dentalForm.mobile)) { toast.error("Please enter a valid 10-digit mobile number"); return; }
    setDentalSubmitting(true);
    import("@/lib/api").then(({ submitFormToAPI }) => { submitFormToAPI("dental_registration", dentalForm).catch(() => {}); });
    setTimeout(() => { toast.success("Registration successful!"); setDentalForm({ name: "", mobile: "", address: "", problem: "" }); setDentalSubmitting(false); setShowDentalForm(false); }, 1000);
  };

  return (
    <>
      <section id="home" className="relative h-[70vh] min-h-[500px] pt-20">
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 h-full relative">
                <img src={slide.image} alt={slide.alt} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
                <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
                  <div className="max-w-2xl">
                    <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                      {slide.title}<br /><span className="text-white">{slide.subtitle}</span>
                    </h1>
                    <p className="text-white/90 text-base md:text-lg lg:text-xl max-w-lg leading-relaxed mt-4 md:mt-6">{slide.description}</p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-8">
                      <a href={slide.link} className="bg-white text-primary hover:bg-white/90 transition-all duration-200 px-6 py-3 rounded-lg font-medium text-center">Learn More</a>
                      {slide.hasRegister && slide.registerType ? (
                        <button onClick={() => handleRegisterClick(slide.registerType!)} className="border-2 border-white text-white hover:bg-white hover:text-foreground transition-all duration-200 px-6 py-3 rounded-lg font-medium text-center">Register Now</button>
                      ) : (
                        <a href="#get-involved" className="border-2 border-white text-white hover:bg-white hover:text-foreground transition-all duration-200 px-6 py-3 rounded-lg font-medium text-center">Get Involved</a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button onClick={scrollPrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10" aria-label="Previous slide"><ChevronLeft size={24} /></button>
        <button onClick={scrollNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors z-10" aria-label="Next slide"><ChevronRight size={24} /></button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button key={index} onClick={() => scrollTo(index)} className={`h-2 rounded-full transition-all duration-300 ${index === selectedIndex ? "bg-white w-8" : "bg-white/50 w-2 hover:bg-white/70"}`} aria-label={`Go to slide ${index + 1}`} />
          ))}
        </div>
      </section>

      <Dialog open={showSanskritForm} onOpenChange={setShowSanskritForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="text-xl font-bold text-primary">Register for Free Sanskrit Classes</DialogTitle></DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <form onSubmit={handleSanskritSubmit} className="space-y-4 p-1">
              <div className="space-y-2"><Label htmlFor="sanskrit-name">Name <span className="text-destructive">*</span></Label><Input id="sanskrit-name" placeholder="Enter your full name" value={sanskritForm.name} onChange={(e) => setSanskritForm(p => ({ ...p, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label htmlFor="sanskrit-mobile">Mobile Number <span className="text-destructive">*</span></Label><Input id="sanskrit-mobile" placeholder="9999999999" maxLength={10} value={sanskritForm.mobile} onChange={(e) => setSanskritForm(p => ({ ...p, mobile: e.target.value.replace(/\D/g, "") }))} /></div>
              <div className="space-y-2"><Label htmlFor="sanskrit-address">Address</Label><Input id="sanskrit-address" placeholder="Enter your address" value={sanskritForm.address} onChange={(e) => setSanskritForm(p => ({ ...p, address: e.target.value }))} /></div>
              <div className="space-y-2"><Label htmlFor="sanskrit-age">Age</Label><Input id="sanskrit-age" type="number" placeholder="Enter your age" min="5" max="100" value={sanskritForm.age} onChange={(e) => setSanskritForm(p => ({ ...p, age: e.target.value }))} /></div>
              <div className="space-y-2">
                <Label htmlFor="sanskrit-batch">Preferred Batch <span className="text-destructive">*</span></Label>
                <Select value={sanskritForm.batch} onValueChange={(val) => setSanskritForm(p => ({ ...p, batch: val }))}>
                  <SelectTrigger id="sanskrit-batch"><SelectValue placeholder="Select a batch" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (6:00 AM - 7:00 AM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (2:00 PM - 3:00 PM)</SelectItem>
                    <SelectItem value="evening">Evening (6:00 PM - 7:00 PM)</SelectItem>
                    <SelectItem value="weekend">Weekend (10:00 AM - 11:00 AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={sanskritSubmitting}>{sanskritSubmitting ? "Submitting..." : "Register Now"}</Button>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showDentalForm} onOpenChange={setShowDentalForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="text-xl font-bold text-primary">Register for Free Dental Treatment</DialogTitle></DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <form onSubmit={handleDentalSubmit} className="space-y-4 p-1">
              <div className="space-y-2"><Label htmlFor="dental-name">Name <span className="text-destructive">*</span></Label><Input id="dental-name" placeholder="Enter your full name" value={dentalForm.name} onChange={(e) => setDentalForm(p => ({ ...p, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label htmlFor="dental-mobile">Mobile Number <span className="text-destructive">*</span></Label><Input id="dental-mobile" placeholder="9999999999" maxLength={10} value={dentalForm.mobile} onChange={(e) => setDentalForm(p => ({ ...p, mobile: e.target.value.replace(/\D/g, "") }))} /></div>
              <div className="space-y-2"><Label htmlFor="dental-address">Address</Label><Input id="dental-address" placeholder="Enter your address" value={dentalForm.address} onChange={(e) => setDentalForm(p => ({ ...p, address: e.target.value }))} /></div>
              <div className="space-y-2"><Label htmlFor="dental-problem">Describe Your Dental Problem</Label><Textarea id="dental-problem" placeholder="Briefly describe your dental issue..." rows={3} value={dentalForm.problem} onChange={(e) => setDentalForm(p => ({ ...p, problem: e.target.value }))} /></div>
              <Button type="submit" className="w-full" disabled={dentalSubmitting}>{dentalSubmitting ? "Submitting..." : "Register Now"}</Button>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HeroSection;
