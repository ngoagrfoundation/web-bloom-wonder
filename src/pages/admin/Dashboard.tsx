import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats, changeAdminPassword } from "@/lib/admin-api";
import { FileText, CreditCard, IndianRupee, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Dashboard = () => {
  const [stats, setStats] = useState({ totalSubmissions: 0, totalDonations: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  useEffect(() => {
    getDashboardStats().then((s) => { setStats(s); setLoading(false); });
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords don't match");
      return;
    }
    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    try {
      const result = await changeAdminPassword(passwords.current, passwords.new);
      if (result.error) { toast.error(result.error); return; }
      toast.success("Password changed successfully");
      setPasswords({ current: "", new: "", confirm: "" });
      setShowPasswordForm(false);
    } catch { toast.error("Failed to change password"); }
  };

  const statCards = [
    { title: "Total Submissions", value: stats.totalSubmissions, icon: FileText, color: "text-blue-600" },
    { title: "Total Donations", value: stats.totalDonations, icon: CreditCard, color: "text-green-600" },
    { title: "Total Amount", value: `₹${stats.totalAmount.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Quick Info</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• <strong>Submissions</strong>: View all form entries (contact, volunteer, partner, registrations)</p>
          <p>• <strong>Donations</strong>: Track all Razorpay payment records</p>
          <p>• <strong>Gallery</strong>: Upload, edit, and delete gallery photos</p>
          <p>• <strong>Events</strong>: Create and manage events shown on the website</p>
          <p className="pt-2 text-xs">Data is stored in your cPanel MySQL database. All form submissions are also saved to Google Sheets as backup.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
