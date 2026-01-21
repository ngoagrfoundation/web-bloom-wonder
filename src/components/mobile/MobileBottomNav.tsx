import { Link, useLocation } from "react-router-dom";
import { Home, Heart, Images, Calendar, Phone, LucideIcon } from "lucide-react";

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  isHash?: boolean;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Calendar, label: "Events", href: "/events" },
  { icon: Heart, label: "Donate", href: "/donate" },
  { icon: Images, label: "Gallery", href: "/gallery" },
  { icon: Phone, label: "Contact", href: "/#contact", isHash: true },
];

const MobileBottomNav = () => {
  const location = useLocation();

  const isActive = (href: string, isHash?: boolean) => {
    if (isHash) {
      return location.pathname === "/" && location.hash === href.split("#")[1];
    }
    return location.pathname === href;
  };

  const handleHashClick = (href: string, e: React.MouseEvent) => {
    if (href.includes("#")) {
      e.preventDefault();
      const hash = href.split("#")[1];
      
      if (location.pathname !== "/") {
        window.location.href = href;
      } else {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isDonate = item.label === "Donate";
          const active = isActive(item.href, item.isHash);

          if (isDonate) {
            return (
              <Link
                key={item.label}
                to={item.href}
                className="flex flex-col items-center justify-center -mt-6"
              >
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Icon size={24} className="text-primary-foreground" />
                </div>
                <span className="text-[10px] font-medium text-primary mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return item.isHash ? (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleHashClick(item.href, e)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </a>
          ) : (
            <Link
              key={item.label}
              to={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;