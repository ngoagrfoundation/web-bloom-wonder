import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Shield, Send } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection animation="fadeUp" className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions or want to get involved? Reach out to us.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <AnimatedSection animation="slideRight" className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Our Office</h3>
                <p className="text-muted-foreground text-sm">
                  Near SRR Public School, Salur Paleti Road,
                  <br />
                  Bheemili, Visakhapatnam, Andhra Pradesh,
                  <br />
                  India - 531162
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Phone Number</h3>
                <p className="text-muted-foreground text-sm">+91 9123456789</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Email Address</h3>
                <p className="text-muted-foreground text-sm">info@agrfoundation.org</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4">
              <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </AnimatedSection>

          {/* Google Form Embed with Enhanced UI */}
          <AnimatedSection animation="slideLeft" delay={0.2}>
            <div className="rounded-2xl overflow-hidden shadow-xl border border-border bg-background">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Send className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">Send us a Message</h3>
                    <p className="text-sm text-primary-foreground/80">We'd love to hear from you</p>
                  </div>
                </div>
              </div>
              
              {/* Form Content */}
              <div className="p-1 bg-muted/30">
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLScFud-Iu30I2-TAkcmOsgyk0EA8UNViTIJ7OrBquMiUtvp4gg/viewform?embedded=true"
                  width="100%"
                  height="500"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  title="Contact Form"
                  loading="lazy"
                  className="w-full bg-background rounded-lg"
                  style={{ minHeight: "500px" }}
                >
                  Loading contact form...
                </iframe>
              </div>
              
              {/* Form Footer */}
              <div className="px-6 py-4 bg-muted/50 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Your message is securely submitted via Google Forms</span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Map Section */}
        <AnimatedSection animation="fadeUp" delay={0.3} className="mt-16">
          <h3 className="font-display text-2xl font-semibold text-foreground text-center mb-8">
            Our Location
          </h3>
          <div className="rounded-2xl overflow-hidden shadow-lg h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30417.04889927721!2d83.39934839762826!3d17.843449287455974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a39583c3f109c1b%3A0x8bfd1fc5a1d43cf7!2sBheemunipatnam%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1705577124539!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="AGR Foundation Location"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ContactSection;
