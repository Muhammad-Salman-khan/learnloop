"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Archive, ArchiveRestore } from "lucide-react";
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
  AdminCourse,
  AdminUser,
  CourseStatus,
} from "@/lib/admin/admin-data";
import {
  ALL_STATUSES,
} from "@/lib/admin/course-helpers";
import { courseStatusLabel } from "@/lib/admin/admin-data";
import { formatCurrencyPKR, formatDateLong } from "@/lib/admin/formatters";

type TeacherFilter = "all" | string;

type Row = {
  readonly course: AdminCourse;
  readonly teacher: AdminUser | null;
};

type AdminCoursesTableProps = {
  readonly rows: ReadonlyArray<Row>;
};

function statusVariant(
  status: CourseStatus,
): "default" | "secondary" | "outline" {
  if (status === "live") return "secondary";
  if (status === "draft") return "outline";
  return "default";
}

export function AdminCoursesTable({ rows }: AdminCoursesTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CourseStatus | "all">("all");
  const [teacher, setTeacher] = useState<TeacherFilter>("all");

  const teachers = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of rows) {
      if (r.teacher && !seen.has(r.teacher.id)) {
        seen.set(r.teacher.id, r.teacher.name);
      }
    }
    return Array.from(seen, ([id, label]) => ({ id, label })).sort(
      (a, b) => a.label.localeCompare(b.label),
    );
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(({ course, teacher: courseTeacher }) => {
      if (status !== "all" && course.status !== status) return false;
      if (teacher !== "all" && course.teacherUserId !== teacher)
        return false;
      if (!q) return true;
      return (
        course.title.toLowerCase().includes(q) ||
        course.code.toLowerCase().includes(q) ||
        (courseTeacher?.name.toLowerCase().includes(q) ?? false)
      );
    });
  }, [rows, query, status, teacher]);

  function toggleArchive(course: AdminCourse) {
    const next: CourseStatus =
      course.status === "archived" ? "draft" : "archived";
    toast.success(
      `${course.code} ${next === "archived" ? "archived" : "restored"}`,
      {
        description: "Demo: course status is mocked in-memory.",
      },
    );
  }

  function toggleLive(course: AdminCourse) {
    const next: CourseStatus =
      course.status === "live" ? "draft" : "live";
    toast.success(
      `${course.code} ${next === "live" ? "published" : "unpublished"}`,
    );
  }

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
            placeholder="Search by code or title"
            className="h-9 pl-8 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as CourseStatus | "all")}
          >
            <SelectTrigger className="h-9 w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              {ALL_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {courseStatusLabel(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={teacher}
            onValueChange={(v) => setTeacher(v)}
          >
            <SelectTrigger className="h-9 w-56">
              <SelectValue placeholder="All teachers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All teachers</SelectItem>
              {teachers.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Course</TableHead>
              <TableHead className="hidden md:table-cell">Teacher</TableHead>
              <TableHead className="hidden md:table-cell">Enrolled</TableHead>
              <TableHead className="hidden md:table-cell">Fee / seat</TableHead>
              <TableHead className="hidden md:table-cell">Updated</TableHead>
              <TableHead className="text-right">Status</TableHead>
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
                  No courses match these filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(({ course, teacher }) => (
                <TableRow key={course.id}>
                  <TableCell className="pl-5">
                    <Link
                      href={`/dashboard/admin/courses/${course.id}`}
                      className="flex flex-col gap-0.5 leading-tight hover:underline"
                    >
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                        {course.code}
                      </span>
                      <span className="font-medium">{course.title}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    {teacher?.name ?? "—"}
                  </TableCell>
                  <TableCell className="hidden text-xs tabular-nums md:table-cell">
                    <span className="font-medium">
                      {course.enrolled}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      / {course.capacity}
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-xs tabular-nums text-muted-foreground md:table-cell">
                    {formatCurrencyPKR(course.feePerSeat)}
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {formatDateLong(course.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={statusVariant(course.status)}>
                      {courseStatusLabel(course.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLive(course)}
                        className="gap-1 text-xs"
                      >
                        {course.status === "live"
                          ? "Unpublish"
                          : "Publish"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleArchive(course)}
                        className="gap-1 text-xs"
                      >
                        {course.status === "archived" ? (
                          <>
                            <ArchiveRestore className="size-3.5" />
                            Restore
                          </>
                        ) : (
                          <>
                            <Archive className="size-3.5" />
                            Archive
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default AdminCoursesTable;
