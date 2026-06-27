"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  AdminUser,
} from "@/lib/staff/staff-data";
import { usePaginator } from "@/lib/hooks/usePagination";
import { TablePagination } from "@/components/TablePagination/TablePagination";
import {
  MobileCard,
  MobileCardList,
} from "@/components/MobileCard/MobileCard";
import { formatDateLong } from "@/lib/admin/formatters";

export type EnrollmentRow = {
  readonly enrollment: AdminEnrollment;
  readonly student: AdminUser | null;
  readonly course: AdminCourse | null;
};

type StaffEnrollmentsTableProps = {
  readonly rows: ReadonlyArray<EnrollmentRow>;
};

export function StaffEnrollmentsTable({ rows }: StaffEnrollmentsTableProps) {
  const [query, setQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState<string>("all");

  const filtered = rows.filter(({ enrollment, student, course }) => {
    if (courseFilter !== "all" && enrollment.courseId !== courseFilter)
      return false;
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      (student?.name.toLowerCase().includes(q) ?? false) ||
      (student?.email.toLowerCase().includes(q) ?? false) ||
      (course?.title.toLowerCase().includes(q) ?? false) ||
      (course?.code.toLowerCase().includes(q) ?? false)
    );
  });

  const paginator = usePaginator(filtered.length, 10);

  useEffect(() => {
    paginator.goTo(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, courseFilter, filtered.length]);

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
            placeholder="Search student, course, code"
            className="h-9 pl-8 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={courseFilter === "all" ? "" : courseFilter}
            onChange={(e) =>
              setCourseFilter(e.target.value === "" ? "all" : e.target.value)
            }
            placeholder="Filter by course id"
            className="h-9 w-52"
          />
          <Button size="sm" asChild className="gap-1">
            <Link href="/dashboard/staff/enrollments/new">
              <Plus className="size-3.5" /> Manual enrollment
            </Link>
          </Button>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-md border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Student</TableHead>
              <TableHead className="hidden md:table-cell">Course</TableHead>
              <TableHead className="hidden md:table-cell">
                Enrolled on
              </TableHead>
              <TableHead className="text-right">Progress</TableHead>
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
                    ? "No enrollments yet."
                    : "Nothing on this page."}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map(({ enrollment, student, course }) => (
                <TableRow key={enrollment.id}>
                  <TableCell className="pl-5">
                    {student ? (
                      <Link
                        href={`/dashboard/staff/students/${student.id}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {student.name}
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unknown</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                        {course?.code ?? "—"}
                      </span>
                      <span className="text-xs">
                        {course?.title ?? "Untitled course"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {formatDateLong(enrollment.enrolledAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="font-mono">
                      {enrollment.progressPct}%
                    </Badge>
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
              ? "No enrollments yet."
              : "Nothing on this page."}
          </div>
        ) : (
          pageRows.map(({ enrollment, student, course }) => (
            <MobileCard
              key={enrollment.id}
              emphasis={
                <Badge variant="secondary" className="font-mono">
                  {enrollment.progressPct}%
                </Badge>
              }
              fields={[
                {
                  label: "Student",
                  value: student ? (
                    <Link
                      href={`/dashboard/staff/students/${student.id}`}
                      className="hover:underline"
                    >
                      {student.name}
                    </Link>
                  ) : (
                    "Unknown"
                  ),
                },
                {
                  label: "Course",
                  value: course
                    ? `${course.code} · ${course.title}`
                    : "Untitled",
                },
                { label: "Enrolled", value: formatDateLong(enrollment.enrolledAt) },
              ]}
            />
          ))
        )}
      </MobileCardList>

      <TablePagination paginator={paginator} />
    </div>
  );
}

export default StaffEnrollmentsTable;
