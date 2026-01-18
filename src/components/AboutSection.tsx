import heroImage from "@/assets/hero-volunteers.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 section-cream">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            About AGR Foundation
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Building hope, one community at a time.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="AGR Foundation team"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative Element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/20 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-2xl -z-10" />
          </div>

          {/* Text Content */}
          <div className="space-y-8">
            <div>
              <h3 className="font-display text-2xl font-semibold text-primary mb-4">
                Our Story
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Founded with a vision to create lasting change, AGR Foundation began its 
                journey in the rural heartlands of India. What started as a small initiative 
                has grown into a movement that touches thousands of lives every year.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl font-semibold text-primary mb-4">
                Our Mission
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                  <span>Providing quality education to underprivileged children</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                  <span>Ensuring access to healthcare in remote areas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                  <span>Creating sustainable livelihood opportunities for women</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                  <span>Supporting communities through grassroots development</span>
                </li>
              </ul>
            </div>

            <a href="#programs" className="btn-primary inline-block">
              Explore Our Work
            </a>
          </div>
        </div>

        {/* Quote */}
        <div className="mt-20 bg-card rounded-2xl p-8 md:p-12 shadow-lg text-center max-w-4xl mx-auto">
          <blockquote className="font-display text-xl md:text-2xl text-foreground italic mb-6">
            "We believe every person deserves the opportunity to thrive. Together, 
            we're building a future where no community is left behind."
          </blockquote>
          <cite className="text-primary font-semibold not-italic">
            — Akhil Gorantham Raju, Founder & Chairman
          </cite>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
