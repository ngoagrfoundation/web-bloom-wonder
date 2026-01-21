import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import agrLogo from "@/assets/agr-logo.svg";

const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const focusAreas = [
    { label: "Women's Empowerment", href: "/focus/womens-empowerment" },
    { label: "Environmental Safety", href: "/focus/environmental-safety" },
    { label: "Skill Development", href: "/focus/skill-development" },
    { label: "Rural Development", href: "/focus/rural-development" },
    { label: "Social Welfare", href: "/focus/social-welfare" },
  ];

  const causes = [
    { label: "Cleaning the Lake at Temple", href: "/causes/lake-cleaning" },
    { label: "Treatment of Physically Challenged Student", href: "/causes/physically-challenged-treatment" },
    { label: "Water Filter at a School", href: "/causes/water-filter-school" },
    { label: "Wheelchair for a Student", href: "/causes/wheelchair-student" },
    { label: "Wheelchair for an Elderly Person", href: "/causes/wheelchair-elderly" },
  ];

  const programs = [
    { label: "Education", href: "/programs/education" },
    { label: "Healthcare", href: "/programs/healthcare" },
    { label: "Livelihood", href: "/programs/livelihood" },
  ];

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Our Focus", dropdown: focusAreas },
    { label: "Programs", dropdown: programs },
    { label: "Causes", dropdown: causes },
    { label: "Events", href: "/events" },
    { label: "News", href: "/news" },
    { label: "Gallery", href: "/gallery" },
  ];

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleNavClick = (href: string, e: React.MouseEvent) => {
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
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
          <img 
            src={agrLogo} 
            alt="AGR Foundation" 
            className="h-10 w-auto"
          />
        </Link>

        {/* Menu Button */}
        <button
          className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <nav className="absolute top-14 left-0 right-0 bg-background border-b border-border shadow-lg max-h-[calc(100vh-56px-64px)] overflow-y-auto animate-fade-in">
          <div className="flex flex-col p-4">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label}>
                  <button
                    onClick={() => toggleDropdown(link.label)}
                    className="flex items-center justify-between w-full py-3 px-2 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
                  >
                    {link.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform text-muted-foreground ${
                        openDropdown === link.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === link.label && (
                    <div className="pl-4 flex flex-col gap-1 mt-1 animate-fade-in">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          className="py-2.5 px-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors text-sm"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : link.href.includes('#') ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(link.href, e)}
                  className="py-3 px-2 text-foreground hover:bg-muted rounded-lg transition-colors font-medium cursor-pointer"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="py-3 px-2 text-foreground hover:bg-muted rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default MobileHeader;