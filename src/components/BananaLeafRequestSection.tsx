import { Leaf, Calendar, Truck, HelpCircle } from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "./AnimatedSection";

const faqs = [
  {
    icon: Calendar,
    question: "How far in advance should I order?",
    answer: "We recommend placing orders at least 3-5 days before your event to ensure availability.",
  },
  {
    icon: Truck,
    question: "Do you deliver?",
    answer: "Yes, we deliver to Bheemili and surrounding areas. Delivery is free for orders above 100 leaves.",
  },
  {
    icon: HelpCircle,
    question: "What quantities are available?",
    answer: "We can provide from 25 leaves for small gatherings to 500+ for large events like weddings.",
  },
];

const BananaLeafRequestSection = () => {
  return (
    <section id="banana-leaf-request" className="py-24 section-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection animation="fadeUp" className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Leaf className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Eco-Friendly Alternative</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Request Banana Leaves
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Planning a wedding, festival, or family function? Request fresh banana leaves as a sustainable 
            alternative to plastic plates. Help us reduce waste while honoring our traditions.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* FAQ Section */}
          <AnimatedSection animation="slideRight" className="space-y-6">
            <h3 className="font-display text-xl font-semibold text-foreground mb-6">
              Frequently Asked Questions
            </h3>
            <StaggerContainer className="space-y-4">
              {faqs.map((faq) => (
                <StaggerItem key={faq.question}>
                  <div className="card-elevated p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <faq.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{faq.question}</h4>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <div className="p-5 bg-primary/5 rounded-xl border border-primary/10">
              <h4 className="font-semibold text-foreground mb-2">Why Choose Banana Leaves?</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>✓ 100% biodegradable - decomposes in weeks</li>
                <li>✓ Natural and chemical-free</li>
                <li>✓ Traditional and culturally significant</li>
                <li>✓ Supports local farmers and livelihoods</li>
              </ul>
            </div>
          </AnimatedSection>

          {/* Google Form Embed */}
          <AnimatedSection animation="slideLeft" delay={0.2}>
            <div className="card-elevated overflow-hidden">
              <iframe
                src="YOUR_BANANA_LEAF_REQUEST_GOOGLE_FORM_EMBED_URL_HERE"
                width="100%"
                height="700"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Request Banana Leaves Form"
                loading="lazy"
                className="w-full"
                style={{ minHeight: "700px" }}
              >
                Loading banana leaf request form...
              </iframe>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              We'll contact you within 24 hours to confirm your request.
            </p>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default BananaLeafRequestSection;
