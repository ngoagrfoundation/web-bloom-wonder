import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/mobile";
import HeroSection from "@/components/HeroSection";
import EventsTicker from "@/components/EventsTicker";
import AboutSection from "@/components/AboutSection";
import ProgramsSection from "@/components/ProgramsSection";
import SustainabilitySection from "@/components/SustainabilitySection";
import CausesSection from "@/components/CausesSection";
import ImpactSection from "@/components/ImpactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ReelsSection from "@/components/ReelsSection";
import GetInvolvedSection from "@/components/GetInvolvedSection";
import NewsSection from "@/components/NewsSection";
import GallerySection from "@/components/GallerySection";
import PartnersSection from "@/components/PartnersSection";
import SponsorsSection from "@/components/SponsorsSection";
import YouTubeSection from "@/components/YouTubeSection";
import ContactSection from "@/components/ContactSection";
import { fetchPublicSettings } from "@/lib/api";

const Index = () => {
  const [sectionSettings, setSectionSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPublicSettings().then((data) => {
      if (data) setSectionSettings(data);
    });
  }, []);

  const isEnabled = (key: string) => sectionSettings[`section_${key}_enabled`] !== "0";

  return (
    <MobileLayout>
      <main>
        {isEnabled("hero") && <HeroSection />}
        {isEnabled("events_ticker") && <EventsTicker />}
        {isEnabled("about") && <AboutSection />}
        {isEnabled("programs") && <ProgramsSection />}
        {isEnabled("sustainability") && <SustainabilitySection />}
        {isEnabled("causes") && <CausesSection />}
        {isEnabled("impact") && <ImpactSection />}
        {isEnabled("testimonials") && <TestimonialsSection />}
        {isEnabled("reels") && <ReelsSection />}
        {isEnabled("get_involved") && <GetInvolvedSection />}
        {isEnabled("news") && <NewsSection />}
        {isEnabled("gallery") && <GallerySection />}
        {isEnabled("partners") && <PartnersSection />}
        {isEnabled("sponsors") && <SponsorsSection />}
        {isEnabled("contact") && <ContactSection />}
      </main>
    </MobileLayout>
  );
};

export default Index;
