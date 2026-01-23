import { MobileLayout } from "@/components/mobile";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProgramsSection from "@/components/ProgramsSection";
import SustainabilitySection from "@/components/SustainabilitySection";
import CausesSection from "@/components/CausesSection";
import ImpactSection from "@/components/ImpactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import GetInvolvedSection from "@/components/GetInvolvedSection";
import NewsSection from "@/components/NewsSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <MobileLayout>
      <main>
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <SustainabilitySection />
        <CausesSection />
        <ImpactSection />
        <TestimonialsSection />
        <GetInvolvedSection />
        <NewsSection />
        <GallerySection />
        <ContactSection />
      </main>
    </MobileLayout>
  );
};

export default Index;