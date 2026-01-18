import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

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

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Our Focus", dropdown: focusAreas },
    { label: "Programs", href: "/#programs" },
    { label: "Causes", dropdown: causes },
    { label: "Events", href: "/events" },
    { label: "News", href: "/news" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/#contact" },
  ];

  const toggleMobileDropdown = (label: string) => {
    setOpenMobileDropdown(openMobileDropdown === label ? null : label);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">A</span>
            </div>
            <span className="font-display font-semibold text-lg text-foreground">
              AGR Foundation
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) =>
              link.dropdown ? (
                <DropdownMenu key={link.label}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-foreground/80 hover:text-primary transition-colors font-medium text-sm outline-none">
                    {link.label}
                    <ChevronDown size={16} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="bg-popover border border-border shadow-lg min-w-[220px] z-[60]"
                    sideOffset={8}
                  >
                    {link.dropdown.map((item) => (
                      <DropdownMenuItem key={item.label} asChild>
                        <Link
                          to={item.href}
                          className="cursor-pointer px-4 py-2 hover:bg-accent"
                        >
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-foreground/80 hover:text-primary transition-colors font-medium text-sm"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Donate Button */}
          <Link
            to="/donate"
            className="hidden lg:inline-flex btn-secondary text-sm"
          >
            Donate Now
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border animate-fade-in max-h-[70vh] overflow-y-auto">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.label}>
                    <button
                      onClick={() => toggleMobileDropdown(link.label)}
                      className="flex items-center justify-between w-full py-2 text-foreground/80 hover:text-primary transition-colors font-medium"
                    >
                      {link.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          openMobileDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openMobileDropdown === link.label && (
                      <div className="pl-4 flex flex-col gap-2 mt-2 animate-fade-in">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.label}
                            to={item.href}
                            className="py-2 text-muted-foreground hover:text-primary transition-colors text-sm"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="py-2 text-foreground/80 hover:text-primary transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Link
                to="/donate"
                className="btn-secondary text-center mt-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Donate Now
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
