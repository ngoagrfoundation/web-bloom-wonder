import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Users, Leaf, Wrench, Home } from "lucide-react";
import defaultHeroImage from "@/assets/hero-volunteers.jpg";
import { fetchPublicSettings } from "@/lib/api";

const corePillars = [
  { icon: Shield, title: "Social Welfare", description: "Healthcare access, education, and essential social support for the vulnerable.", link: "/focus/social-welfare" },
  { icon: Users, title: "Women's Empowerment", description: "Resources, confidence, and opportunities for women to lead and succeed.", link: "/focus/womens-empowerment" },
  { icon: Leaf, title: "Environmental Safety", description: "Eco-friendly initiatives from reducing plastic to promoting biodiversity.", link: "/focus/environmental-safety" },
  { icon: Wrench, title: "Skill Development", description: "Practical, future-ready skills for sustainable livelihood opportunities.", link: "/focus/skill-development" },
  { icon: Home, title: "Rural Development", description: "Strengthening village infrastructure and supporting local economies.", link: "/focus/rural-development" },
];

const AboutSection = () => {
  const [heroImage, setHeroImage] = useState(defaultHeroImage);

  useEffect(() => {
    fetchPublicSettings().then((settings) => {
      if (settings?.about_section_image) setHeroImage(settings.about_section_image);
    });
  }, []);

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">About AGR Foundation</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Empowering Communities, Sustaining the Future.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="relative">
            <div className="rounded-2xl overflow-hidden">
              <img src={heroImage} alt="AGR Foundation team" className="w-full h-auto object-cover" loading="lazy" />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">Our Story</h3>
              <p className="text-muted-foreground leading-relaxed">
                Founded with a vision to create lasting change, AGR Foundation is committed to the rural heartlands of India. 
                We bridge traditional wisdom and modern sustainability, building a movement that empowers individuals while 
                protecting the planet for future generations.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">Our Core Pillars</h3>
              <ul className="space-y-3 text-muted-foreground">
                {corePillars.map((pillar) => (
                  <li key={pillar.title} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">{pillar.title}:</strong> {pillar.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <a href="#programs" className="btn-primary inline-block">Explore Our Work</a>
          </div>
        </div>

        <div className="mt-24 bg-muted/50 rounded-2xl p-10 md:p-14 text-center max-w-3xl mx-auto">
          <h3 className="font-display text-xl font-semibold text-foreground mb-4">Our Vision</h3>
          <blockquote className="font-display text-lg md:text-xl text-foreground italic leading-relaxed">
            "To build a self-sustained and eco-friendly society where every individual has the opportunity to thrive in a safe and healthy environment."
          </blockquote>
          <cite className="text-primary font-medium not-italic block mt-4">— AGR Foundation</cite>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
