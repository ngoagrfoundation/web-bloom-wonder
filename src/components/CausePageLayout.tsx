import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Share2, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import AnimatedSection from "./AnimatedSection";

interface FundUsage {
  item: string;
  percentage: number;
}

interface CausePageLayoutProps {
  title: string;
  urgentMessage: string;
  heroImage: string;
  story: string;
  need: string;
  goal: number;
  raised: number;
  donors: number;
  fundUsage: FundUsage[];
  galleryImages?: string[];
  relatedFocus: string;
  relatedFocusLink: string;
  children?: ReactNode;
}

const CausePageLayout = ({
  title,
  urgentMessage,
  heroImage,
  story,
  need,
  goal,
  raised,
  donors,
  fundUsage,
  galleryImages = [],
  relatedFocus,
  relatedFocusLink,
}: CausePageLayoutProps) => {
  const progress = Math.min((raised / goal) * 100, 100);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: urgentMessage,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section - Cleaner */}
        <section className="relative h-[50vh] min-h-[400px]">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 to-foreground/30" />
          </div>
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
            <AnimatedSection animation="fadeUp">
              <Link
                to="/#causes"
                className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors text-sm"
              >
                <ArrowLeft size={18} />
                Back to Causes
              </Link>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                {title}
              </h1>
              <p className="text-lg text-secondary font-medium">
                {urgentMessage}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Left Column - Story */}
              <div className="lg:col-span-2 space-y-10">
                <AnimatedSection animation="fadeUp">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                    The Story
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {story}
                  </p>
                </AnimatedSection>

                <AnimatedSection animation="fadeUp" delay={0.1}>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                    The Need
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {need}
                  </p>
                </AnimatedSection>

                {/* Fund Usage - Cleaner */}
                <AnimatedSection animation="fadeUp" delay={0.2}>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    How Your Donation Helps
                  </h2>
                  <div className="space-y-5">
                    {fundUsage.map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-foreground font-medium">{item.item}</span>
                          <span className="text-muted-foreground">{item.percentage}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-secondary rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.percentage}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>

                {/* Gallery */}
                {galleryImages.length > 0 && (
                  <AnimatedSection animation="fadeUp" delay={0.3}>
                    <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                      Gallery
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {galleryImages.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl"
                        />
                      ))}
                    </div>
                  </AnimatedSection>
                )}
              </div>

              {/* Right Column - Donation Card */}
              <div className="lg:col-span-1">
                <AnimatedSection animation="fadeUp">
                  <div className="card-elevated p-6 sticky top-24">
                    {/* Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between items-end mb-3">
                        <div>
                          <span className="text-3xl font-display font-bold text-primary">
                            ₹{raised.toLocaleString()}
                          </span>
                          <span className="text-muted-foreground text-sm ml-1">raised</span>
                        </div>
                        <span className="text-muted-foreground text-sm">
                          of ₹{goal.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>{Math.round(progress)}% funded</span>
                        <span>{donors} donors</span>
                      </div>
                    </div>

                    {/* Quick Donate Amounts */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[500, 1000, 2500].map((amount) => (
                        <Link
                          key={amount}
                          to={`/donate?amount=${amount}`}
                          className="py-2.5 px-3 border border-border rounded-lg text-center hover:border-primary hover:text-primary transition-colors text-sm font-medium"
                        >
                          ₹{amount}
                        </Link>
                      ))}
                    </div>

                    {/* Main Donate Button */}
                    <Link
                      to="/donate"
                      className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
                    >
                      <Heart size={18} />
                      Donate Now
                    </Link>

                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      className="w-full flex items-center justify-center gap-2 py-3 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
                    >
                      <Share2 size={16} />
                      Share This Cause
                    </button>

                    {/* Related Focus Area */}
                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Related Focus Area</p>
                      <Link
                        to={relatedFocusLink}
                        className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                      >
                        {relatedFocus} →
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CausePageLayout;
