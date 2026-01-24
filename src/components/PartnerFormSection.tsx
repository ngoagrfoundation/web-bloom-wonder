import { Building2, Handshake, Target, Users, Shield, Clock } from "lucide-react";
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

          {/* Google Form Embed with Enhanced UI */}
          <AnimatedSection animation="slideLeft" delay={0.2}>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-border bg-background">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Handshake className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">Partnership Inquiry</h3>
                    <p className="text-sm text-primary-foreground/80">Tell us about your organization</p>
                  </div>
                </div>
              </div>
              
              {/* Form Content */}
              <div className="p-1 bg-muted/30">
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSc8vaQ3MZVN4xorvudwjJ-219bLC-5sXRTrfOU7kJ34AGc8qw/viewform?embedded=true"
                  width="100%"
                  height="600"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  title="Partner with Us Form"
                  loading="lazy"
                  className="w-full bg-background rounded-lg"
                  style={{ minHeight: "600px" }}
                >
                  Loading partnership form...
                </iframe>
              </div>
              
              {/* Form Footer */}
              <div className="px-6 py-4 bg-muted/50 border-t border-border">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-primary" />
                    <span>Secure submission via Google Forms</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Response within 48 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default PartnerFormSection;
