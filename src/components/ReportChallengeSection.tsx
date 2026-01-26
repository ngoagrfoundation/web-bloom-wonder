import { AlertTriangle, MapPin, Heart, Shield, Lock } from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "./AnimatedSection";
import ReportChallengeForm from "./forms/ReportChallengeForm";

const challengeTypes = [
  { icon: Heart, label: "Healthcare Access" },
  { icon: Shield, label: "Education Barriers" },
  { icon: MapPin, label: "Infrastructure Issues" },
  { icon: AlertTriangle, label: "Environmental Concerns" },
];

const ReportChallengeSection = () => {
  return (
    <section id="report-challenge" className="py-24 section-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection animation="fadeUp" className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 rounded-full mb-6">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="text-sm font-medium text-destructive">Community Voice</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Report a Challenge
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Know a community facing challenges? Help us identify and reach those in need. 
            Your report can make a real difference in someone's life.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Info Section */}
          <AnimatedSection animation="slideRight" className="space-y-8">
            <div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                What Can You Report?
              </h3>
              <StaggerContainer className="grid grid-cols-2 gap-4">
                {challengeTypes.map((type) => (
                  <StaggerItem key={type.label}>
                    <div className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <type.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground text-sm">{type.label}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            <div className="p-6 bg-primary/5 rounded-xl border border-primary/10">
              <h4 className="font-semibold text-foreground mb-3">How We Respond</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>1. We review every report within 24-48 hours</li>
                <li>2. Our team verifies the situation on ground</li>
                <li>3. We assess how we can help effectively</li>
                <li>4. We reach out to you with our action plan</li>
                <li>5. We take action and keep you updated</li>
              </ul>
            </div>

            <div className="p-6 bg-background rounded-xl border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground">Your Identity is Protected</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                All reports are treated confidentially. You can choose to remain anonymous 
                if you prefer. Our priority is helping those in need.
              </p>
            </div>
          </AnimatedSection>

          {/* Custom Report Challenge Form */}
          <AnimatedSection animation="slideLeft" delay={0.2}>
            <ReportChallengeForm />
            <p className="text-center text-sm text-muted-foreground mt-4">
              Thank you for being a voice for your community.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ReportChallengeSection;
