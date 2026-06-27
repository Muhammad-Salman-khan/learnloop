"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

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
  AdminCourseStatus,
  AdminUser,
} from "@/lib/staff/staff-data";
import { usePaginator } from "@/lib/hooks/usePagination";
import { TablePagination } from "@/components/TablePagination/TablePagination";
import {
  MobileCard,
  MobileCardList,
} from "@/components/MobileCard/MobileCard";
import {
  courseStatusLabel,
} from "@/lib/admin/admin-data";
import {
  formatCurrencyPKR,
} from "@/lib/admin/formatters";

export type CourseRow = {
  readonly course: AdminCourse;
  readonly teacher: AdminUser | null;
};

type StaffCoursesTableProps = {
  readonly rows: ReadonlyArray<CourseRow>;
};

const ALL_STATUSES: ReadonlyArray<AdminCourseStatus> = [
  "draft",
  "live",
  "archived",
];

function statusVariant(
  status: AdminCourseStatus,
): "secondary" | "outline" | "ghost" {
  if (status === "live") return "secondary";
  if (status === "draft") return "outline";
  return "ghost";
}

export function StaffCoursesTable({ rows }: StaffCoursesTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AdminCourseStatus | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(({ course, teacher }) => {
      if (status !== "all" && course.status !== status) return false;
      if (!q) return true;
      return (
        course.title.toLowerCase().includes(q) ||
        course.code.toLowerCase().includes(q) ||
        (teacher?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [rows, query, status]);

  const paginator = usePaginator(filtered.length, 10);

  useEffect(() => {
    paginator.goTo(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, status, filtered.length]);

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
            placeholder="Search by title, code, teacher"
            className="h-9 pl-8 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as AdminCourseStatus | "all")}
          >
            <SelectTrigger className="h-9 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {ALL_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {courseStatusLabel(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-md border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Course</TableHead>
              <TableHead className="hidden md:table-cell">Teacher</TableHead>
              <TableHead className="hidden md:table-cell">
                Enrollment
              </TableHead>
              <TableHead className="hidden md:table-cell">Fee</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="pr-5 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-5 py-10 text-center text-xs text-muted-foreground"
                >
                  {filtered.length === 0
                    ? "No courses match these filters."
                    : "Nothing on this page."}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map(({ course, teacher }) => {
                const enrollmentPct = Math.min(
                  100,
                  Math.round((course.enrolled / course.capacity) * 100),
                );
                return (
                  <TableRow key={course.id}>
                    <TableCell className="pl-5">
                      <Link
                        href={`/dashboard/staff/courses/${course.id}`}
                        className="flex flex-col gap-0.5 hover:underline"
                      >
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                          {course.code}
                        </span>
                        <span className="text-sm font-medium">
                          {course.title}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden text-xs md:table-cell">
                      {teacher?.name ?? "TBA"}
                    </TableCell>
                    <TableCell className="hidden text-xs md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-muted">
                          <div
                            className="h-1.5 rounded-full bg-primary"
                            style={{ width: `${enrollmentPct}%` }}
                          />
                        </div>
                        <span className="font-mono tabular-nums">
                          {course.enrolled}/{course.capacity}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs md:table-cell">
                      {formatCurrencyPKR(course.feePerSeat)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={statusVariant(course.status)}>
                        {courseStatusLabel(course.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/dashboard/staff/courses/${course.id}`}
                        >
                          Open
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

      <MobileCardList>
        {pageRows.length === 0 ? (
          <div className="rounded-md border bg-card p-6 text-center text-xs text-muted-foreground">
            {filtered.length === 0
              ? "No courses match these filters."
              : "Nothing on this page."}
          </div>
        ) : (
          pageRows.map(({ course, teacher }) => {
            const enrollmentPct = Math.min(
              100,
              Math.round((course.enrolled / course.capacity) * 100),
            );
            return (
              <MobileCard
                key={course.id}
                emphasis={
                  <Badge variant={statusVariant(course.status)}>
                    {courseStatusLabel(course.status)}
                  </Badge>
                }
                fields={[
                  { label: "Course", value: `${course.code} · ${course.title}` },
                  { label: "Teacher", value: teacher?.name ?? "TBA" },
                  {
                    label: "Enrollment",
                    value: `${course.enrolled}/${course.capacity} (${enrollmentPct}%)`,
                  },
                  { label: "Fee / seat", value: formatCurrencyPKR(course.feePerSeat) },
                ]}
                actions={
                  <Button size="sm" asChild className="w-full sm:w-auto">
                    <Link href={`/dashboard/staff/courses/${course.id}`}>
                      Open
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

export default StaffCoursesTable;
