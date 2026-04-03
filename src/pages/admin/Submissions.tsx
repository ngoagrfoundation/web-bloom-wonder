import { useEffect, useMemo, useState } from "react";
import { deleteSubmission, getSubmissions } from "@/lib/admin-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Eye, Inbox, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

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

const rowOptions = ["25", "50", "100", "200"];

const columnLabels: Record<string, string> = {
  id: "ID",
  form_type: "Type",
  submitter: "Submitter",
  summary: "Summary",
  name: "Name",
  full_name: "Full Name",
  sponsor_name: "Sponsor Name",
  contact_person: "Contact Person",
  organization_name: "Organization",
  email: "Email",
  phone: "Phone",
  mobile: "Mobile",
  location: "Location",
  city: "City",
  message: "Message",
  initiatives: "Initiatives",
  availability: "Availability",
  experience: "Experience",
  organization_type: "Org Type",
  partnership_interest: "Interests",
  grade_level: "Grade Level",
  duration: "Duration",
  challenge_type: "Challenge Type",
  description: "Description",
  people_affected: "People Affected",
  address: "Address",
  age: "Age",
  batch: "Batch",
  problem: "Problem",
  event_title: "Event",
  event_category: "Category",
  participants: "Participants",
  special_requirements: "Special Requirements",
  submitted_at: "Submitted",
};

const summaryColumns: Record<string, string[]> = {
  all: ["id", "form_type", "submitter", "email", "phone", "location", "summary", "submitted_at"],
  contact: ["id", "name", "email", "phone", "message", "submitted_at"],
  volunteer: ["id", "full_name", "email", "phone", "location", "initiatives", "availability", "experience", "submitted_at"],
  partner: ["id", "organization_name", "contact_person", "email", "phone", "organization_type", "partnership_interest", "message", "submitted_at"],
  adopt_student: ["id", "sponsor_name", "email", "phone", "city", "grade_level", "duration", "message", "submitted_at"],
  report_challenge: ["id", "name", "phone", "email", "location", "challenge_type", "people_affected", "description", "submitted_at"],
  sanskrit_registration: ["id", "name", "mobile", "address", "age", "batch", "submitted_at"],
  dental_registration: ["id", "name", "mobile", "address", "problem", "submitted_at"],
  event_registration: ["id", "event_title", "event_category", "full_name", "email", "phone", "participants", "special_requirements", "submitted_at"],
};

interface Submission {
  id: number;
  form_type: string;
  [key: string]: unknown;
}

const hiddenDetailKeys = ["ip_address", "status"];

const getRowKey = (submission: Submission) => `${submission.form_type}-${submission.id}`;

const getTypeLabel = (formType: string) => {
  return formTypes.find((item) => item.value === formType)?.label || formType;
};

const getSubmitter = (submission: Submission) => {
  return String(
    submission.full_name ||
      submission.name ||
      submission.sponsor_name ||
      submission.contact_person ||
      submission.organization_name ||
      "-",
  );
};

const getLocation = (submission: Submission) => {
  return String(submission.location || submission.city || submission.address || "-");
};

const getSummary = (submission: Submission) => {
  return String(
    submission.message ||
      submission.description ||
      submission.problem ||
      submission.partnership_interest ||
      submission.special_requirements ||
      submission.initiatives ||
      submission.availability ||
      "-",
  );
};

const formatValue = (key: string, value: unknown, submission?: Submission): string => {
  if (key === "submitter" && submission) return getSubmitter(submission);
  if (key === "location" && submission) return getLocation(submission);
  if (key === "summary" && submission) return getSummary(submission);
  if (key === "form_type" && submission) return getTypeLabel(submission.form_type);
  if (Array.isArray(value)) return value.join(", ");
  if (value === null || value === undefined || value === "") return "-";

  if (key === "submitted_at") {
    return new Date(String(value)).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return String(value);
};

const getVisibleColumns = (formType: string) => {
  return summaryColumns[formType || "all"] || summaryColumns.all;
};

const getPageNumbers = (page: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) pages.push(-1);
  for (let current = start; current <= end; current += 1) pages.push(current);
  if (end < totalPages - 1) pages.push(-2);

  pages.push(totalPages);
  return pages;
};

const getColumnCellClassName = (column: string) => {
  if (["message", "description", "summary", "special_requirements", "experience"].includes(column)) {
    return "min-w-[260px]";
  }

  if (["form_type", "organization_type", "challenge_type", "grade_level"].includes(column)) {
    return "min-w-[160px]";
  }

  return "min-w-[140px]";
};

const Submissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [formType, setFormType] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailRow, setDetailRow] = useState<Submission | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const visibleColumns = useMemo(() => getVisibleColumns(formType), [formType]);
  const activeFilterCount = useMemo(
    () => [formType, searchQuery, dateFrom, dateTo].filter(Boolean).length,
    [dateFrom, dateTo, formType, searchQuery],
  );
  const selectedRows = useMemo(
    () => submissions.filter((submission) => selectedKeys.includes(getRowKey(submission))),
    [selectedKeys, submissions],
  );
  const allSelectedOnPage = submissions.length > 0 && selectedRows.length === submissions.length;

  const fetchData = async (
    nextPage = page,
    nextPageSize = pageSize,
    nextFormType = formType,
    nextSearch = searchQuery,
    nextDateFrom = dateFrom,
    nextDateTo = dateTo,
  ) => {
    setLoading(true);

    try {
      const result = await getSubmissions(nextPage, nextPageSize, nextFormType, nextSearch, nextDateFrom, nextDateTo, "");
      setSubmissions(result.data || []);
      setTotalPages(result.pages || 1);
      setTotal(result.total || 0);
      setSelectedKeys([]);
    } catch {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, [page, formType, pageSize]);

  const handleSearch = () => {
    setPage(1);
    void fetchData(1, pageSize, formType, searchQuery, dateFrom, dateTo);
  };

  const handleClearDates = () => {
    setDateFrom("");
    setDateTo("");
    setPage(1);
    void fetchData(1, pageSize, formType, searchQuery, "", "");
  };

  const toggleSelection = (rowKey: string, checked: boolean) => {
    setSelectedKeys((prev) => (
      checked ? [...prev, rowKey] : prev.filter((key) => key !== rowKey)
    ));
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedKeys(checked ? submissions.map(getRowKey) : []);
  };

  const handleDeleteSingle = async (submission: Submission) => {
    if (!confirm("Delete this submission?")) return;

    try {
      await deleteSubmission(submission.id, submission.form_type);
      toast.success("Submission deleted");
      await fetchData();
    } catch {
      toast.error("Failed to delete submission");
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedRows.length) return;
    if (!confirm(`Delete ${selectedRows.length} selected submissions?`)) return;

    setIsDeleting(true);

    try {
      const results = await Promise.allSettled(
        selectedRows.map((row) => deleteSubmission(row.id, row.form_type)),
      );
      const failedCount = results.filter((result) => result.status === "rejected").length;
      const deletedCount = results.length - failedCount;

      if (deletedCount) {
        toast.success(`${deletedCount} submissions deleted`);
      }

      if (failedCount) {
        toast.error(`${failedCount} submissions could not be deleted`);
      }

      await fetchData();
    } catch {
      toast.error("Failed to delete selected submissions");
    } finally {
      setIsDeleting(false);
    }
  };

  const exportCSV = () => {
    if (!submissions.length) return;

    const headers = visibleColumns;
    const rows = submissions.map((submission) =>
      headers.map((column) => formatValue(column, submission[column], submission)),
    );

    const csv = [
      headers.map((header) => columnLabels[header] || header).join(","),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `submissions_${formType || "all"}_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const paginationPages = getPageNumbers(page, totalPages);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="rounded-xl border border-border/70 shadow-sm">
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Total</p>
            <p className="text-2xl font-semibold text-foreground">{total}</p>
            <p className="text-sm text-muted-foreground">Submissions in current result set</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border/70 shadow-sm">
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Selected</p>
            <p className="text-2xl font-semibold text-foreground">{selectedRows.length}</p>
            <p className="text-sm text-muted-foreground">Ready for bulk delete</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border/70 shadow-sm">
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Page</p>
            <p className="text-2xl font-semibold text-foreground">{page} / {Math.max(totalPages, 1)}</p>
            <p className="text-sm text-muted-foreground">{pageSize} rows per page</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border/70 shadow-sm">
          <CardContent className="space-y-1 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Filters</p>
            <p className="text-2xl font-semibold text-foreground">{activeFilterCount}</p>
            <p className="text-sm text-muted-foreground">{formType ? getTypeLabel(formType) : "All form types"}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={formType || "all"}
              onValueChange={(value) => {
                const nextFormType = value === "all" ? "" : value;
                setFormType(nextFormType);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-[190px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {formTypes.map((type) => (
                  <SelectItem key={type.value || "all"} value={type.value || "all"}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Input
                placeholder="Search submissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="h-9 w-60"
              />
              <Button variant="outline" size="sm" className="h-9" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-9 w-36"
              />
              <span className="text-xs text-muted-foreground">to</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-9 w-36"
              />
              <Button variant="outline" size="sm" className="h-9" onClick={handleSearch}>
                Apply
              </Button>
              {(dateFrom || dateTo) && (
                <Button variant="ghost" size="sm" className="h-9" onClick={handleClearDates}>
                  Clear
                </Button>
              )}
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              {selectedRows.length ? (
                <Badge variant="secondary" className="h-9 rounded-lg px-3 text-xs">
                  {selectedRows.length} selected
                </Badge>
              ) : null}

              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-[130px]">
                  <SelectValue placeholder="Rows" />
                </SelectTrigger>
                <SelectContent>
                  {rowOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option} rows
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" className="h-9" onClick={exportCSV} disabled={!submissions.length}>
                <Download className="mr-1 h-4 w-4" />
                CSV
              </Button>

              <Button
                variant="destructive"
                size="sm"
                className="h-9"
                onClick={handleBulkDelete}
                disabled={!selectedRows.length || isDeleting}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                {isDeleting ? "Deleting..." : `Delete Selected (${selectedRows.length})`}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-xl shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="space-y-2 p-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex gap-3">
                  {[...Array(visibleColumns.length + 2)].map((__, cellIndex) => (
                    <Skeleton key={cellIndex} className="h-10 flex-1" />
                  ))}
                </div>
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
              <Inbox className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allSelectedOnPage}
                        onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))}
                        aria-label="Select all rows"
                      />
                    </TableHead>

                    {visibleColumns.map((column) => (
                      <TableHead
                        key={column}
                        className={`h-10 whitespace-nowrap text-xs font-semibold ${getColumnCellClassName(column)}`}
                      >
                        {columnLabels[column] || column}
                      </TableHead>
                    ))}

                    <TableHead className="h-10 w-24 whitespace-nowrap text-xs font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {submissions.map((submission) => {
                    const rowKey = getRowKey(submission);
                    const isSelected = selectedKeys.includes(rowKey);

                    return (
                      <TableRow key={rowKey} data-state={isSelected ? "selected" : undefined}>
                        <TableCell className="w-12 align-top">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => toggleSelection(rowKey, Boolean(checked))}
                            aria-label={`Select submission ${submission.id}`}
                          />
                        </TableCell>

                        {visibleColumns.map((column) => (
                          <TableCell key={column} className={`align-top text-sm ${getColumnCellClassName(column)}`}>
                            {column === "form_type" ? (
                              <Badge variant="secondary" className="whitespace-nowrap text-xs">
                                {getTypeLabel(submission.form_type)}
                              </Badge>
                            ) : (
                              <span className="block whitespace-pre-wrap break-words">
                                {formatValue(column, submission[column], submission)}
                              </span>
                            )}
                          </TableCell>
                        ))}

                        <TableCell className="align-top">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailRow(submission)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteSingle(submission)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {submissions.length ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, total)} of {total} submissions
        </div>

        {totalPages > 1 ? (
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {paginationPages.map((pageNumber, index) => (
                <PaginationItem key={`${pageNumber}-${index}`}>
                  {pageNumber < 0 ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) setPage(page + 1);
                  }}
                  className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>

      <Dialog open={!!detailRow} onOpenChange={(open) => !open && setDetailRow(null)}>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {detailRow ? `${getTypeLabel(detailRow.form_type)} - #${detailRow.id}` : "Submission"}
            </DialogTitle>
          </DialogHeader>

          {detailRow ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(detailRow)
                .filter(([key]) => !hiddenDetailKeys.includes(key))
                .map(([key, value]) => (
                  <div key={key} className="rounded-xl border border-border p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {columnLabels[key] || key.replace(/_/g, " ")}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm">
                      {formatValue(key, value, detailRow)}
                    </p>
                  </div>
                ))}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Submissions;
