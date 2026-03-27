import { Link } from "react-router-dom";
import { Shield, Users, Leaf, Wrench, Home } from "lucide-react";
import heroImage from "@/assets/hero-volunteers.jpg";

const corePillars = [
  {
    icon: Shield,
    title: "Social Welfare",
    description: "Ensuring the well-being of the vulnerable through healthcare access, education, and essential social support systems.",
    link: "/focus/social-welfare",
  },
  {
    icon: Users,
    title: "Women's Empowerment",
    description: "Providing women with the resources, confidence, and opportunities to lead and succeed in their communities.",
    link: "/focus/womens-empowerment",
  },
  {
    icon: Leaf,
    title: "Environmental Safety",
    description: "Championing eco-friendly initiatives, from reducing plastic waste to promoting biodiversity and clean energy.",
    link: "/focus/environmental-safety",
  },
  {
    icon: Wrench,
    title: "Skill Development",
    description: "Equipping youth and workers with practical, future-ready skills to create sustainable livelihood opportunities.",
    link: "/focus/skill-development",
  },
  {
    icon: Home,
    title: "Rural Development",
    description: "Strengthening village infrastructures and supporting local economies to ensure no community is left behind.",
    link: "/focus/rural-development",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            About AGR Foundation
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Empowering Communities, Sustaining the Future.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden">
              <img
                src={heroImage}
                alt="AGR Foundation team"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-10">
            <div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                Our Story
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Founded with a vision to create lasting change, AGR Foundation began its 
                journey with a commitment to the rural heartlands of India. We believe that 
                a truly prosperous society is one that is self-sustained and eco-friendly. 
                By bridging the gap between traditional wisdom and modern sustainability, 
                we are building a movement that empowers individuals while protecting the 
                planet for future generations.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                Our Core Pillars
              </h3>
              <p className="text-muted-foreground mb-5">
                We focus our efforts across five key areas to ensure a holistic approach to community growth:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                {corePillars.map((pillar) => (
                  <li key={pillar.title} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 flex-shrink-0" />
                    <span>
                      <strong className="text-foreground">{pillar.title}:</strong>{" "}
                      {pillar.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Link to="/#programs" className="btn-primary inline-block">
              Explore Our Work
            </Link>
          </div>
        </div>

        {/* Vision Statement */}
        <div className="mt-24 bg-muted/50 rounded-2xl p-10 md:p-14 text-center max-w-3xl mx-auto">
          <h3 className="font-display text-xl font-semibold text-foreground mb-4">Our Vision</h3>
          <blockquote className="font-display text-lg md:text-xl text-foreground italic leading-relaxed">
            "To build a self-sustained and eco-friendly society where every individual has 
            the opportunity to thrive in a safe and healthy environment."
          </blockquote>
          <cite className="text-primary font-medium not-italic block mt-4">
            — AGR Foundation
          </cite>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
