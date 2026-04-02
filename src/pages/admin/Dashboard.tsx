import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats, getRecentActivity, changeAdminPassword, getSubmissionTrends, getDonationTrends, seedStaticGallery, seedStaticNews } from "@/lib/admin-api";
import {
  FileText, CreditCard, IndianRupee, KeyRound, Image, CalendarDays,
  Newspaper, Plus, Upload, PenLine, Eye, TrendingUp, Clock,
  Database, Users, CheckCircle, Server, Film, MessageSquareQuote, Settings,
  Sprout, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { username } = useAdminAuth();
  const [stats, setStats] = useState({
    totalSubmissions: 0, totalDonations: 0, totalAmount: 0,
    totalGallery: 0, totalEvents: 0, totalNews: 0,
    totalReels: 0, totalTestimonials: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [submissionTrends, setSubmissionTrends] = useState<{ date: string; count: number }[]>([]);
  const [donationTrends, setDonationTrends] = useState<{ month: string; total: number; count: number }[]>([]);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    Promise.all([
      getDashboardStats().then(setStats),
      getRecentActivity().then(setRecentActivity),
      getSubmissionTrends().then(setSubmissionTrends),
      getDonationTrends().then(setDonationTrends),
    ]).finally(() => setLoading(false));
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) { toast.error("Passwords don't match"); return; }
    if (passwords.new.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    try {
      const result = await changeAdminPassword(passwords.current, passwords.new);
      if (result.error) { toast.error(result.error); return; }
      toast.success("Password changed successfully");
      setPasswords({ current: "", new: "", confirm: "" });
      setShowPasswordForm(false);
    } catch { toast.error("Failed to change password"); }
  };

  const handleSeedContent = async () => {
    setSeeding(true);
    try {
      const [galleryRes, newsRes] = await Promise.all([seedStaticGallery(), seedStaticNews()]);
      const msgs: string[] = [];
      if (galleryRes.inserted) msgs.push(`${galleryRes.inserted} gallery images`);
      if (newsRes.inserted) msgs.push(`${newsRes.inserted} news articles`);
      if (msgs.length) toast.success(`Seeded: ${msgs.join(", ")}`);
      else toast.info("Content already exists or no static data to seed");
      getDashboardStats().then(setStats);
    } catch { toast.error("Failed to seed content"); }
    setSeeding(false);
  };

  const statCards = [
    { title: "Submissions", value: stats.totalSubmissions, icon: FileText, color: "text-blue-600", bg: "bg-blue-50", path: "/admin/submissions" },
    { title: "Donations", value: stats.totalDonations, icon: CreditCard, color: "text-green-600", bg: "bg-green-50", path: "/admin/donations" },
    { title: "Total Amount", value: `₹${stats.totalAmount.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-amber-600", bg: "bg-amber-50", path: "/admin/donations" },
    { title: "Gallery", value: stats.totalGallery, icon: Image, color: "text-purple-600", bg: "bg-purple-50", path: "/admin/gallery" },
    { title: "Events", value: stats.totalEvents, icon: CalendarDays, color: "text-rose-600", bg: "bg-rose-50", path: "/admin/events" },
    { title: "News", value: stats.totalNews, icon: Newspaper, color: "text-cyan-600", bg: "bg-cyan-50", path: "/admin/news" },
    { title: "Reels", value: stats.totalReels, icon: Film, color: "text-orange-600", bg: "bg-orange-50", path: "/admin/reels" },
    { title: "Testimonials", value: stats.totalTestimonials, icon: MessageSquareQuote, color: "text-indigo-600", bg: "bg-indigo-50", path: "/admin/testimonials" },
  ];

  const quickActions = [
    { title: "Add Event", icon: Plus, path: "/admin/events", color: "text-rose-600" },
    { title: "Upload Photo", icon: Upload, path: "/admin/gallery", color: "text-purple-600" },
    { title: "Write Article", icon: PenLine, path: "/admin/news", color: "text-cyan-600" },
    { title: "Add Reel", icon: Film, path: "/admin/reels", color: "text-orange-600" },
    { title: "View Donations", icon: Eye, path: "/admin/donations", color: "text-green-600" },
    { title: "Browse Database", icon: Database, path: "/admin/database", color: "text-amber-600" },
    { title: "View Submissions", icon: Users, path: "/admin/submissions", color: "text-blue-600" },
    { title: "Site Settings", icon: Settings, path: "/admin/settings", color: "text-gray-600" },
  ];

  const formTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      contact: "bg-blue-100 text-blue-800", volunteer: "bg-green-100 text-green-800",
      partner: "bg-purple-100 text-purple-800", adopt_student: "bg-amber-100 text-amber-800",
      report_challenge: "bg-red-100 text-red-800", event_registration: "bg-rose-100 text-rose-800",
      sanskrit_registration: "bg-indigo-100 text-indigo-800", dental_registration: "bg-teal-100 text-teal-800",
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };

  const formatChartDate = (date: string) => { const d = new Date(date); return `${d.getDate()}/${d.getMonth() + 1}`; };
  const formatChartMonth = (month: string) => { const [y, m] = month.split("-"); const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return `${months[parseInt(m)-1]} ${y.slice(2)}`; };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-secondary p-6 text-primary-foreground">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">Welcome back, {username || "Admin"}!</h1>
          <p className="text-primary-foreground/80 mt-1">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="absolute right-6 top-4 opacity-10">
          <LayoutDashboardIcon className="w-32 h-32" />
        </div>
      </div>

      {/* System Status */}
      <Card className="border-green-200 bg-green-50/50 rounded-xl shadow-sm">
        <CardContent className="py-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-sm text-green-800">All systems operational</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1 text-xs"><Server className="h-3 w-3" /> PHP + MySQL</Badge>
              <Badge variant="outline" className="gap-1 text-xs"><Database className="h-3 w-3" /> agrfound_maindb</Badge>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={handleSeedContent} disabled={seeding}>
                {seeding ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sprout className="h-3 w-3" />}
                Seed Static Content
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.path}>
            <Card className="relative overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:-translate-y-0.5">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`inline-flex p-2.5 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <TrendingUp className="h-4 w-4 text-muted-foreground/40" />
                </div>
                {loading ? (
                  <Skeleton className="h-8 w-20 mb-1" />
                ) : (
                  <div className="text-2xl font-bold">{stat.value}</div>
                )}
                <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" /> Submission Trends (30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submissionTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={submissionTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tickFormatter={formatChartDate} tick={{ fontSize: 11 }} interval={4} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString("en-IN")} />
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={2} name="Submissions" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">No data yet</div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-green-600" /> Donation Growth (12 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {donationTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={donationTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tickFormatter={formatChartMonth} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Amount"]} labelFormatter={formatChartMonth} />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Amount" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">No data yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-muted-foreground" /> Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-0.5">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      <Badge variant="secondary" className={`${formTypeBadge(item.form_type as string)} text-xs`}>
                        {(item.form_type as string || "unknown").replace(/_/g, " ")}
                      </Badge>
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {(item.name as string) || (item.full_name as string) || (item.contact_person as string) || "Anonymous"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.submitted_at ? new Date(item.submitted_at as string).toLocaleDateString() : ""}
                    </span>
                  </div>
                ))}
                <Link to="/admin/submissions" className="text-sm text-primary hover:underline block mt-3 pl-3">
                  View all submissions →
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">No recent submissions yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.path}>
                <div className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:bg-muted/50 hover:shadow-sm transition-all cursor-pointer text-center">
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                  <span className="text-xs font-medium">{action.title}</span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Security */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base"><KeyRound className="h-4 w-4" /> Account Security</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowPasswordForm(!showPasswordForm)}>
              {showPasswordForm ? "Cancel" : "Change Password"}
            </Button>
          </div>
        </CardHeader>
        {showPasswordForm && (
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div className="space-y-2"><Label>Current Password</Label><Input type="password" value={passwords.current} onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))} required /></div>
              <div className="space-y-2"><Label>New Password</Label><Input type="password" value={passwords.new} onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))} required /></div>
              <div className="space-y-2"><Label>Confirm New Password</Label><Input type="password" value={passwords.confirm} onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))} required /></div>
              <Button type="submit">Update Password</Button>
            </form>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

const LayoutDashboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

export default Dashboard;
