import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  CircleCheck,
  CircleDashed,
  FileText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  assignmentsByCourse,
  findCourse,
} from "@/lib/dashboard/teacher-data";

type Params = { courseId: string; assignmentId: string };

const CourseAssignmentDetailPage = async ({
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
  const dueLabel = new Date(assignment.dueAt).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
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

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2 text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>{course.code}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{assignment.type}</span>
            </div>
            <CardTitle className="font-display text-2xl font-medium tracking-tight">
              {assignment.title}
            </CardTitle>
            <p className="max-w-[60ch] text-sm text-muted-foreground">
              {assignment.description}
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Status
              </p>
              <Badge
                variant={
                  assignment.status === "open"
                    ? "default"
                    : assignment.status === "draft"
                      ? "secondary"
                      : "outline"
                }
              >
                {assignment.status}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Due
              </p>
              <p className="inline-flex items-center gap-2 text-sm">
                <CalendarClock
                  className="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                {dueLabel}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Submitted
              </p>
              <p className="inline-flex items-center gap-2 text-sm font-mono tabular-nums">
                <CircleCheck
                  className="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                {assignment.submitted} / {assignment.totalStudents}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Graded
              </p>
              <p className="inline-flex items-center gap-2 text-sm font-mono tabular-nums">
                <CircleDashed
                  className="size-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                {assignment.graded}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            Submissions
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Every submission from the enrolled cohort, with status and any
            inline feedback left so far.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <Button asChild>
            <Link
              href={`/dashboard/teacher/courses/${courseId}/assignments/${assignmentId}/submissions`}
            >
              <FileText className="size-3.5" aria-hidden="true" />
              Open submissions board
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Separator />
    </div>
  );
};

export default CourseAssignmentDetailPage;
