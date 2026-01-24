import { Users, Leaf, TreePine, Droplets, Recycle } from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "./AnimatedSection";

const initiatives = [
  { icon: Leaf, label: "Banana Leaf Distribution" },
  { icon: Recycle, label: "Eco-Packaging Training" },
  { icon: TreePine, label: "Tree Plantation" },
  { icon: Droplets, label: "Lake Cleaning" },
  { icon: Users, label: "Zero Waste Workshops" },
];

const VolunteerFormSection = () => {
  return (
    <section id="volunteer" className="py-24 section-warm">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection animation="fadeUp" className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Become a Volunteer
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our community of changemakers and make a real difference. Whether you have a few hours or a few days, your contribution matters.
          </p>
        </AnimatedSection>

        {/* Initiatives */}
        <StaggerContainer className="flex flex-wrap justify-center gap-3 mb-12">
          {initiatives.map((item) => (
            <StaggerItem key={item.label}>
              <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-border">
                <item.icon className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{item.label}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Google Form Embed */}
        <AnimatedSection animation="fadeUp" delay={0.2}>
          <div className="max-w-3xl mx-auto">
            <div className="card-elevated overflow-hidden">
              <iframe
                src="YOUR_VOLUNTEER_GOOGLE_FORM_EMBED_URL_HERE"
                width="100%"
                height="800"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Volunteer Registration Form"
                loading="lazy"
                className="w-full"
                style={{ minHeight: "800px" }}
              >
                Loading volunteer registration form...
              </iframe>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Your information is securely submitted via Google Forms and saved to our database.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default VolunteerFormSection;
