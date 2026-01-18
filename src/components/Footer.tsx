import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "#home" },
        { label: "About Us", href: "#about" },
        { label: "Our Programs", href: "#programs" },
        { label: "Get Involved", href: "#get-involved" },
      ],
    },
    {
      title: "Programs",
      links: [
        { label: "Education", href: "#programs" },
        { label: "Healthcare", href: "#programs" },
        { label: "Livelihood", href: "#programs" },
        { label: "Community Development", href: "#programs" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "#contact" },
        { label: "Donate", href: "#donate" },
        { label: "Volunteer", href: "#get-involved" },
        { label: "Partner With Us", href: "#get-involved" },
      ],
    },
  ];

  return (
    <footer id="donate" className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-secondary-foreground font-display font-bold text-lg">
                  A
                </span>
              </div>
              <span className="font-display font-semibold text-lg">
                AGR Foundation
              </span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
              Dedicated to building sustainable communities through education, 
              healthcare, and livelihood programs across rural India.
            </p>
            <div className="flex items-center gap-2 text-secondary">
              <Heart className="w-4 h-4 fill-current" />
              <span className="text-sm">Making a difference since 2018</span>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-display font-semibold text-lg mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {currentYear} AGR Foundation. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
