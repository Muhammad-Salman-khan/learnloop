"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Wallet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  FeeRecord,
  FeeStatus,
} from "@/lib/staff/staff-data";
import { FEE_STATUSES, feeStatusLabel } from "@/lib/admin/admin-data";
import { usePaginator } from "@/lib/hooks/usePagination";
import { TablePagination } from "@/components/TablePagination/TablePagination";
import {
  MobileCard,
  MobileCardList,
} from "@/components/MobileCard/MobileCard";
import {
  formatCurrencyPKR,
  formatMonthYear,
} from "@/lib/admin/formatters";

export type StaffFeeRow = {
  readonly student: AdminStudent;
  readonly user: AdminUser;
  readonly monthly: ReadonlyArray<FeeRecord>;
  readonly totalPaid: number;
  readonly unpaid: number;
};

type StaffFeesTableProps = {
  readonly rows: ReadonlyArray<StaffFeeRow>;
};

function feeVariant(
  status: FeeStatus,
): "secondary" | "outline" | "destructive" {
  if (status === "paid") return "secondary";
  if (status === "due") return "outline";
  return "destructive";
}

export function StaffFeesTable({ rows }: StaffFeesTableProps) {
  const [query, setQuery] = useState("");
  const [feeFilter, setFeeFilter] = useState<FeeStatus | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (feeFilter !== "all" && row.student.feeStatus !== feeFilter)
        return false;
      if (!q) return true;
      return (
        row.user.name.toLowerCase().includes(q) ||
        row.student.rollNumber.toLowerCase().includes(q)
      );
    });
  }, [rows, query, feeFilter]);

  const paginator = usePaginator(filtered.length, 10);

  useEffect(() => {
    paginator.goTo(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, feeFilter, filtered.length]);

  const pageRows = paginator.slice(filtered);

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
            onValueChange={(v) => setFeeFilter(v as FeeStatus | "all")}
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
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-md border bg-card md:block">
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
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-5 py-10 text-center text-xs text-muted-foreground"
                >
                  {filtered.length === 0
                    ? "No students match these filters."
                    : "Nothing on this page."}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row) => {
                const lastThree = [...row.monthly]
                  .sort((a, b) =>
                    a.monthLabel < b.monthLabel ? 1 : -1,
                  )
                  .slice(0, 3);
                return (
                  <TableRow key={row.student.userId}>
                    <TableCell className="pl-5">
                      <Link
                        href={`/dashboard/staff/fees/${row.student.userId}`}
                        className="font-medium hover:underline"
                      >
                        {row.user.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {row.student.rollNumber}
                      </div>
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs tabular-nums text-muted-foreground md:table-cell">
                      {row.student.rollNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {lastThree.map((m) => (
                          <Badge
                            key={m.id}
                            variant={feeVariant(m.status)}
                            className="font-mono text-[10.5px]"
                            title={`${formatMonthYear(m.monthLabel)} · ${feeStatusLabel(m.status)}`}
                          >
                            {formatMonthYear(m.monthLabel).split(" ")[0]}
                          </Badge>
                        ))}
                        {lastThree.length === 0 ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums">
                      {formatCurrencyPKR(row.totalPaid)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums text-muted-foreground">
                      {row.unpaid > 0 ? formatCurrencyPKR(row.unpaid) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={feeVariant(row.student.feeStatus)}>
                        {feeStatusLabel(row.student.feeStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/dashboard/staff/fees/${row.student.userId}`}
                        >
                          Manage
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile */}
      <MobileCardList>
        {pageRows.length === 0 ? (
          <div className="rounded-md border bg-card p-6 text-center text-xs text-muted-foreground">
            {filtered.length === 0
              ? "No students match these filters."
              : "Nothing on this page."}
          </div>
        ) : (
          pageRows.map((row) => {
            const lastThree = [...row.monthly]
              .sort((a, b) => (a.monthLabel < b.monthLabel ? 1 : -1))
              .slice(0, 3);
            return (
              <MobileCard
                key={row.student.userId}
                emphasis={
                  <Badge variant={feeVariant(row.student.feeStatus)}>
                    {feeStatusLabel(row.student.feeStatus)}
                  </Badge>
                }
                fields={[
                  { label: "Name", value: row.user.name },
                  { label: "Roll #", value: row.student.rollNumber },
                  {
                    label: "Total paid",
                    value: formatCurrencyPKR(row.totalPaid),
                  },
                  {
                    label: "Outstanding",
                    value:
                      row.unpaid > 0 ? formatCurrencyPKR(row.unpaid) : "—",
                  },
                  {
                    label: "Last 3 months",
                    value:
                      lastThree.length === 0
                        ? "—"
                        : lastThree
                            .map(
                              (m) =>
                                `${formatMonthYear(m.monthLabel)
                                  .split(" ")[0]
                                  .slice(0, 3)}·${feeStatusLabel(m.status).slice(0, 3)}`,
                            )
                            .join(" "),
                  },
                ]}
                actions={
                  <Button
                    size="sm"
                    asChild
                    className="w-full gap-1 sm:w-auto"
                  >
                    <Link
                      href={`/dashboard/staff/fees/${row.student.userId}`}
                    >
                      <Wallet className="size-3" /> Manage fees
                    </Link>
                  </Button>
                }
              />
            );
          })
        )}
      </MobileCardList>

      <TablePagination paginator={paginator} />

      {/* Mobile summary card: per-student collected/owed totals at the
          top mirror the master-strip KPI slot. Hidden ≥ md. */}
      <Card className="gap-2 py-3 md:hidden">
        <CardContent className="flex flex-col gap-1 px-4 py-1 text-sm">
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Showing
          </span>
          <span>{paginator.rangeLabel}</span>
        </CardContent>
      </Card>
    </div>
  );
}

export default StaffFeesTable;
