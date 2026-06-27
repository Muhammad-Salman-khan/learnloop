"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

import type {
  AdminCourse,
  AdminEnrollment,
} from "@/lib/staff/staff-data";
import { usePaginator } from "@/lib/hooks/usePagination";
import { TablePagination } from "@/components/TablePagination/TablePagination";
import { formatDateLong } from "@/lib/admin/formatters";

export type StudentEnrollmentRow = {
  readonly enrollment: AdminEnrollment;
  readonly course: AdminCourse | null;
};

type StaffStudentEnrollmentsListProps = {
  readonly rows: ReadonlyArray<StudentEnrollmentRow>;
};

export function StaffStudentEnrollmentsList({
  rows,
}: StaffStudentEnrollmentsListProps) {
  const [query, setQuery] = useState("");
  const sorted = useMemo(
    () =>
      [...rows].sort((a, b) =>
        a.enrollment.enrolledAt < b.enrollment.enrolledAt ? 1 : -1,
      ),
    [rows],
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(({ course }) =>
      course
        ? course.title.toLowerCase().includes(q) ||
          course.code.toLowerCase().includes(q)
        : false,
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
      <div className="relative w-full md:max-w-sm">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter course"
          className="h-9 text-sm"
        />
      </div>

      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-md border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Course</TableHead>
              <TableHead className="hidden md:table-cell">Code</TableHead>
              <TableHead className="hidden md:table-cell">Enrolled</TableHead>
              <TableHead className="text-right">Progress</TableHead>
              <TableHead className="pr-5 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-5 py-10 text-center text-xs text-muted-foreground"
                >
                  {filtered.length === 0
                    ? "No current enrollments."
                    : "Nothing on this page."}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map(({ enrollment, course }) => (
                <TableRow key={enrollment.id}>
                  <TableCell className="pl-5">
                    {course ? (
                      <Link
                        href={`/dashboard/staff/courses/${course.id}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {course.title}
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Untitled
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground md:table-cell">
                    {course?.code ?? "—"}
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {formatDateLong(enrollment.enrolledAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="font-mono">
                      {enrollment.progressPct}%
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/dashboard/staff/courses/${course?.id ?? ""}`}
                      >
                        Open course
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
              ? "No current enrollments."
              : "Nothing on this page."}
          </div>
        ) : (
          pageRows.map(({ enrollment, course }) => (
            <MobileCard
              key={enrollment.id}
              emphasis={
                <Badge variant="secondary" className="font-mono">
                  {enrollment.progressPct}%
                </Badge>
              }
              fields={[
                {
                  label: "Course",
                  value: course
                    ? `${course.code} · ${course.title}`
                    : "Untitled",
                },
                {
                  label: "Enrolled",
                  value: formatDateLong(enrollment.enrolledAt),
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
                    href={`/dashboard/staff/courses/${course?.id ?? ""}`}
                  >
                    Open course
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

export default StaffStudentEnrollmentsList;
