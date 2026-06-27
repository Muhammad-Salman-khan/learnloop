import Link from "next/link";
import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminStatStrip } from "@/components/AdminStatStrip/AdminStatStrip";

import {
  adminStudents,
  adminUsers,
  findCourse,
  percentFromRow,
  resultRows,
  resultKindLabel,
} from "@/lib/staff/staff-data";
import { RESULT_KINDS } from "@/lib/staff/staff-data";
import {
  formatDateLong,
} from "@/lib/admin/formatters";

const page = () => {
  const total = resultRows.length;
  const totalStudents = adminStudents.length;
  const avgAll =
    resultRows.reduce((acc, r) => acc + percentFromRow(r), 0) / total;
  const coursesCounted = new Set(resultRows.map((r) => r.courseId)).size;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Staff · Results
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Master results
          </h1>
          <p className="max-w-[72ch] text-sm text-muted-foreground md:text-base">
            Every quiz, assignment, midterm, and final grade across all courses.
            Filter by course or batch in the table below.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/staff/results/export">
              <Download className="mr-1.5 size-3.5" />
              Export
            </Link>
          </Button>
        </div>
      </header>

      <AdminStatStrip
        items={[
          { label: "Result rows", value: String(total), hint: "Across the term" },
          { label: "Courses covered", value: String(coursesCounted) },
          { label: "Students with grades", value: String(totalStudents), hint: "All enrolled students have at least one" },
          { label: "Average %", value: `${avgAll.toFixed(0)}%`, trend: "up" },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {RESULT_KINDS.map((kind) => {
          const rows = resultRows.filter((r) => r.kind === kind);
          const avg =
            rows.length === 0
              ? 0
              : rows.reduce((acc, r) => acc + percentFromRow(r), 0) /
                rows.length;
          return (
            <Card key={kind} className="gap-2 py-5">
              <CardHeader className="px-5 pb-1">
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  {resultKindLabel(kind)}s
                </span>
              </CardHeader>
              <CardContent className="px-5 pt-0">
                <span className="font-display text-3xl font-medium tracking-tight">
                  {rows.length}
                </span>
                <CardDescription className="mt-1 text-xs">
                  Average scored {avg.toFixed(0)}%
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            All results joined
          </CardTitle>
          <CardDescription className="text-xs">
            {total} graded entries · grouped by course.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
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
              {resultRows
                .slice()
                .sort((a, b) =>
                  a.submittedOn < b.submittedOn ? 1 : -1,
                )
                .map((r) => {
                  const course = findCourse(r.courseId);
                  const student = adminUsers.find(
                    (u) => u.id === r.studentUserId,
                  );
                  const pct = percentFromRow(r);
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="pl-5">
                        <Link
                          href={`/dashboard/staff/results/${r.courseId}`}
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
                        {r.title}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="h-5 text-[10.5px]">
                          {r.kind.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden text-xs md:table-cell">
                        <Link
                          href={`/dashboard/staff/students/${r.studentUserId}/results`}
                          className="hover:underline"
                        >
                          {student?.name ?? "Unknown"}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                        {formatDateLong(r.submittedOn)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">
                        {r.score}/{r.maxScore}
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
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
