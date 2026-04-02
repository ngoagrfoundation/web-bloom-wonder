import { useEffect, useState } from "react";
import { getTableList, getTableData } from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Database, Search, Download, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface TableInfo {
  name: string;
  rows: number;
  error?: string;
}

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

      {/* Table selector */}
      <div className="flex flex-wrap gap-2">
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading tables...</p>
        ) : (
          tables.map((t) => (
            <Button
              key={t.name}
              variant={selectedTable === t.name ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTable(t.name)}
              className="gap-2"
              disabled={!!t.error}
            >
              <Database className="h-3 w-3" />
              {formatTableName(t.name)}
              <Badge variant="secondary" className="ml-1 text-xs">{t.rows}</Badge>
            </Button>
          ))
        )}
      </div>

      {/* Data view */}
      {selectedTable && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5" />
                {formatTableName(selectedTable)}
                <Badge variant="outline">{total} rows</Badge>
              </CardTitle>
              <div className="flex gap-2">
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
                <Button variant="outline" size="sm" onClick={exportCSV} disabled={!data.length}>
                  <Download className="h-4 w-4 mr-1" /> CSV
                </Button>
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
                <Table>
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
                          <TableCell key={col} className="text-xs max-w-[200px] truncate">
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