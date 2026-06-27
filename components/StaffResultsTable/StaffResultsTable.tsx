"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Search } from "lucide-react";

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
  AdminCourse,
  AdminUser,
  ResultKind,
  ResultRow,
} from "@/lib/staff/staff-data";
import { RESULT_KINDS, resultKindLabel } from "@/lib/staff/staff-data";
import { usePaginator } from "@/lib/hooks/usePagination";
import { TablePagination } from "@/components/TablePagination/TablePagination";
import {
  MobileCard,
  MobileCardList,
} from "@/components/MobileCard/MobileCard";
import { formatDateLong } from "@/lib/admin/formatters";

export type ResultsTableRow = {
  readonly result: ResultRow;
  readonly student: AdminUser | null;
  readonly course: AdminCourse | null;
};

type StaffResultsTableProps = {
  readonly rows: ReadonlyArray<ResultsTableRow>;
};

export function StaffResultsTable({ rows }: StaffResultsTableProps) {
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [kindFilter, setKindFilter] = useState<ResultKind | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(({ result, student, course }) => {
      if (courseFilter !== "all" && result.courseId !== courseFilter)
        return false;
      if (kindFilter !== "all" && result.kind !== kindFilter) return false;
      if (!q) return true;
      return (
        result.title.toLowerCase().includes(q) ||
        (student?.name.toLowerCase().includes(q) ?? false) ||
        (course?.title.toLowerCase().includes(q) ?? false) ||
        (course?.code.toLowerCase().includes(q) ?? false)
      );
    });
  }, [rows, query, courseFilter, kindFilter]);

  const paginator = usePaginator(filtered.length, 10);

  useEffect(() => {
    paginator.goTo(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, courseFilter, kindFilter, filtered.length]);

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
            placeholder="Search by title, course, student"
            className="h-9 pl-8 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Filter className="size-3.5" />
            <span className="hidden sm:inline">Filters</span>
          </div>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="h-9 w-52">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              {Array.from(new Set(rows.map((r) => r.result.courseId))).map(
                (courseId) => {
                  const c = rows.find(
                    (row) => row.result.courseId === courseId,
                  )?.course;
                  return (
                    <SelectItem key={courseId} value={courseId}>
                      {c?.code ?? courseId} · {c?.title ?? "Course"}
                    </SelectItem>
                  );
                },
              )}
            </SelectContent>
          </Select>
          <Select
            value={kindFilter}
            onValueChange={(v) => setKindFilter(v as ResultKind | "all")}
          >
            <SelectTrigger className="h-9 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All kinds</SelectItem>
              {RESULT_KINDS.map((k) => (
                <SelectItem key={k} value={k}>
                  {resultKindLabel(k)}
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
              <TableHead className="pl-5">Course</TableHead>
              <TableHead className="hidden md:table-cell">Title</TableHead>
              <TableHead className="hidden md:table-cell">Kind</TableHead>
              <TableHead className="hidden md:table-cell">Student</TableHead>
              <TableHead className="hidden md:table-cell">Submitted</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="pr-5 text-right">%</TableHead>
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
                    ? "No results match these filters."
                    : "Nothing on this page."}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map(({ result, student, course }) => {
                const pct =
                  result.maxScore > 0
                    ? Math.round((result.score / result.maxScore) * 100)
                    : 0;
                return (
                  <TableRow key={result.id}>
                    <TableCell className="pl-5">
                      <Link
                        href={`/dashboard/staff/results/${result.courseId}`}
                        className="flex flex-col gap-0.5 hover:underline"
                      >
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                          {course?.code ?? "—"}
                        </span>
                        <span className="text-sm font-medium">
                          {course?.title ?? "Untitled"}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden text-xs md:table-cell">
                      {result.title}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="h-5 text-[10.5px]">
                        {resultKindLabel(result.kind).toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-xs md:table-cell">
                      <Link
                        href={`/dashboard/staff/students/${result.studentUserId}/results`}
                        className="hover:underline"
                      >
                        {student?.name ?? "Unknown"}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                      {formatDateLong(result.submittedOn)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {result.score}/{result.maxScore}
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Badge
                        variant={pct >= 60 ? "secondary" : "destructive"}
                        className="font-mono"
                      >
                        {pct}%
                      </Badge>
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
              ? "No results match these filters."
              : "Nothing on this page."}
          </div>
        ) : (
          pageRows.map(({ result, student, course }) => {
            const pct =
              result.maxScore > 0
                ? Math.round((result.score / result.maxScore) * 100)
                : 0;
            return (
              <MobileCard
                key={result.id}
                emphasis={
                  <>
                    <Badge variant="outline" className="h-5 text-[10.5px]">
                      {resultKindLabel(result.kind).toUpperCase()}
                    </Badge>
                    <Badge
                      variant={pct >= 60 ? "secondary" : "destructive"}
                      className="font-mono"
                    >
                      {pct}%
                    </Badge>
                  </>
                }
                fields={[
                  { label: "Course", value: course ? `${course.code} · ${course.title}` : "Untitled" },
                  { label: "Title", value: result.title },
                  {
                    label: "Student",
                    value: (
                      <Link
                        href={`/dashboard/staff/students/${result.studentUserId}/results`}
                        className="hover:underline"
                      >
                        {student?.name ?? "Unknown"}
                      </Link>
                    ),
                  },
                  {
                    label: "Score",
                    value: `${result.score}/${result.maxScore}`,
                  },
                  {
                    label: "Submitted",
                    value: formatDateLong(result.submittedOn),
                  },
                ]}
                actions={
                  <Button size="sm" asChild className="w-full sm:w-auto">
                    <Link href={`/dashboard/staff/results/${result.courseId}`}>
                      Open course
                    </Link>
                  </Button>
                }
              />
            );
          })
        )}
      </MobileCardList>

      <TablePagination paginator={paginator} />
    </div>
  );
}

export default StaffResultsTable;
