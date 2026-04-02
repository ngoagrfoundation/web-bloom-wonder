import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats, getRecentActivity, changeAdminPassword } from "@/lib/admin-api";
import {
  FileText, CreditCard, IndianRupee, KeyRound, Image, CalendarDays,
  Newspaper, Plus, Upload, PenLine, Eye, TrendingUp, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSubmissions: 0, totalDonations: 0, totalAmount: 0,
    totalGallery: 0, totalEvents: 0, totalNews: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  useEffect(() => {
    Promise.all([
      getDashboardStats().then(setStats),
      getRecentActivity().then(setRecentActivity),
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

  const statCards = [
    { title: "Submissions", value: stats.totalSubmissions, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Donations", value: stats.totalDonations, icon: CreditCard, color: "text-green-600", bg: "bg-green-50" },
    { title: "Total Amount", value: `₹${stats.totalAmount.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Gallery Photos", value: stats.totalGallery, icon: Image, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Events", value: stats.totalEvents, icon: CalendarDays, color: "text-rose-600", bg: "bg-rose-50" },
    { title: "News Articles", value: stats.totalNews, icon: Newspaper, color: "text-cyan-600", bg: "bg-cyan-50" },
  ];

  const quickActions = [
    { title: "Add Event", icon: Plus, path: "/admin/events", color: "text-rose-600" },
    { title: "Upload Photo", icon: Upload, path: "/admin/gallery", color: "text-purple-600" },
    { title: "Write Article", icon: PenLine, path: "/admin/news", color: "text-cyan-600" },
    { title: "View Donations", icon: Eye, path: "/admin/donations", color: "text-green-600" },
  ];

  const formTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      contact: "bg-blue-100 text-blue-800",
      volunteer: "bg-green-100 text-green-800",
      partner: "bg-purple-100 text-purple-800",
      adopt_student: "bg-amber-100 text-amber-800",
      report_challenge: "bg-red-100 text-red-800",
    };
    return colors[type] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-3`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className={formTypeBadge(item.form_type as string)}>
                        {(item.form_type as string || 'unknown').replace('_', ' ')}
                      </Badge>
                      <span className="text-sm font-medium truncate max-w-[200px]">
                        {(item.name as string) || (item.full_name as string) || (item.contact_person as string) || 'Anonymous'}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.submitted_at ? new Date(item.submitted_at as string).toLocaleDateString() : ''}
                    </span>
                  </div>
                ))}
                <Link to="/admin/submissions" className="text-sm text-primary hover:underline block mt-2">
                  View all submissions →
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4">No recent submissions yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.path}>
                <Button variant="outline" className="w-full justify-start gap-3 h-12">
                  <action.icon className={`h-4 w-4 ${action.color}`} />
                  {action.title}
                </Button>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" /> Account Security
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setShowPasswordForm(!showPasswordForm)}>
              {showPasswordForm ? "Cancel" : "Change Password"}
            </Button>
          </div>
        </CardHeader>
        {showPasswordForm && (
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" value={passwords.current} onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" value={passwords.new} onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))} required />
              </div>
              <Button type="submit">Update Password</Button>
            </form>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
