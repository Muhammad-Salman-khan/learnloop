"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  AdminEnrollment,
  AdminStudent,
  AdminUser,
} from "@/lib/staff/staff-data";
import type { FeeStatus } from "@/lib/admin/admin-data";
import { FEE_STATUSES, feeStatusLabel } from "@/lib/admin/admin-data";
import { usePaginator } from "@/lib/hooks/usePagination";
import { TablePagination } from "@/components/TablePagination/TablePagination";
import {
  MobileCard,
  MobileCardList,
} from "@/components/MobileCard/MobileCard";
import {
  formatDateLong,
  initials,
} from "@/lib/admin/formatters";

export type RosterRow = {
  readonly enrollment: AdminEnrollment;
  readonly student: AdminStudent;
  readonly user: AdminUser;
};

type StaffCourseRosterTableProps = {
  readonly rows: ReadonlyArray<RosterRow>;
};

function feeVariant(status: FeeStatus) {
  if (status === "paid") return "secondary" as const;
  if (status === "due") return "outline" as const;
  return "destructive" as const;
}

export function StaffCourseRosterTable({
  rows,
}: StaffCourseRosterTableProps) {
  const [query, setQuery] = useState("");
  const [feeFilter, setFeeFilter] = useState<FeeStatus | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(({ student, user }) => {
      if (feeFilter !== "all" && student.feeStatus !== feeFilter) return false;
      if (!q) return true;
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        student.rollNumber.toLowerCase().includes(q)
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
            placeholder="Search student or roll"
            className="h-9 pl-8 text-sm"
          />
        </div>
        <Select
          value={feeFilter}
          onValueChange={(v) => setFeeFilter(v as FeeStatus | "all")}
        >
          <SelectTrigger className="h-9 w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any fee status</SelectItem>
            {FEE_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {feeStatusLabel(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-md border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Student</TableHead>
              <TableHead className="hidden md:table-cell">Roll</TableHead>
              <TableHead className="hidden md:table-cell">Section</TableHead>
              <TableHead className="hidden md:table-cell">Fee</TableHead>
              <TableHead className="hidden md:table-cell">
                Enrolled on
              </TableHead>
              <TableHead className="text-right">Progress</TableHead>
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
                    ? "No students enrolled yet."
                    : "Nothing on this page."}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((row) => (
                <TableRow key={row.enrollment.id}>
                  <TableCell className="pl-5">
                    <Link
                      href={`/dashboard/staff/students/${row.user.id}`}
                      className="flex items-center gap-3 hover:underline"
                    >
                      <Avatar className="size-8 rounded-md">
                        <AvatarFallback className="rounded-md bg-primary text-[11px] text-primary-foreground">
                          {initials(row.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-0.5 leading-tight">
                        <span className="text-sm font-medium">
                          {row.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {row.user.email}
                        </span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden font-mono text-xs tabular-nums text-muted-foreground md:table-cell">
                    {row.student.rollNumber}
                  </TableCell>
                  <TableCell className="hidden text-xs md:table-cell">
                    Sec {row.student.section}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={feeVariant(row.student.feeStatus)}>
                      {feeStatusLabel(row.student.feeStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {formatDateLong(row.enrollment.enrolledAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="font-mono">
                      {row.enrollment.progressPct}%
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/dashboard/staff/students/${row.user.id}/results`}
                      >
                        View results
                      </Link>
                    </Button>
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
              ? "No students enrolled yet."
              : "Nothing on this page."}
          </div>
        ) : (
          pageRows.map((row) => (
            <MobileCard
              key={row.enrollment.id}
              emphasis={
                <>
                  <Badge variant={feeVariant(row.student.feeStatus)}>
                    {feeStatusLabel(row.student.feeStatus)}
                  </Badge>
                  <Badge variant="secondary" className="font-mono">
                    {row.enrollment.progressPct}%
                  </Badge>
                </>
              }
              fields={[
                { label: "Name", value: row.user.name },
                { label: "Email", value: row.user.email },
                { label: "Roll #", value: row.student.rollNumber },
                { label: "Section", value: `Sec ${row.student.section}` },
                {
                  label: "Enrolled",
                  value: formatDateLong(row.enrollment.enrolledAt),
                },
              ]}
              actions={
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <Link
                    href={`/dashboard/staff/students/${row.user.id}/results`}
                  >
                    View results
                  </Link>
                </Button>
              }
            />
          ))
        )}
      </MobileCardList>

      <TablePagination paginator={paginator} />
    </div>
  );
}

export default StaffCourseRosterTable;
