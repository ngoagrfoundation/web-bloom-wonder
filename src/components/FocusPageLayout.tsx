import { ReactNode, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MobileLayout } from "./mobile";
import AnimatedSection, { StaggerContainer, StaggerItem } from "./AnimatedSection";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import VolunteerForm from "./forms/VolunteerForm";
import DonationForm from "./DonationForm";

interface Initiative {
  title: string;
  description: string;
}

interface Stat {
  value: string;
  label: string;
}

interface RelatedCause {
  title: string;
  link: string;
}

interface FocusPageLayoutProps {
  title: string;
  tagline: string;
  heroImage: string;
  overview: string;
  whyItMatters: string;
  initiatives: Initiative[];
  stats: Stat[];
  relatedCauses: RelatedCause[];
  children?: ReactNode;
}

const FocusPageLayout = ({
  title,
  tagline,
  heroImage,
  overview,
  whyItMatters,
  initiatives,
  stats,
  relatedCauses,
}: FocusPageLayoutProps) => {
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const donateRef = useRef<HTMLDivElement>(null);

  const handleDonateClick = () => {
    setShowDonation(true);
    setTimeout(() => {
      donateRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <MobileLayout>
      <main className="pt-14 md:pt-20">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px]">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/30" />
          </div>
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
            <AnimatedSection animation="fadeUp">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors text-sm"
              >
                <ArrowLeft size={18} />
                Back to Home
              </Link>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
                {title}
              </h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl">
                {tagline}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16">
              <AnimatedSection animation="fadeUp">
                <h2 className="font-display text-2xl font-bold text-foreground mb-5">
                  What We Do
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {overview}
                </p>
              </AnimatedSection>
              <AnimatedSection animation="fadeUp" delay={0.2}>
                <h2 className="font-display text-2xl font-bold text-foreground mb-5">
                  Why It Matters
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {whyItMatters}
                </p>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Initiatives Section */}
        <section className="py-20 section-cream">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fadeUp" className="text-center mb-14">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Our Initiatives
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Explore the programs and activities we undertake to create lasting impact.
              </p>
            </AnimatedSection>
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initiatives.map((initiative, index) => (
                <StaggerItem key={index}>
                  <div className="card-elevated p-6 h-full">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                      {initiative.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {initiative.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fadeUp" className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold mb-4">
                Our Impact
              </h2>
            </AnimatedSection>
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <StaggerItem key={index}>
                  <div className="text-center">
                    <div className="font-display text-4xl md:text-5xl font-bold mb-2">
                      {stat.value}
                    </div>
                    <div className="text-primary-foreground/70 text-sm">{stat.label}</div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Related Causes */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fadeUp" className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Related Causes
              </h2>
              <p className="text-muted-foreground">
                Support these causes that align with our focus area.
              </p>
            </AnimatedSection>
            <StaggerContainer className="flex flex-wrap justify-center gap-4">
              {relatedCauses.map((cause, index) => (
                <StaggerItem key={index}>
                  <Link
                    to={cause.link}
                    className="btn-outline text-sm"
                  >
                    {cause.title}
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 section-warm">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection animation="fadeUp">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Join Our Mission
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-10">
                Together, we can create lasting change. Support our initiatives and help us
                make a difference in the lives of those who need it most.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={handleDonateClick} className="btn-primary">
                  Donate Now
                </button>
                <button onClick={() => setShowVolunteerModal(true)} className="btn-outline">
                  Get Involved
                </button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Inline Donation Section */}
        {showDonation && (
          <section ref={donateRef} id="donate-section" className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8 text-center">
                  Make a Donation
                </h2>
                <DonationForm />
              </div>
            </div>
          </section>
        )}

        {/* Volunteer Modal */}
        <Dialog open={showVolunteerModal} onOpenChange={(open) => !open && setShowVolunteerModal(false)}>
          <DialogContent className="max-w-2xl max-h-[90vh] p-0">
            <DialogHeader className="sr-only">
              <DialogTitle>Register as a Volunteer</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <VolunteerForm onSuccess={() => setShowVolunteerModal(false)} />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </main>
    </MobileLayout>
  );
};

export default FocusPageLayout;
