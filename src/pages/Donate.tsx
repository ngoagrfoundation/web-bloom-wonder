import { Shield, Heart, Award, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DonationForm from "@/components/DonationForm";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const impactStats = [
  { label: "Lives Impacted", value: "50,000+" },
  { label: "Communities Served", value: "120+" },
  { label: "Active Volunteers", value: "500+" },
  { label: "Years of Service", value: "15" },
];

const trustBadges = [
  { icon: Shield, label: "80G Tax Exemption" },
  { icon: CheckCircle, label: "Verified NGO" },
  { icon: Award, label: "Transparency Certified" },
];

const Donate = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 maroon-gradient">
          <div className="container mx-auto px-4">
            <AnimatedSection className="text-center text-primary-foreground">
              <Heart className="w-16 h-16 mx-auto mb-6 opacity-80" />
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Make a Difference Today
              </h1>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
                Your generous contribution helps us empower communities, educate children, and provide healthcare to those in need.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-8 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <badge.icon size={20} className="text-primary" />
                  <span className="text-sm font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Donation Form */}
              <AnimatedSection className="order-2 lg:order-1">
                <div className="bg-card rounded-2xl shadow-xl p-8">
                  <h2 className="text-2xl font-display font-bold text-foreground mb-6 text-center">
                    Complete Your Donation
                  </h2>
                  <DonationForm />
                </div>
              </AnimatedSection>

              {/* Impact Information */}
              <div className="order-1 lg:order-2">
                <AnimatedSection animation="slideLeft">
                  <h2 className="text-3xl font-display font-bold text-foreground mb-6">
                    Your Impact
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Every rupee you donate goes directly towards creating lasting change in the lives of underprivileged communities. Here's what your contribution can achieve:
                  </p>
                </AnimatedSection>

                {/* Impact Cards */}
                <StaggerContainer className="space-y-4 mb-8">
                  <StaggerItem>
                    <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                      <span className="text-secondary font-bold text-lg">₹500</span>
                      <p className="text-foreground mt-1">Provide school supplies for 1 child for an entire year</p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                      <span className="text-secondary font-bold text-lg">₹1,000</span>
                      <p className="text-foreground mt-1">Fund healthcare for an entire family for 6 months</p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                      <span className="text-secondary font-bold text-lg">₹2,500</span>
                      <p className="text-foreground mt-1">Support complete vocational training for 1 person</p>
                    </div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20">
                      <span className="text-secondary font-bold text-lg">₹5,000</span>
                      <p className="text-foreground mt-1">Sponsor a child's entire education for 1 year</p>
                    </div>
                  </StaggerItem>
                </StaggerContainer>

                {/* Stats */}
                <AnimatedSection delay={0.3}>
                  <div className="grid grid-cols-2 gap-4">
                    {impactStats.map((stat) => (
                      <div key={stat.label} className="stat-card">
                        <span className="text-2xl md:text-3xl font-bold text-primary">
                          {stat.value}
                        </span>
                        <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-16 section-cream">
          <div className="container mx-auto px-4">
            <AnimatedSection className="max-w-3xl mx-auto text-center">
              <blockquote className="text-xl md:text-2xl font-display italic text-foreground mb-6">
                "Donating to AGR Foundation has been one of the most rewarding experiences. Seeing the direct impact of my contribution on children's education is truly fulfilling."
              </blockquote>
              <cite className="text-muted-foreground not-italic">
                — Rajesh Kumar, Monthly Donor since 2020
              </cite>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <AnimatedSection className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-display font-bold text-foreground mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {[
                  {
                    q: "Is my donation tax-deductible?",
                    a: "Yes, AGR Foundation is registered under Section 80G of the Income Tax Act. You will receive a tax exemption certificate for your donation."
                  },
                  {
                    q: "How is my donation used?",
                    a: "90% of all donations go directly to our programs. The remaining 10% covers essential administrative costs to ensure smooth operations."
                  },
                  {
                    q: "Can I donate in memory or honor of someone?",
                    a: "Absolutely! You can dedicate your donation to someone special during the checkout process, and we'll send a acknowledgment card if requested."
                  },
                  {
                    q: "What payment methods do you accept?",
                    a: "We accept all major credit/debit cards, UPI, net banking, and digital wallets. For large donations, bank transfers are also available."
                  },
                ].map((faq, index) => (
                  <div key={index} className="p-6 bg-card rounded-xl border border-border">
                    <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Donate;
