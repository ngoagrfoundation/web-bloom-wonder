import heroImage from "@/assets/hero-volunteers.jpg";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20"
    >
      {/* Background Image with Subtle Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="AGR Foundation volunteers"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/70" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="max-w-3xl mx-auto animate-slide-up">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-8 leading-tight">
            Empowering Communities,
            <br />
            <span className="text-secondary">Transforming Lives</span>
          </h1>
          <p className="text-primary-foreground/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Dedicated to uplifting rural communities through education, healthcare, 
            and sustainable livelihood programs across India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#about" className="btn-secondary">
              Learn More
            </a>
            <a
              href="#get-involved"
              className="border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-200 px-6 py-3 rounded-lg font-medium"
            >
              Get Involved
            </a>
          </div>
        </div>
      </div>

      {/* Minimal Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <div className="w-5 h-8 border border-primary-foreground/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary-foreground/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
