"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import {
  type AdminCourse,
  type AdminUser,
  type AdminEnrollment,
} from "@/lib/admin/admin-data";
import { formatDateLong } from "@/lib/admin/formatters";

type Row = {
  readonly enrollment: AdminEnrollment;
  readonly student: AdminUser | null;
  readonly course: AdminCourse | null;
};

type AdminEnrollmentsTableProps = {
  readonly rows: ReadonlyArray<Row>;
};

export function AdminEnrollmentsTable({
  rows,
}: AdminEnrollmentsTableProps) {
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState("all");

  const courses = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of rows) {
      if (r.course && !seen.has(r.course.id)) {
        seen.set(r.course.id, r.course.code);
      }
    }
    return Array.from(seen, ([id, code]) => ({ id, code })).sort(
      (a, b) => a.code.localeCompare(b.code),
    );
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(({ student, course: cc }) => {
      if (course !== "all" && cc?.id !== course) return false;
      if (!q) return true;
      const stringish =
        (student?.name ?? "").toLowerCase() +
        " " +
        (cc?.code ?? "").toLowerCase() +
        " " +
        (cc?.title ?? "").toLowerCase();
      return stringish.includes(q);
    });
  }, [rows, query, course]);

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
            placeholder="Search by student or course"
            className="h-9 pl-8 text-sm"
          />
        </div>
        <Select value={course} onValueChange={setCourse}>
          <SelectTrigger className="h-9 w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All courses</SelectItem>
            {courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Student</TableHead>
              <TableHead className="hidden md:table-cell">Course</TableHead>
              <TableHead className="hidden md:table-cell">Enrolled</TableHead>
              <TableHead className="pr-5 text-right">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-5 py-10 text-center text-xs text-muted-foreground"
                >
                  No enrollments match these filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(({ enrollment, student, course: cc }) => (
                <TableRow key={enrollment.id}>
                  <TableCell className="pl-5">
                    {student ? (
                      <Link
                        href={`/dashboard/admin/students/${student.id}`}
                        className="font-medium hover:underline"
                      >
                        {student.name}
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {enrollment.studentUserId}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col gap-0.5 leading-tight">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                        {cc?.code ?? "—"}
                      </span>
                      <span className="text-sm">{cc?.title ?? "—"}</span>
                      <Badge variant="outline" className="mt-1 w-fit">
                        {cc?.status.toUpperCase() ?? "—"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {formatDateLong(enrollment.enrolledAt)}
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Progress
                        value={enrollment.progressPct}
                        className="h-2 w-24"
                      />
                      <span className="font-mono text-xs">
                        {enrollment.progressPct}%
                      </span>
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

export default AdminEnrollmentsTable;
