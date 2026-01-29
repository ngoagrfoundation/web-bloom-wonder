import { Heart } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import agrLogo from "@/assets/agr-logo.svg";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (href.includes('#')) {
      e.preventDefault();
      const hash = href.split('#')[1];
      
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/#about" },
        { label: "Our Programs", href: "/#programs" },
        { label: "Get Involved", href: "/#get-involved" },
      ],
    },
    {
      title: "Programs",
      links: [
        { label: "Education", href: "/#programs" },
        { label: "Healthcare", href: "/#programs" },
        { label: "Livelihood", href: "/#programs" },
        { label: "Community Development", href: "/#programs" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "/#contact" },
        { label: "Donate", href: "/donate" },
        { label: "Volunteer", href: "/#get-involved" },
        { label: "Partner With Us", href: "/#get-involved" },
      ],
    },
  ];

  return (
    <footer id="donate" className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div>
            <div className="mb-5">
              <img 
                src={agrLogo} 
                alt="AGR Foundation" 
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-background/70 text-sm leading-relaxed mb-6">
              Dedicated to building sustainable communities through education, 
              healthcare, and livelihood programs across rural India.
            </p>
            <div className="flex items-center gap-2 text-secondary text-sm">
              <Heart className="w-4 h-4 fill-current" />
              <span>Making a difference since 2018</span>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-display font-semibold text-base mb-5">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.includes('#') ? (
                      <a
                        href={link.href}
                        onClick={(e) => handleLinkClick(link.href, e)}
                        className="text-background/60 hover:text-background transition-colors text-sm cursor-pointer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-background/60 hover:text-background transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/50 text-sm">
              © {currentYear} AGR Foundation. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                className="text-background/50 hover:text-background transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-background/50 hover:text-background transition-colors"
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
