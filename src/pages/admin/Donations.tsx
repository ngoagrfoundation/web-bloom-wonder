import { useEffect, useState } from "react";
import { getDonations } from "@/lib/admin-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Download, IndianRupee, Search, Inbox, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface Donation {
  id: number; razorpay_payment_id: string; donor_name: string; donor_email: string;
  donor_phone: string; amount: number; donation_type: string; pan_number: string;
  status: string; created_at: string;
}

const Donations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total_donations: 0, total_amount: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getDonations(page, 20, statusFilter, typeFilter, searchQuery, dateFrom, dateTo);
      setDonations(result.data || []);
      setTotalPages(result.pages || 1);
      setStats(result.stats || { total_donations: 0, total_amount: 0 });
    } catch { toast.error("Failed to load donations"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [page, statusFilter, typeFilter]);
  const handleSearch = () => { setPage(1); fetchData(); };

  const exportCSV = () => {
    if (!donations.length) return;
    const headers = ["ID", "Payment ID", "Name", "Email", "Phone", "Amount", "Type", "PAN", "Status", "Date"];
    const rows = donations.map(d => [d.id, d.razorpay_payment_id, d.donor_name, d.donor_email, d.donor_phone, d.amount, d.donation_type, d.pan_number, d.status, new Date(d.created_at).toLocaleDateString()]);
    const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = `donations_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-50"><CreditCard className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-xs text-muted-foreground">Total Donations</p><div className="text-2xl font-bold">{stats.total_donations}</div></div>
          </CardContent>
        </Card>
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-50"><IndianRupee className="h-5 w-5 text-amber-600" /></div>
            <div><p className="text-xs text-muted-foreground">Total Amount</p><div className="text-2xl font-bold">₹{Number(stats.total_amount).toLocaleString("en-IN")}</div></div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="py-3 flex flex-wrap gap-3 items-center">
          <Select value={statusFilter || "all"} onValueChange={(v) => { setStatusFilter(v === "all" ? "" : v); setPage(1); }}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter || "all"} onValueChange={(v) => { setTypeFilter(v === "all" ? "" : v); setPage(1); }}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="one-time">One-time</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="sponsorship">Sponsorship</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-1">
            <Input placeholder="Search donor..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="w-44 h-9" />
            <Button variant="outline" size="sm" className="h-9" onClick={handleSearch}><Search className="h-4 w-4" /></Button>
          </div>
          <div className="flex gap-1 items-center">
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 w-36" />
            <span className="text-xs text-muted-foreground">to</span>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9 w-36" />
          </div>
          <Button variant="outline" size="sm" className="h-9 ml-auto" onClick={exportCSV} disabled={!donations.length}>
            <Download className="h-4 w-4 mr-1" /> CSV
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
          ) : donations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
              <Inbox className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm">No donations recorded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="h-9">Payment ID</TableHead>
                    <TableHead className="h-9">Donor</TableHead>
                    <TableHead className="h-9">Amount</TableHead>
                    <TableHead className="h-9">Type</TableHead>
                    <TableHead className="h-9">Status</TableHead>
                    <TableHead className="h-9">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((d) => (
                    <TableRow key={d.id} className="hover:bg-muted/30">
                      <TableCell className="font-mono text-xs">{d.razorpay_payment_id?.slice(0, 16)}...</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{d.donor_name}</div>
                        <div className="text-xs text-muted-foreground">{d.donor_email}</div>
                      </TableCell>
                      <TableCell className="font-semibold">₹{Number(d.amount).toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-sm">{d.donation_type}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.status === "success" ? "bg-green-100 text-green-700" : d.status === "failed" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {d.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{new Date(d.created_at).toLocaleDateString("en-IN")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}
    </div>
  );
};

export default Donations;
