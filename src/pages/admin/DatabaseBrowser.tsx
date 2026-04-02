import { useEffect, useState } from "react";
import { getTableList, getTableData } from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Database, Search, Download, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";

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

const DatabaseBrowser = () => {
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
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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

  useEffect(() => { fetchTables(); }, []);

  useEffect(() => {
    if (selectedTable) {
      setPage(1);
      setSearch("");
      setDateFrom("");
      setDateTo("");
      fetchData(selectedTable, 1, "");
    }
  }, [selectedTable]);

  const handleSearch = () => {
    setPage(1);
    fetchData(selectedTable, 1, search);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchData(selectedTable, newPage, search);
  };

  const exportCSV = () => {
    if (!data.length || !columns.length) return;
    const rows = data.map(row => columns.map(col => {
      const val = row[col];
      return typeof val === "object" ? JSON.stringify(val) : String(val ?? "");
    }));
    const csv = [
      columns.join(","),
      ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTable}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTableName = (name: string) =>
    name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());

  const getTableInfo = (name: string) => tables.find(t => t.name === name);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {tables.length} tables • {tables.reduce((s, t) => s + t.rows, 0)} total rows
        </p>
        <Button variant="outline" size="sm" onClick={fetchTables}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Table selector dropdown */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground mb-1 block">Select Table</Label>
              <Select value={selectedTable} onValueChange={setSelectedTable}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loading ? "Loading tables..." : "Choose a table..."} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tableGroups).map(([group, tableNames]) => {
                    const availableTables = tableNames.filter(n => tables.some(t => t.name === n && !t.error));
                    if (!availableTables.length) return null;
                    return (
                      <SelectGroup key={group}>
                        <SelectLabel className="text-xs font-semibold uppercase text-muted-foreground">{group}</SelectLabel>
                        {availableTables.map(name => {
                          const info = getTableInfo(name);
                          return (
                            <SelectItem key={name} value={name}>
                              <span className="flex items-center gap-2">
                                <Database className="h-3 w-3 text-muted-foreground" />
                                {formatTableName(name)}
                                <Badge variant="secondary" className="text-xs ml-auto">{info?.rows ?? 0}</Badge>
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    );
                  })}
                  {/* Ungrouped tables */}
                  {tables.filter(t => !Object.values(tableGroups).flat().includes(t.name) && !t.error).map(t => (
                    <SelectItem key={t.name} value={t.name}>
                      <span className="flex items-center gap-2">
                        <Database className="h-3 w-3 text-muted-foreground" />
                        {formatTableName(t.name)}
                        <Badge variant="secondary" className="text-xs ml-auto">{t.rows}</Badge>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data view */}
      {selectedTable && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {formatTableName(selectedTable)}
                  <Badge variant="outline">{total} rows</Badge>
                </CardTitle>
                <Button variant="outline" size="sm" onClick={exportCSV} disabled={!data.length}>
                  <Download className="h-4 w-4 mr-1" /> CSV
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 items-end">
                <div className="flex gap-1">
                  <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-48 h-8"
                  />
                  <Button variant="outline" size="sm" onClick={handleSearch}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-1 items-center">
                  <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-8 w-36" />
                  <span className="text-xs text-muted-foreground">to</span>
                  <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-8 w-36" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {dataLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading...</div>
            ) : data.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No data found</div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-max">
                  <TableHeader>
                    <TableRow>
                      {columns.map(col => (
                        <TableHead key={col} className="whitespace-nowrap text-xs">
                          {col.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row, i) => (
                      <TableRow key={i}>
                        {columns.map(col => (
                          <TableCell key={col} className="text-xs max-w-[250px] truncate whitespace-nowrap">
                            {row[col] === null ? <span className="text-muted-foreground italic">null</span> : String(row[col])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedTable && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DatabaseBrowser;
