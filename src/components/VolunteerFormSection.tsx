import { Users, TreePine, Droplets, Recycle, Sparkles, Heart, Clock, Shield, Calendar } from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "./AnimatedSection";

const initiatives = [
  { icon: Recycle, label: "Eco-Packaging Training" },
  { icon: TreePine, label: "Tree Plantation" },
  { icon: Droplets, label: "Lake Cleaning" },
  { icon: Sparkles, label: "Zero Waste Workshops" },
  { icon: Users, label: "Community Outreach" },
];

const benefits = [
  { icon: Heart, title: "Make an Impact", description: "Directly help communities in need" },
  { icon: Users, title: "Join a Community", description: "Connect with like-minded changemakers" },
  { icon: Calendar, title: "Flexible Hours", description: "Volunteer when it suits your schedule" },
];

const VolunteerFormSection = () => {
  return (
    <section id="volunteer" className="py-24 section-warm">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection animation="fadeUp" className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Join Our Team</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Become a Volunteer
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our community of changemakers and make a real difference. Whether you have a few hours or a few days, your contribution matters.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Info Panel */}
          <AnimatedSection animation="slideRight" className="space-y-8">
            {/* Initiatives */}
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                Our Initiatives
              </h3>
              <StaggerContainer className="flex flex-wrap gap-3">
                {initiatives.map((item) => (
                  <StaggerItem key={item.label}>
                    <div className="flex items-center gap-2 px-4 py-2 bg-background rounded-full border border-border">
                      <item.icon className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">{item.label}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <h3 className="font-display text-xl font-semibold text-foreground">
                Why Volunteer with Us?
              </h3>
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Time Commitment */}
            <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
              <h4 className="font-semibold text-foreground mb-3">Time Commitment</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✓ Weekend programs: 4-6 hours</li>
                <li>✓ Monthly events: 1 day</li>
                <li>✓ Regular volunteering: 2-4 hours/week</li>
                <li>✓ Special campaigns: As per availability</li>
              </ul>
            </div>
          </AnimatedSection>

          {/* Google Form Embed with Enhanced UI */}
          <AnimatedSection animation="slideLeft" delay={0.2}>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-border bg-background">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">Register as a Volunteer</h3>
                    <p className="text-sm text-primary-foreground/80">Start making a difference today</p>
                  </div>
                </div>
              </div>
              
              {/* Form Content */}
              <div className="p-1 bg-muted/30">
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSeAOB76FS8FHLh-IdC2EcTkYS-SP7b1aUgcN7Lxz9ic9YXowQ/viewform?embedded=true"
                  width="100%"
                  height="650"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  title="Volunteer Registration Form"
                  loading="lazy"
                  className="w-full bg-background rounded-lg"
                  style={{ minHeight: "650px" }}
                >
                  Loading volunteer registration form...
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
                    <span>We'll contact you within 48 hours</span>
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

export default VolunteerFormSection;
