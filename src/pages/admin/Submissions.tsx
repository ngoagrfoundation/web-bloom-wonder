import { useEffect, useState } from "react";
import { getSubmissions, deleteSubmission } from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { toast } from "sonner";

const formTypes = [
  { value: "", label: "All Types" },
  { value: "contact", label: "Contact" },
  { value: "volunteer", label: "Volunteer" },
  { value: "partner", label: "Partner" },
  { value: "report_challenge", label: "Report Challenge" },
  { value: "adopt_student", label: "Adopt Student" },
  { value: "sanskrit_registration", label: "Sanskrit Registration" },
  { value: "dental_registration", label: "Dental Registration" },
];

interface Submission {
  id: number;
  form_type: string;
  data: Record<string, unknown>;
  ip_address: string;
  submitted_at: string;
}

const Submissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [formType, setFormType] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getSubmissions(page, 20, formType);
      setSubmissions(result.data || []);
      setTotalPages(result.pages || 1);
      setTotal(result.total || 0);
    } catch {
      toast.error("Failed to load submissions");
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [page, formType]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this submission?")) return;
    try {
      await deleteSubmission(id);
      toast.success("Submission deleted");
      fetchData();
    } catch { toast.error("Failed to delete"); }
  };

  const exportCSV = () => {
    if (!submissions.length) return;
    const allKeys = new Set<string>();
    submissions.forEach(s => {
      if (s.data) Object.keys(s.data).forEach(k => allKeys.add(k));
    });
    const headers = ["ID", "Type", "Date", ...allKeys];
    const rows = submissions.map(s => [
      s.id,
      s.form_type,
      new Date(s.submitted_at).toLocaleDateString(),
      ...Array.from(allKeys).map(k => {
        const val = s.data?.[k];
        return typeof val === "object" ? JSON.stringify(val) : String(val ?? "");
      }),
    ]);
    const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `submissions_${formType || "all"}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <Select value={formType} onValueChange={(v) => { setFormType(v); setPage(1); }}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {formTypes.map(t => <SelectItem key={t.value} value={t.value || "all"}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">{total} total</span>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV} disabled={!submissions.length}>
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : submissions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No submissions found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">{s.id}</TableCell>
                      <TableCell>
                        <span className="inline-block px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          {s.form_type}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="text-sm truncate">
                          {s.data?.name && <span className="font-medium">{String(s.data.name)}</span>}
                          {s.data?.email && <span className="text-muted-foreground ml-2">{String(s.data.email)}</span>}
                          {s.data?.phone && <span className="text-muted-foreground ml-2">{String(s.data.phone)}</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(s.submitted_at).toLocaleDateString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

export default Submissions;
