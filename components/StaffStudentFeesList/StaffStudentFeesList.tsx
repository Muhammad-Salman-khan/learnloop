"use client";

import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MobileCard,
  MobileCardList,
} from "@/components/MobileCard/MobileCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
 } from "@/components/ui/table";

import type { FeeRecord } from "@/lib/staff/staff-data";
import type { FeeStatus as AdminFeeStatus } from "@/lib/admin/admin-data";
import { feeStatusLabel } from "@/lib/admin/admin-data";
import { usePaginator } from "@/lib/hooks/usePagination";
import { TablePagination } from "@/components/TablePagination/TablePagination";
import {
  formatCurrencyPKR,
  formatMonthYear,
  relativeTime,
} from "@/lib/admin/formatters";

type StaffStudentFeesListProps = {
  readonly records: ReadonlyArray<FeeRecord>;
  // Current cycle status — drives the "Current · paid/due/unpaid" pill
  // rendered on mobile-only chrome (desktop shows it inside the table
  // summary card from the parent page).
  readonly currentStatus?: AdminFeeStatus;
};

function feeVariant(status: AdminFeeStatus) {
  if (status === "paid") return "secondary" as const;
  if (status === "due") return "outline" as const;
  return "destructive" as const;
}

export function StaffStudentFeesList({
  records,
  currentStatus,
}: StaffStudentFeesListProps) {
  const [query, setQuery] = useState("");

  const sorted = useMemo(
    () =>
      [...records].sort((a, b) => (a.monthLabel < b.monthLabel ? 1 : -1)),
    [records],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((r) =>
      formatMonthYear(r.monthLabel).toLowerCase().includes(q),
    );
  }, [sorted, query]);

  const paginator = usePaginator(filtered.length, 10);

  useEffect(() => {
    paginator.goTo(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filtered.length]);

  const pageRows = paginator.slice(filtered);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cycles"
            className="h-9 text-sm"
          />
        </div>
        {/* Mobile status pills */}
        <div className="flex flex-wrap items-center gap-2 md:hidden">
          <Badge
            variant={
              currentStatus === "paid"
                ? "secondary"
                : currentStatus === "due"
                  ? "outline"
                  : "destructive"
            }
          >
            Current · {currentStatus ? feeStatusLabel(currentStatus) : "—"}
          </Badge>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-md border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Cycle</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="pr-5 text-right">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-5 py-10 text-center text-xs text-muted-foreground"
                >
                  {filtered.length === 0
                    ? "No fee cycles recorded."
                    : "Nothing on this page."}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="pl-5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                    {formatMonthYear(r.monthLabel)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {formatCurrencyPKR(r.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={feeVariant(r.status)}>
                      {feeStatusLabel(r.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-5 text-right text-xs text-muted-foreground">
                    {r.paidOn
                      ? `paid ${relativeTime(r.paidOn)}`
                      : `updated ${relativeTime(r.updatedAt)}`}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile */}
      <MobileCardList>
        {pageRows.length === 0 ? (
          <div className="rounded-md border bg-card p-6 text-center text-xs text-muted-foreground">
            {filtered.length === 0
              ? "No fee cycles recorded."
              : "Nothing on this page."}
          </div>
        ) : (
          pageRows.map((r) => (
            <MobileCard
              key={r.id}
              emphasis={
                <Badge variant={feeVariant(r.status)}>
                  {feeStatusLabel(r.status)}
                </Badge>
              }
              fields={[
                {
                  label: "Cycle",
                  value: formatMonthYear(r.monthLabel),
                },
                {
                  label: "Amount",
                  value: formatCurrencyPKR(r.amount),
                },
                {
                  label: "Last update",
                  value: r.paidOn
                    ? `paid ${relativeTime(r.paidOn)}`
                    : `updated ${relativeTime(r.updatedAt)}`,
                },
              ]}
            />
          ))
        )}
      </MobileCardList>

      <TablePagination paginator={paginator} />
    </div>
  );
}

export default StaffStudentFeesList;
