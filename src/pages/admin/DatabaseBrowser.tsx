import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTableList, getTableData } from "@/lib/admin-api";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Database, Search, Download, ChevronLeft, ChevronRight, RefreshCw, TableIcon, Inbox, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TableInfo {
  name: string;
  rows: number;
  error?: string;
}

const tableGroups: Record<string, string[]> = {
  "Submissions": ["contact_submissions", "volunteer_submissions", "partner_submissions", "adopt_student_submissions", "report_challenge_submissions", "sanskrit_registrations", "dental_registrations", "event_registrations"],
  "Content": ["gallery_images", "events", "news_articles", "reels", "testimonials"],
  "System": ["admin_users", "donations", "site_settings"],
};

const formatTableName = (name: string) =>
  name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());

const DatabaseBrowser = () => {
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const result = await getTableList();
      setTables(result.data || []);
    } catch { toast.error("Failed to load tables"); }
    setLoading(false);
  };

  const fetchData = async (table: string, p = 1, s = "") => {
    setDataLoading(true);
    try {
      const result = await getTableData(table, p, 50, s);
      setData(result.data || []);
      setColumns(result.columns || []);
      setTotal(result.total || 0);
      setTotalPages(result.pages || 1);
    } catch { toast.error("Failed to load data"); }
    setDataLoading(false);
  };

  useEffect(() => { if (isAuthenticated) fetchTables(); }, [isAuthenticated]);

  useEffect(() => {
    if (selectedTable) {
      setPage(1);
      setSearch("");
      fetchData(selectedTable, 1, "");
    }
  }, [selectedTable]);

  const handleSearch = () => { setPage(1); fetchData(selectedTable, 1, search); };
  const handlePageChange = (newPage: number) => { setPage(newPage); fetchData(selectedTable, newPage, search); };

  const exportCSV = () => {
    if (!data.length || !columns.length) return;
    const rows = data.map(row => columns.map(col => {
      const val = row[col];
      return typeof val === "object" ? JSON.stringify(val) : String(val ?? "");
    }));
    const csv = [columns.join(","), ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${selectedTable}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const getTableInfo = (name: string) => tables.find(t => t.name === name);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Standalone header */}
      <header className="h-12 flex-shrink-0 border-b bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-primary" />
          <h1 className="font-semibold text-sm">AGR Database Browser</h1>
          <Badge variant="outline" className="text-[10px]">
            {tables.length} tables • {tables.reduce((s, t) => s + t.rows, 0)} rows
          </Badge>
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => window.close()}>
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Admin
        </Button>
      </header>

      {/* Two-panel layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left sidebar - table list */}
        <div className="w-60 flex-shrink-0 border-r bg-muted/30 overflow-y-auto">
          <div className="p-3 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Tables</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={fetchTables}>
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : (
            <div className="py-1">
              {Object.entries(tableGroups).map(([group, tableNames]) => {
                const available = tableNames.filter(n => tables.some(t => t.name === n && !t.error));
                if (!available.length) return null;
                return (
                  <div key={group} className="mb-1">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                      {group}
                    </div>
                    {available.map(name => {
                      const info = getTableInfo(name);
                      const active = selectedTable === name;
                      return (
                        <button
                          key={name}
                          onClick={() => setSelectedTable(name)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 text-left text-sm transition-colors",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted text-foreground"
                          )}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <TableIcon className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="truncate text-xs">{formatTableName(name)}</span>
                          </span>
                          <Badge
                            variant={active ? "outline" : "secondary"}
                            className={cn("text-[10px] h-5 min-w-[24px] justify-center", active && "border-primary-foreground/30 text-primary-foreground")}
                          >
                            {info?.rows ?? 0}
                          </Badge>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
              {/* Ungrouped */}
              {tables.filter(t => !Object.values(tableGroups).flat().includes(t.name) && !t.error).map(t => (
                <button
                  key={t.name}
                  onClick={() => setSelectedTable(t.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-left text-sm transition-colors",
                    selectedTable === t.name ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                >
                  <span className="flex items-center gap-2 truncate">
                    <TableIcon className="h-3.5 w-3.5" />
                    <span className="truncate text-xs">{formatTableName(t.name)}</span>
                  </span>
                  <Badge variant="secondary" className="text-[10px] h-5">{t.rows}</Badge>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right content - data view */}
        <div className="flex-1 overflow-y-auto min-w-0">
          {!selectedTable ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
              <Inbox className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm">Select a table from the sidebar</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Toolbar */}
              <div className="sticky top-0 z-10 bg-background border-b p-3 flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-sm flex items-center gap-2 mr-auto">
                  <Database className="h-4 w-4 text-primary" />
                  {formatTableName(selectedTable)}
                  <Badge variant="outline" className="text-xs">{total} rows</Badge>
                </h3>
                <div className="flex gap-1">
                  <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-40 h-8 text-sm"
                  />
                  <Button variant="outline" size="sm" className="h-8" onClick={handleSearch}>
                    <Search className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="h-8" onClick={exportCSV} disabled={!data.length}>
                  <Download className="h-3.5 w-3.5 mr-1" /> CSV
                </Button>
              </div>

              {/* Table data */}
              <div className="flex-1 overflow-auto">
                {dataLoading ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
                ) : data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                    <Inbox className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm">No data found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table className="min-w-max">
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          {columns.map(col => (
                            <TableHead key={col} className="whitespace-nowrap text-xs font-semibold h-9">
                              {col.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.map((row, i) => (
                          <TableRow key={i} className="hover:bg-muted/30">
                            {columns.map(col => (
                              <TableCell key={col} className="text-xs max-w-[250px] truncate whitespace-nowrap py-2">
                                {row[col] === null ? <span className="text-muted-foreground/50 italic">null</span> : String(row[col])}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="sticky bottom-0 bg-background border-t p-2 flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" className="h-7" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
                  <Button variant="outline" size="sm" className="h-7" disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseBrowser;
