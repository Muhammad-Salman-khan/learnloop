import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  submissionsByAssignment,
} from "@/lib/dashboard/teacher-data";

type Params = { courseId: string; assignmentId: string };

const CourseAssignmentSubmissionsPage = async ({
  params,
}: {
  params: Promise<Params>;
}) => {
  const { courseId, assignmentId } = await params;
  const course = findCourse(courseId);
  if (!course) notFound();
  const assignment = (assignmentsByCourse[courseId] ?? []).find(
    (a) => a.id === assignmentId,
  );
  if (!assignment) notFound();
  const submissions = submissionsByAssignment[assignmentId] ?? [];
  const totalStudentsForAssignment = assignment.totalStudents;
  const lateCount = submissions.filter((s) => s.status === "late").length;
  const gradedCount = submissions.filter((s) => s.status === "graded").length;
  const pendingCount = submissions.filter(
    (s) => s.status === "pending",
  ).length;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit gap-2 text-muted-foreground hover:text-foreground"
      >
        <Link href={`/dashboard/teacher/courses/${courseId}/assignments`}>
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to assignments
        </Link>
      </Button>

      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {course.code} · {assignment.title}
        </span>
        <h1 className="font-display text-3xl font-medium leading-[1.05] tracking-tight text-balance md:text-4xl">
          Submissions
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground">
          Every submission from the cohort. Sort, filter by status, and open
          one to grade inline.
        </p>
      </header>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            Status roll-up
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Quick read of where this assignment cohorts stands on grading.
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Bucket</TableHead>
                <TableHead className="pr-6 text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="pl-6 font-medium">Graded</TableCell>
                <TableCell className="pr-6 text-right font-mono tabular-nums">
                  <Badge variant="default">{gradedCount}</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6 font-medium">Pending review</TableCell>
                <TableCell className="pr-6 text-right font-mono tabular-nums">
                  <Badge variant="secondary">{pendingCount}</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6 font-medium">Late</TableCell>
                <TableCell className="pr-6 text-right font-mono tabular-nums">
                  <Badge variant="outline">{lateCount}</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6 font-medium">Cohort size</TableCell>
                <TableCell className="pr-6 text-right font-mono tabular-nums text-muted-foreground">
                  {totalStudentsForAssignment}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            All submissions
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Inline grade, leave feedback, send back for revision. Each row is
            one student.
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Student</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell text-right">
                  Score
                </TableHead>
                <TableHead className="hidden md:table-cell">Feedback</TableHead>
                <TableHead className="hidden lg:table-cell text-right">
                  Files
                </TableHead>
                <TableHead className="pr-6 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar
                        size="sm"
                        className="size-8 ring-1 ring-foreground/10"
                        aria-hidden="true"
                      >
                        <AvatarFallback className="text-[10.5px]">
                          {s.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium leading-tight">
                        {s.studentName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {new Date(s.submittedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        s.status === "graded"
                          ? "default"
                          : s.status === "late"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-right md:table-cell font-mono tabular-nums">
                    {s.score === null
                      ? <span className="text-muted-foreground">—</span>
                      : <span>{s.score} / {assignment.totalMarks}</span>}
                  </TableCell>
                  <TableCell className="hidden text-sm md:table-cell text-muted-foreground line-clamp-1 max-w-[18rem]">
                    {s.feedback ?? "—"}
                  </TableCell>
                  <TableCell className="hidden text-right lg:table-cell font-mono tabular-nums text-muted-foreground">
                    {s.attachments}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/dashboard/teacher/courses/${courseId}/assignments/${assignmentId}`}
                      >
                        Open
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="pr-6 pl-6 text-center text-sm text-muted-foreground"
                  >
                    No submissions recorded for this assignment yet.
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

export default CourseAssignmentSubmissionsPage;
