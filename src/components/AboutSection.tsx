import heroImage from "@/assets/hero-volunteers.jpg";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            About AGR Foundation
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Building hope, one community at a time.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image - Clean presentation */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden">
              <img
                src={heroImage}
                alt="AGR Foundation team"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-10">
            <div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                Our Story
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Founded with a vision to create lasting change, AGR Foundation began its 
                journey in the rural heartlands of India. What started as a small initiative 
                has grown into a movement that touches thousands of lives every year.
              </p>
            </div>

            <div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                Our Mission
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 flex-shrink-0" />
                  <span>Providing quality education to underprivileged children</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 flex-shrink-0" />
                  <span>Ensuring access to healthcare in remote areas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 flex-shrink-0" />
                  <span>Creating sustainable livelihood opportunities for women</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2.5 flex-shrink-0" />
                  <span>Supporting communities through grassroots development</span>
                </li>
              </ul>
            </div>

            <a href="#programs" className="btn-primary inline-block">
              Explore Our Work
            </a>
          </div>
        </div>

        {/* Quote - Cleaner card */}
        <div className="mt-24 bg-muted/50 rounded-2xl p-10 md:p-14 text-center max-w-3xl mx-auto">
          <blockquote className="font-display text-xl md:text-2xl text-foreground italic mb-6 leading-relaxed">
            "We believe that true development means living in harmony with nature. Our mission is not just to support people but to create a future by building a self-sustainable and eco-friendly society."
          </blockquote>
          <cite className="text-primary font-medium not-italic">
            — Aleti Govardhan Raju, Founder & Chairman
          </cite>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
