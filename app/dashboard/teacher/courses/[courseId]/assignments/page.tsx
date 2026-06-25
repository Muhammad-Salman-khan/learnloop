import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  assignmentsByCourse,
  findCourse,
} from "@/lib/dashboard/teacher-data";

type Params = { courseId: string };

// Server Component. List view of every assignment in a course with sub-status
// counts and a click-through to per-assignment detail / submissions.
const CourseAssignmentsPage = async ({
  params,
}: {
  params: Promise<Params>;
}) => {
  const { courseId } = await params;
  const course = findCourse(courseId);
  if (!course) notFound();
  const assignments = assignmentsByCourse[courseId] ?? [];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit gap-2 text-muted-foreground hover:text-foreground"
      >
        <Link href={`/dashboard/teacher/courses/${courseId}`}>
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to course
        </Link>
      </Button>

      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {course.code} · Assignments
        </span>
        <h1 className="font-display text-3xl font-medium leading-[1.05] tracking-tight text-balance md:text-4xl">
          Assignments
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground">
          Every assignment for {course.title}, with submission status and a
          link into per-assignment submissions.
        </p>
      </header>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            All assignments
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Open an assignment to grade submissions or edit its settings.
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Title</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due</TableHead>
                <TableHead className="hidden md:table-cell text-right">
                  Submitted / Total
                </TableHead>
                <TableHead className="hidden lg:table-cell text-right">
                  Graded
                </TableHead>
                <TableHead className="pr-6 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((a) => {
                const submissionPct =
                  a.totalStudents === 0
                    ? 0
                    : Math.round((a.submitted / a.totalStudents) * 100);
                return (
                  <TableRow key={a.id}>
                    <TableCell className="pl-6">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium leading-tight">
                          {a.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {a.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm md:table-cell text-muted-foreground capitalize">
                      {a.type}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          a.status === "open"
                            ? "default"
                            : a.status === "draft"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {a.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(a.dueAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="hidden text-right md:table-cell font-mono tabular-nums">
                      <span className="text-muted-foreground">
                        {a.submitted} / {a.totalStudents}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({submissionPct}%)
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-right lg:table-cell font-mono tabular-nums">
                      {a.graded}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/dashboard/teacher/courses/${courseId}/assignments/${a.id}/submissions`}
                        >
                          Review
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {assignments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="pr-6 pl-6 text-center text-sm text-muted-foreground"
                  >
                    No assignments on this course yet.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseAssignmentsPage;
