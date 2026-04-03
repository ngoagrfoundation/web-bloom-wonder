import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Image,
  CalendarDays,
  Newspaper,
  Database,
  LogOut,
  Menu,
  X,
  Film,
  MessageSquareQuote,
  Settings,
  ExternalLink,
  Sliders,
  Handshake,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSubmissionCounts } from "@/lib/admin-api";

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const AdminLayout = () => {
  const { isAuthenticated, isLoading, username, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/admin");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      getSubmissionCounts().then((counts) => {
        const total = Object.values(counts).reduce((a: number, b: unknown) => a + Number(b || 0), 0);
        setSubmissionCount(total);
      });
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/admin");
  };

  const navGroups: NavGroup[] = [
    {
      label: "Overview",
      items: [
        { title: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: "Content Management",
      items: [
        { title: "Gallery", path: "/admin/gallery", icon: Image },
        { title: "Reels", path: "/admin/reels", icon: Film },
        { title: "News", path: "/admin/news", icon: Newspaper },
        { title: "Events", path: "/admin/events", icon: CalendarDays },
        { title: "Testimonials", path: "/admin/testimonials", icon: MessageSquareQuote },
        { title: "Partners", path: "/admin/partners", icon: Handshake },
        { title: "Sponsors", path: "/admin/sponsors", icon: Heart },
      ],
    },
    {
      label: "User Interactions",
      items: [
        { title: "Submissions", path: "/admin/submissions", icon: FileText, badge: submissionCount || undefined },
        { title: "Donations", path: "/admin/donations", icon: CreditCard },
      ],
    },
    {
      label: "Website Control",
      items: [
        { title: "Landing Page", path: "/admin/landing-page", icon: Sliders },
        { title: "Site Settings", path: "/admin/settings", icon: Settings },
      ],
    },
  ];

  const currentTitle = navGroups.flatMap(g => g.items).find(i => i.path === location.pathname)?.title || "Admin";

  return (
    <div className="h-screen flex overflow-hidden bg-muted/20">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r flex flex-col transform transition-transform duration-200 lg:translate-x-0 lg:static lg:flex-shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="font-bold text-lg">AGR Admin</h2>
            <p className="text-xs text-muted-foreground">Welcome, {username}</p>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-3 mb-1">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      location.pathname === item.path
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="flex-1">{item.title}</span>
                    {item.badge ? (
                      <Badge variant="secondary" className="h-5 min-w-[20px] text-[10px] px-1.5">
                        {item.badge}
                      </Badge>
                    ) : null}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-4 border-t space-y-2 flex-shrink-0">
          <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground">
            ← Back to Website
          </Link>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 bg-background border-b px-4 py-3 flex items-center gap-4 lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">{currentTitle}</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => window.open("/admin/database", "_blank")}
            >
              <Database className="h-3.5 w-3.5" />
              Database
              <ExternalLink className="h-3 w-3" />
            </Button>
            <span className="text-xs text-muted-foreground hidden sm:block">
              {new Date().toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
