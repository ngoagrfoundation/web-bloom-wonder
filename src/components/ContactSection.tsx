import { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import ContactForm from "./forms/ContactForm";
import { fetchPublicSettings } from "@/lib/api";

const ContactSection = () => {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPublicSettings().then((settings) => {
      if (settings) setContent(settings);
    });
  }, []);

  const socialLinks = [
    { key: "facebook", href: content.facebook, icon: Facebook, label: "Facebook" },
    { key: "twitter", href: content.twitter, icon: Twitter, label: "Twitter" },
    { key: "instagram", href: content.instagram, icon: Instagram, label: "Instagram" },
    { key: "linkedin", href: content.linkedin, icon: Linkedin, label: "LinkedIn" },
    { key: "youtube", href: content.youtube, icon: Youtube, label: "YouTube" },
  ].filter((item) => Boolean(item.href));

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <AnimatedSection animation="fadeUp" className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            {content.contact_title || "Contact Us"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {content.contact_description || "Have questions or want to get involved? Reach out to us."}
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
                  {content.address || "Near JNTU Metro Station, Sardar Patel Nagar, Dharma Reddy Colony Phase II, Kukatpally Housing Board Colony, Kukatpally, Hyderabad, Telangana 500085"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Phone Number</h3>
                <p className="text-muted-foreground text-sm">{content.phone || "+91 7036555699"}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Email Address</h3>
                <p className="text-muted-foreground text-sm">{content.email || "info@agrfoundation.ngo"}</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4">
              <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    aria-label={item.label}
                  >
                    <item.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Custom Contact Form */}
          <AnimatedSection animation="slideLeft" delay={0.2}>
            <ContactForm />
          </AnimatedSection>
        </div>

        {/* Map Section */}
        <AnimatedSection animation="fadeUp" delay={0.3} className="mt-16">
          <h3 className="font-display text-2xl font-semibold text-foreground text-center mb-8">
            {content.contact_map_title || "Our Location"}
          </h3>
          <div className="rounded-2xl overflow-hidden shadow-lg h-80">
            <iframe
              src={content.contact_map_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7610.3844234599765!2d78.38406581679982!3d17.49833566522362!2m3!1f0!2f0!3f0!2m3!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91003137a339%3A0x46d7bebcb13df32f!2sAGR%20FOUNDATION!5e0!3m2!1sen!2sin!4v1754285070405!5m2!1sen!2sin"}
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
