"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

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

import type { AdminStudent, AdminUser } from "@/lib/staff/staff-data";
import type { FeeStatus } from "@/lib/admin/admin-data";
import { FEE_STATUSES, feeStatusLabel } from "@/lib/admin/admin-data";
import { feeRecords as feeSeed } from "@/lib/staff/staff-data";
import {
  formatCurrencyPKR,
  formatMonthYear,
  initials,
} from "@/lib/admin/formatters";
import { averageForStudent } from "@/lib/staff/staff-data";

type Row = {
  readonly student: AdminStudent;
  readonly user: AdminUser;
};

type StaffStudentsTableProps = {
  readonly rows: ReadonlyArray<Row>;
};

function feeVariant(
  status: FeeStatus,
): "secondary" | "outline" | "destructive" {
  if (status === "paid") return "secondary";
  if (status === "due") return "outline";
  return "destructive";
}

export function StaffStudentsTable({ rows }: StaffStudentsTableProps) {
  const [query, setQuery] = useState("");
  const [cohort, setCohort] = useState<string>("all");
  const [feeFilter, setFeeFilter] = useState<FeeStatus | "all">("all");

  const cohorts = useMemo(() => {
    const set = new Set<string>();
    for (const { student } of rows) set.add(student.className);
    return Array.from(set);
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(({ student, user }) => {
      if (cohort !== "all" && student.className !== cohort) return false;
      if (feeFilter !== "all" && student.feeStatus !== feeFilter) return false;
      if (!q) return true;
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        student.rollNumber.toLowerCase().includes(q)
      );
    });
  }, [rows, query, cohort, feeFilter]);

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
            placeholder="Search by name, email, roll #"
            className="h-9 pl-8 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={cohort} onValueChange={setCohort}>
            <SelectTrigger className="h-9 w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cohorts</SelectItem>
              {cohorts.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={feeFilter}
            onValueChange={(v) => setFeeFilter(v as FeeStatus | "all")}
          >
            <SelectTrigger className="h-9 w-40">
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
          <Button size="sm" asChild className="gap-1">
            <Link href="/dashboard/staff/students/new">
              <Plus className="size-3.5" /> Add student
            </Link>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Student</TableHead>
              <TableHead className="hidden md:table-cell">Roll</TableHead>
              <TableHead className="hidden md:table-cell">Cohort</TableHead>
              <TableHead className="hidden md:table-cell">Avg.</TableHead>
              <TableHead className="text-right">Fee status</TableHead>
              <TableHead className="pr-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-5 py-10 text-center text-xs text-muted-foreground"
                >
                  No students match these filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(({ student, user }) => {
                const avg = averageForStudent(student.userId);
                return (
                  <TableRow key={student.userId}>
                    <TableCell className="pl-5">
                      <Link
                        href={`/dashboard/staff/students/${student.userId}`}
                        className="flex items-center gap-3 hover:underline"
                      >
                        <Avatar className="size-8 rounded-md">
                          <AvatarFallback className="rounded-md bg-primary text-[11px] text-primary-foreground">
                            {initials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5 leading-tight">
                          <span className="text-sm font-medium">
                            {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {user.email}
                          </span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs tabular-nums text-muted-foreground md:table-cell">
                      {student.rollNumber}
                    </TableCell>
                    <TableCell className="hidden text-xs md:table-cell">
                      <div className="flex flex-col gap-0.5">
                        <span>{student.className}</span>
                        <span className="text-muted-foreground">
                          Section {student.section}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary" className="font-mono">
                        {avg}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={feeVariant(student.feeStatus)}>
                        {feeStatusLabel(student.feeStatus)}
                      </Badge>
                      <div className="mt-0.5 text-[10.5px] text-muted-foreground">
                        {(() => {
                          const latest = [...feeSeed]
                            .filter((r) => r.studentUserId === student.userId)
                            .sort((a, b) =>
                              a.monthLabel < b.monthLabel ? 1 : -1,
                            )[0];
                          if (!latest) return "—";
                          return `${formatMonthYear(latest.monthLabel)} · ${formatCurrencyPKR(latest.amount)}`;
                        })()}
                      </div>
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`/dashboard/staff/students/${student.userId}`}
                          >
                            View
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link
                            href={`/dashboard/staff/students/${student.userId}/edit`}
                          >
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default StaffStudentsTable;
