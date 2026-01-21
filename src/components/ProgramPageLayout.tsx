import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { MobileLayout } from "./mobile";
import AnimatedSection, { StaggerContainer, StaggerItem } from "./AnimatedSection";

interface Activity {
  title: string;
  description: string;
}

interface Stat {
  value: string;
  label: string;
}

interface ProgramPageLayoutProps {
  title: string;
  tagline: string;
  heroImage: string;
  overview: string;
  activities: Activity[];
  stats: Stat[];
  relatedFocus?: { title: string; link: string }[];
  children?: ReactNode;
}

const ProgramPageLayout = ({
  title,
  tagline,
  heroImage,
  overview,
  activities,
  stats,
  relatedFocus = [],
}: ProgramPageLayoutProps) => {
  return (
    <MobileLayout>
      <main className="pt-14 md:pt-0">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
          </div>
          <div className="relative container mx-auto px-4">
            <AnimatedSection>
              <Link
                to="/#programs"
                className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Programs
              </Link>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-4">
                {title}
              </h1>
              <p className="text-xl text-primary-foreground/90 max-w-2xl">
                {tagline}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <AnimatedSection>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-6">
                  About This Program
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {overview}
                </p>
              </AnimatedSection>
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="py-16 section-cream">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                Key Activities
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                How we make a difference through this program
              </p>
            </AnimatedSection>

            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {activities.map((activity, index) => (
                <StaggerItem key={index}>
                  <div className="card-elevated p-6 h-full">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <span className="text-primary font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Impact Stats Section */}
        <section className="py-16 maroon-gradient">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-4">
                Our Impact
              </h2>
            </AnimatedSection>

            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <StaggerItem key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-primary-foreground/80 text-sm">
                    {stat.label}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Related Focus Areas */}
        {relatedFocus.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <AnimatedSection className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                  Related Focus Areas
                </h2>
              </AnimatedSection>
              <div className="flex flex-wrap justify-center gap-4">
                {relatedFocus.map((focus, index) => (
                  <Link
                    key={index}
                    to={focus.link}
                    className="px-6 py-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
                  >
                    {focus.title}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 section-cream">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center max-w-2xl mx-auto">
              <Heart className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                Support This Program
              </h2>
              <p className="text-muted-foreground mb-8">
                Your contribution helps us expand our reach and impact more lives through this program.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/donate" className="btn-primary">
                  Donate Now
                </Link>
                <a href="/#contact" className="btn-secondary">
                  Get Involved
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProgramPageLayout;
