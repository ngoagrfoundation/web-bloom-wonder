import { useEffect, useState } from "react";
import { getSubmissions, deleteSubmission } from "@/lib/admin-api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, ChevronLeft, ChevronRight, Download, Eye, Search, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formTypes = [
  { value: "", label: "All Types" },
  { value: "contact", label: "Contact Us" },
  { value: "volunteer", label: "Volunteer" },
  { value: "partner", label: "Partner with Us" },
  { value: "adopt_student", label: "Adopt a Student" },
  { value: "report_challenge", label: "Report Challenge" },
  { value: "sanskrit_registration", label: "Sanskrit Registration" },
  { value: "dental_registration", label: "Dental Registration" },
  { value: "event_registration", label: "Event Registration" },
];

const columnLabels: Record<string, string> = {
  id: "ID", name: "Name", full_name: "Full Name", sponsor_name: "Sponsor Name",
  contact_person: "Contact Person", organization_name: "Organization", email: "Email",
  phone: "Phone", mobile: "Mobile", message: "Message", location: "Location",
  city: "City", initiatives: "Initiatives", availability: "Availability",
  experience: "Experience", organization_type: "Org Type", partnership_interest: "Interests",
  grade_level: "Grade Level", duration: "Duration", challenge_type: "Challenge Type",
  description: "Description", people_affected: "People Affected", address: "Address",
  age: "Age", batch: "Batch", problem: "Problem", ip_address: "IP Address",
  submitted_at: "Date", form_type: "Type", event_title: "Event",
  event_category: "Event Category", participants: "Participants",
  special_requirements: "Special Requirements",
};

const summaryColumns: Record<string, string[]> = {
  contact: ["id", "name", "email", "phone", "submitted_at"],
  volunteer: ["id", "full_name", "email", "phone", "location", "submitted_at"],
  partner: ["id", "organization_name", "contact_person", "email", "submitted_at"],
  adopt_student: ["id", "sponsor_name", "email", "phone", "city", "submitted_at"],
  report_challenge: ["id", "name", "phone", "location", "challenge_type", "submitted_at"],
  sanskrit_registration: ["id", "name", "mobile", "batch", "submitted_at"],
  dental_registration: ["id", "name", "mobile", "submitted_at"],
  event_registration: ["id", "event_title", "full_name", "email", "phone", "participants", "submitted_at"],
};

interface Submission { id: number; form_type: string; [key: string]: unknown; }

const Submissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [formType, setFormType] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailRow, setDetailRow] = useState<Submission | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getSubmissions(page, 20, formType, searchQuery, dateFrom, dateTo);
      setSubmissions(result.data || []);
      setTotalPages(result.pages || 1);
      setTotal(result.total || 0);
    } catch { toast.error("Failed to load submissions"); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [page, formType]);

  const handleSearch = () => { setPage(1); fetchData(); };

  const handleDelete = async (id: number, type: string) => {
    if (!confirm("Delete this submission?")) return;
    try { await deleteSubmission(id, type); toast.success("Submission deleted"); fetchData(); }
    catch { toast.error("Failed to delete"); }
  };

  const getVisibleColumns = (): string[] => {
    if (formType && summaryColumns[formType]) return summaryColumns[formType];
    return ["id", "form_type", "submitted_at"];
  };

  const formatValue = (key: string, value: unknown): string => {
    if (value === null || value === undefined) return "—";
    if (key === "submitted_at") return new Date(String(value)).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    return String(value);
  };

  const exportCSV = () => {
    if (!submissions.length) return;
    const allKeys = new Set<string>();
    submissions.forEach(s => Object.keys(s).forEach(k => allKeys.add(k)));
    const headers = Array.from(allKeys);
    const rows = submissions.map(s => headers.map(k => { const val = s[k]; return typeof val === "object" ? JSON.stringify(val) : String(val ?? ""); }));
    const csv = [headers.map(h => columnLabels[h] || h).join(","), ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `submissions_${formType || "all"}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const visibleCols = getVisibleColumns();
  const hiddenKeys = ["id", "ip_address", "form_type"];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="rounded-xl shadow-sm">
        <CardContent className="py-3">
          <div className="flex flex-wrap gap-3 items-center">
            <Select value={formType || "all"} onValueChange={(v) => { setFormType(v === "all" ? "" : v); setPage(1); }}>
              <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Filter by type" /></SelectTrigger>
              <SelectContent>
                {formTypes.map(t => <SelectItem key={t.value} value={t.value || "all"}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Input placeholder="Search name/email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="w-52 h-9" />
              <Button variant="outline" size="sm" className="h-9" onClick={handleSearch}><Search className="h-4 w-4" /></Button>
            </div>
            <div className="flex gap-1 items-center">
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 w-36" />
              <span className="text-xs text-muted-foreground">to</span>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9 w-36" />
              {(dateFrom || dateTo) && (
                <Button variant="ghost" size="sm" onClick={() => { setDateFrom(""); setDateTo(""); setPage(1); setTimeout(fetchData, 0); }} className="text-xs h-9">Clear</Button>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{total} total</span>
              <Button variant="outline" size="sm" className="h-9" onClick={exportCSV} disabled={!submissions.length}>
                <Download className="h-4 w-4 mr-1" /> CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
              <Inbox className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    {visibleCols.map(col => <TableHead key={col} className="text-xs font-semibold h-9">{columnLabels[col] || col}</TableHead>)}
                    <TableHead className="w-[90px] h-9">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((s) => (
                    <TableRow key={`${s.form_type}-${s.id}`} className="hover:bg-muted/30">
                      {visibleCols.map(col => (
                        <TableCell key={col} className={col === "id" ? "font-mono text-xs" : "text-sm"}>
                          {col === "form_type" ? (
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">
                              {formTypes.find(f => f.value === String(s.form_type))?.label || String(s.form_type)}
                            </span>
                          ) : (
                            <span className="truncate max-w-[200px] block">{formatValue(col, s[col])}</span>
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex gap-0.5">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailRow(s)} title="View"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(s.id, String(s.form_type))} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                        </div>
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
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}

      <Dialog open={!!detailRow} onOpenChange={(open) => !open && setDetailRow(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {detailRow && (formTypes.find(f => f.value === String(detailRow.form_type))?.label || String(detailRow.form_type))} — #{detailRow?.id}
            </DialogTitle>
          </DialogHeader>
          {detailRow && (
            <div className="space-y-3">
              {Object.entries(detailRow).filter(([key]) => !hiddenKeys.includes(key)).map(([key, value]) => (
                <div key={key} className="flex flex-col border-b border-border pb-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase">{columnLabels[key] || key.replace(/_/g, " ")}</span>
                  <span className="text-sm mt-0.5 whitespace-pre-wrap">{formatValue(key, value)}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Submissions;
