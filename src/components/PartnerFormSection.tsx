import { Building2, Handshake, Target, Users } from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "./AnimatedSection";

const benefits = [
  { icon: Handshake, label: "Joint Programs" },
  { icon: Target, label: "CSR Initiatives" },
  { icon: Users, label: "Resource Sharing" },
  { icon: Building2, label: "Community Impact" },
];

const PartnerFormSection = () => {
  return (
    <section id="partner" className="py-24 section-warm">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection animation="fadeUp" className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Handshake className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Collaborate with Us</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Partner with Us
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We welcome partnerships with corporates, NGOs, government bodies, and educational 
            institutions. Together, we can amplify our impact and reach more communities in need.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Benefits & Info */}
          <AnimatedSection animation="slideRight" className="space-y-8">
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                Partnership Opportunities
              </h3>
              <StaggerContainer className="grid grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <StaggerItem key={benefit.label}>
                    <div className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <benefit.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground text-sm">{benefit.label}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
              <h4 className="font-semibold text-foreground mb-3">Why Partner with AGR Foundation?</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✓ Transparent reporting and impact metrics</li>
                <li>✓ Tax benefits under 80G certification</li>
                <li>✓ Direct community engagement opportunities</li>
                <li>✓ Customized partnership programs</li>
                <li>✓ Recognition and brand visibility</li>
              </ul>
            </div>

            <div className="p-6 bg-background rounded-xl border border-border">
              <h4 className="font-semibold text-foreground mb-2">Current Partners</h4>
              <p className="text-sm text-muted-foreground">
                We're proud to work with local businesses, educational institutions, and 
                community organizations across Visakhapatnam district.
              </p>
            </div>
          </AnimatedSection>

          {/* Google Form Embed */}
          <AnimatedSection animation="slideLeft" delay={0.2}>
            <div className="card-elevated overflow-hidden">
              <iframe
                src="YOUR_PARTNER_GOOGLE_FORM_EMBED_URL_HERE"
                width="100%"
                height="700"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Partner with Us Form"
                loading="lazy"
                className="w-full"
                style={{ minHeight: "700px" }}
              >
                Loading partnership form...
              </iframe>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              We'll respond to partnership inquiries within 48 hours.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default PartnerFormSection;
