import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProgramsSection from "@/components/ProgramsSection";
import CausesSection from "@/components/CausesSection";
import ImpactSection from "@/components/ImpactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import GetInvolvedSection from "@/components/GetInvolvedSection";
import NewsSection from "@/components/NewsSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ProgramsSection />
        <CausesSection />
        <ImpactSection />
        <TestimonialsSection />
        <GetInvolvedSection />
        <NewsSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
