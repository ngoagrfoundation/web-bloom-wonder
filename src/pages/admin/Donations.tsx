import { useEffect, useState } from "react";
import { getDonations } from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Download, IndianRupee } from "lucide-react";
import { toast } from "sonner";

interface Donation {
  id: number;
  razorpay_payment_id: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  amount: number;
  donation_type: string;
  pan_number: string;
  status: string;
  created_at: string;
}

const Donations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total_donations: 0, total_amount: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getDonations(page, 20);
      setDonations(result.data || []);
      setTotalPages(result.pages || 1);
      setStats(result.stats || { total_donations: 0, total_amount: 0 });
    } catch {
      toast.error("Failed to load donations");
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [page]);

  const exportCSV = () => {
    if (!donations.length) return;
    const headers = ["ID", "Payment ID", "Name", "Email", "Phone", "Amount", "Type", "PAN", "Status", "Date"];
    const rows = donations.map(d => [d.id, d.razorpay_payment_id, d.donor_name, d.donor_email, d.donor_phone, d.amount, d.donation_type, d.pan_number, d.status, new Date(d.created_at).toLocaleDateString()]);
    const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `donations_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Donations</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total_donations}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-1"><IndianRupee className="h-4 w-4" /> Total Amount</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">₹{Number(stats.total_amount).toLocaleString("en-IN")}</div></CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={exportCSV} disabled={!donations.length}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : donations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No donations recorded yet</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Donor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {donations.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-mono text-xs">{d.razorpay_payment_id?.slice(0, 16)}...</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{d.donor_name}</div>
                        <div className="text-xs text-muted-foreground">{d.donor_email}</div>
                      </TableCell>
                      <TableCell className="font-semibold">₹{Number(d.amount).toLocaleString("en-IN")}</TableCell>
                      <TableCell className="text-sm">{d.donation_type}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${d.status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {d.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(d.created_at).toLocaleDateString("en-IN")}
                      </TableCell>
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
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Donations;
