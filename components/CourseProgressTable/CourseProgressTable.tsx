import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EnrolledCourse } from "@/lib/dashboard/student-data";

type CourseProgressTableProps = {
  readonly courses: ReadonlyArray<EnrolledCourse>;
};

function statusVariant(
  status: EnrolledCourse["status"],
): "default" | "secondary" | "outline" {
  if (status === "completed") return "secondary";
  if (status === "at_risk") return "outline";
  return "default";
}

function statusLabel(status: EnrolledCourse["status"]): string {
  if (status === "completed") return "Completed";
  if (status === "at_risk") return "At risk";
  return "In progress";
}

// Server Component. Read-only student-scoped table.
// Uses shadcn/ui Table + Progress for inline progress bars; per AGENTS no
// custom <table> or hand-rolled rows.
export function CourseProgressTable({ courses }: CourseProgressTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 border-b sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Course portfolio
          </span>
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            Enrolled courses this term
          </CardTitle>
        </div>
        <Link
          href="/dashboard/student/courses"
          className="inline-flex items-center gap-1 self-start text-xs font-medium text-foreground/80 hover:text-foreground sm:self-auto"
        >
          View all
          <ChevronRight className="size-3" aria-hidden="true" />
        </Link>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Course</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead className="hidden md:table-cell">
                Next session
              </TableHead>
              <TableHead className="w-[180px]">Progress</TableHead>
              <TableHead className="text-right">Grade</TableHead>
              <TableHead className="pr-6 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="pl-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      {course.code}
                    </span>
                    <span className="font-medium leading-tight">
                      {course.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {course.instructor}
                </TableCell>
                <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                  {course.nextSession}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Progress
                      value={course.progress}
                      className="h-1.5 w-24 sm:w-32"
                    />
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      {course.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {course.grade}
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Badge variant={statusVariant(course.status)}>
                    {statusLabel(course.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default CourseProgressTable;
