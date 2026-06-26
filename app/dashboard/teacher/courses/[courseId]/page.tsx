import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  ClipboardList,
  FileText,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  assignmentsByCourse,
  findCourse,
  materialsByCourse,
  roadmapByCourse,
} from "@/lib/dashboard/teacher-data";
import { relativeTime } from "@/lib/dashboard/date-utils";

const CourseOverviewPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;
  const course = findCourse(courseId);
  if (!course) notFound();

  const modules = roadmapByCourse[courseId] ?? [];
  const materials = materialsByCourse[courseId] ?? [];
  const assignments = assignmentsByCourse[courseId] ?? [];

  const submissionRate = course.students === 0
    ? 0
    : Math.round(
        (assignments.reduce((acc, a) => acc + a.submitted, 0) /
          (assignments.length * course.students || 1)) *
          100,
      );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <section className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <Badge variant="secondary" className="mb-2 font-mono uppercase tracking-[0.14em]">
            Overview · demo data
          </Badge>
          <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
            Course snapshot
          </h2>
          <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
            {course.students} students enrolled, {modules.length} modules, {materials.length} materials, {assignments.length} assignments.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 self-start md:self-auto">
          <Button asChild variant="outline" className="gap-2">
            <Link href={`/dashboard/teacher/courses/${courseId}/roadmap`}>
              <Sparkles className="size-3.5" aria-hidden="true" />
              Roadmap
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href={`/dashboard/teacher/courses/${courseId}/materials`}>
              <FileText className="size-3.5" aria-hidden="true" />
              Materials
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href={`/dashboard/teacher/courses/${courseId}/gradebook`}>
              <GraduationCap className="size-3.5" aria-hidden="true" />
              Gradebook
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href={`/dashboard/teacher/courses/${courseId}/assignments`}>
              <ClipboardList className="size-3.5" aria-hidden="true" />
              Assignments
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Students" value={course.students} sub="enrolled" />
        <Stat label="Modules" value={modules.length} sub="in roadmap" />
        <Stat label="Materials" value={materials.length} sub="published" />
        <Stat label="Assignments" value={assignments.length} sub={`${submissionRate}% submission rate`} />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg font-medium tracking-tight">
              Progress snapshot
            </CardTitle>
            <CardDescription>
              Average roadmap completion across enrolled students.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-4xl font-medium leading-none tracking-tight">
                {course.progressPct}%
              </span>
              <span className="text-xs text-muted-foreground">
                updated {relativeTime(course.updatedAt)}
              </span>
            </div>
            <Progress value={course.progressPct} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Cohort-wide. Open the student tab to see the per-learner detail.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg font-medium tracking-tight">
              What needs attention
            </CardTitle>
            <CardDescription>
              Quick actions grouped by priority.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <ActionRow
              href={`/dashboard/teacher/courses/${courseId}/assignments`}
              title="Grade pending submissions"
              detail={`${assignments.reduce((a, x) => a + (x.submitted - x.graded), 0)} ungraded across ${assignments.length} assignments`}
            />
            <ActionRow
              href={`/dashboard/teacher/courses/${courseId}/materials`}
              title="Review material library"
              detail={`${materials.length} materials indexed · ${materials.reduce((a, m) => a + m.chunks, 0)} total chunks`}
            />
            <ActionRow
              href={`/dashboard/teacher/courses/${courseId}/students`}
              title="Audit enrollment"
              detail={`${course.students} students · ${course.feePerSeat}/seat`}
            />
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-medium tracking-tight">
              Recent assignments
            </h3>
            <p className="text-sm text-muted-foreground">
              Next three deadlines ordered by due date.
            </p>
          </div>
          <Link
            href={`/dashboard/teacher/courses/${courseId}/assignments`}
            className="text-sm font-medium text-foreground/80 hover:text-foreground"
          >
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {assignments.slice(0, 3).map((a) => (
            <Link
              key={a.id}
              href={`/dashboard/teacher/courses/${courseId}/assignments/${a.id}`}
              className="group rounded-lg border bg-card p-4 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <Badge variant="outline" className="font-mono text-[10.5px]">
                  {a.type}
                </Badge>
                <span>due {relativeTime(a.dueAt)}</span>
              </div>
              <p className="mt-2 text-sm font-medium leading-tight">{a.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {a.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {a.submitted}/{course.students} submitted
                </span>
                <span className="inline-flex items-center gap-1 text-foreground/80 group-hover:text-foreground">
                  Open <ArrowUpRight className="size-3" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-3xl font-medium leading-none tracking-tight">
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

function ActionRow({
  href,
  title,
  detail,
}: {
  href: string;
  title: string;
  detail: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start justify-between gap-3 rounded-md border bg-background px-3 py-2.5 transition-colors hover:bg-muted/40"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="line-clamp-1 text-xs text-muted-foreground">{detail}</p>
      </div>
      <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" aria-hidden="true" />
    </Link>
  );
}

export default CourseOverviewPage;
