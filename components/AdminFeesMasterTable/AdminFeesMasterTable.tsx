"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Download } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type {
  AdminStudent,
  AdminUser,
  FeeStatus,
} from "@/lib/admin/admin-data";
import { FEE_STATUSES, feeStatusLabel } from "@/lib/admin/admin-data";
import {
  formatCurrencyPKR,
  formatMonthYear,
} from "@/lib/admin/formatters";

type Row = {
  readonly student: AdminStudent;
  readonly user: AdminUser | null;
  readonly monthly: ReadonlyArray<{
    readonly monthLabel: string;
    readonly status: FeeStatus;
    readonly amount: number;
  }>;
  readonly totalPaid: number;
  readonly unpaidAmount: number;
};

type AdminFeesMasterTableProps = {
  readonly rows: ReadonlyArray<Row>;
};

function feeVariant(
  status: FeeStatus,
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "paid") return "secondary";
  if (status === "due") return "outline";
  return "destructive";
}

export function AdminFeesMasterTable({
  rows,
}: AdminFeesMasterTableProps) {
  const [query, setQuery] = useState("");
  const [feeFilter, setFeeFilter] = useState<FeeStatus | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((row) => {
        if (
          feeFilter !== "all" &&
          row.student.feeStatus !== feeFilter
        )
          return false;
        if (!q) return true;
        return (
          (row.user?.name ?? "")
            .toLowerCase()
            .includes(q) ||
          row.student.rollNumber.toLowerCase().includes(q)
        );
      })
      .map((row) => ({ ...row }));
  }, [rows, query, feeFilter]);

  function exportCsv() {
    const header = [
      "student_id",
      "name",
      "roll",
      "current_status",
      "total_paid_pkr",
      "outstanding_pkr",
    ];
    const lines = [header.join(",")];
    for (const r of filtered) {
      lines.push(
        [
          r.student.userId,
          JSON.stringify(r.user?.name ?? ""),
          r.student.rollNumber,
          r.student.feeStatus,
          r.totalPaid,
          r.unpaidAmount,
        ].join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "learnhub-fees-2026-01.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("CSV exported", {
      description: `Downloaded ${filtered.length} rows`,
    });
  }

  // Get a window of recent month labels for the inline row sparkline.
  const window = rows[0]?.monthly.slice(-3) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:w-80">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or roll number"
            className="h-9 pl-8 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={feeFilter}
            onValueChange={(v) =>
              setFeeFilter(v as FeeStatus | "all")
            }
          >
            <SelectTrigger className="h-9 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {FEE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {feeStatusLabel(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCsv}
            className="gap-1.5"
          >
            <Download className="size-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Student</TableHead>
              <TableHead className="hidden md:table-cell">Roll</TableHead>
              <TableHead>Last 3 months</TableHead>
              <TableHead className="text-right">Total paid</TableHead>
              <TableHead className="text-right">Outstanding</TableHead>
              <TableHead className="text-right">Current</TableHead>
              <TableHead className="pr-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-5 py-10 text-center text-xs text-muted-foreground"
                >
                  No students match these filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.student.userId}>
                  <TableCell className="pl-5">
                    <Link
                      href={`/dashboard/admin/students/${row.student.userId}`}
                      className="font-medium hover:underline"
                    >
                      {row.user?.name ?? row.student.userId}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden font-mono text-xs tabular-nums text-muted-foreground md:table-cell">
                    {row.student.rollNumber}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {row.monthly
                        .slice(-3)
                        .map((m) => (
                          <Badge
                            key={m.monthLabel}
                            variant={feeVariant(m.status)}
                            className="font-mono text-[10.5px]"
                            title={`${formatMonthYear(m.monthLabel)} — ${feeStatusLabel(m.status)}`}
                          >
                            {formatMonthYear(m.monthLabel).split(" ")[0]}
                          </Badge>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs tabular-nums">
                    {formatCurrencyPKR(row.totalPaid)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs tabular-nums text-muted-foreground">
                    {row.unpaidAmount > 0
                      ? formatCurrencyPKR(row.unpaidAmount)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={feeVariant(row.student.feeStatus)}>
                      {feeStatusLabel(row.student.feeStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/dashboard/admin/fees/${row.student.userId}`}
                      >
                        Manage
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <span className="sr-only">{window.length}</span>
    </div>
  );
}

export default AdminFeesMasterTable;
