import { useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Submissions", path: "/admin/submissions", icon: FileText },
  { title: "Donations", path: "/admin/donations", icon: CreditCard },
  { title: "Gallery", path: "/admin/gallery", icon: Image },
  { title: "Events", path: "/admin/events", icon: CalendarDays },
  { title: "News", path: "/admin/news", icon: Newspaper },
  { title: "Reels", path: "/admin/reels", icon: Film },
  { title: "Testimonials", path: "/admin/testimonials", icon: MessageSquareQuote },
  { title: "Database", path: "/admin/database", icon: Database },
  { title: "Site Settings", path: "/admin/settings", icon: Settings },
];

const AdminLayout = () => {
  const { isAuthenticated, isLoading, username, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/admin");
    }
  }, [isLoading, isAuthenticated, navigate]);

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

  return (
    <div className="h-screen flex overflow-hidden bg-muted/20">
      {/* Sidebar - independently scrollable */}
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
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
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

      {/* Main content - independently scrollable */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex-shrink-0 bg-background border-b px-4 py-3 flex items-center gap-4 lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            {navItems.find((i) => i.path === location.pathname)?.title || "Admin"}
          </h1>
          <span className="ml-auto text-xs text-muted-foreground hidden sm:block">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
