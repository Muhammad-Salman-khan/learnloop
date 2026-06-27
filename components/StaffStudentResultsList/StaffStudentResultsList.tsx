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
  AdminUser,
  ResultRow,
} from "@/lib/staff/staff-data";
import {
  resultKindLabel,
  percentFromRow,
  gradeLetter,
} from "@/lib/staff/staff-data";
import { usePaginator } from "@/lib/hooks/usePagination";
import { TablePagination } from "@/components/TablePagination/TablePagination";
import { formatDateLong } from "@/lib/admin/formatters";

export type StudentResultRow = {
  readonly result: ResultRow;
  readonly course: AdminCourse | null;
  readonly grader: AdminUser | null;
};

type StaffStudentResultsListProps = {
  readonly rows: ReadonlyArray<StudentResultRow>;
};

export function StaffStudentResultsList({
  rows,
}: StaffStudentResultsListProps) {
  const [query, setQuery] = useState("");

  const sorted = useMemo(
    () =>
      [...rows].sort((a, b) =>
        a.result.submittedOn < b.result.submittedOn ? 1 : -1,
      ),
    [rows],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(({ result, course }) =>
      result.title.toLowerCase().includes(q) ||
      (course?.title.toLowerCase().includes(q) ?? false) ||
      (course?.code.toLowerCase().includes(q) ?? false),
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
          placeholder="Filter result title or course"
          className="h-9 text-sm"
        />
      </div>

      {/* Desktop */}
      <div className="hidden overflow-hidden rounded-md border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Title</TableHead>
              <TableHead className="hidden md:table-cell">Course</TableHead>
              <TableHead className="hidden md:table-cell">Kind</TableHead>
              <TableHead className="hidden md:table-cell">Submitted</TableHead>
              <TableHead className="hidden md:table-cell">Grader</TableHead>
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
                    ? "No results on file yet."
                    : "Nothing on this page."}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map(({ result, course, grader }) => {
                const pct = percentFromRow(result);
                return (
                  <TableRow key={result.id}>
                    <TableCell className="pl-5">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="h-5 text-[10.5px]"
                          >
                            {resultKindLabel(result.kind).toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">
                            {result.title}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Grade {gradeLetter(pct)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-xs md:table-cell">
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                        {course?.code ?? "—"}
                      </span>
                      <span className="block text-xs">
                        {course?.title ?? "Untitled"}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="h-5 text-[10.5px]">
                        {resultKindLabel(result.kind).toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                      {formatDateLong(result.submittedOn)}
                    </TableCell>
                    <TableCell className="hidden text-xs md:table-cell">
                      {grader?.name ?? "—"}
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
              ? "No results on file yet."
              : "Nothing on this page."}
          </div>
        ) : (
          pageRows.map(({ result, course, grader }) => {
            const pct = percentFromRow(result);
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
                  { label: "Title", value: result.title },
                  {
                    label: "Course",
                    value: course
                      ? `${course.code} · ${course.title}`
                      : "Untitled",
                  },
                  {
                    label: "Submitted",
                    value: formatDateLong(result.submittedOn),
                  },
                  { label: "Grader", value: grader?.name ?? "—" },
                  {
                    label: "Score",
                    value: `${result.score}/${result.maxScore}`,
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
            );
          })
        )}
      </MobileCardList>

      <TablePagination paginator={paginator} />
    </div>
  );
}

export default StaffStudentResultsList;
