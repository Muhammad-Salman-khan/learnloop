import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  TrendingUp,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  adminEnrollments,
  findCourse,
  findUser,
} from "@/lib/admin/admin-data";
import { courseStatusLabel } from "@/lib/admin/admin-data";
import type { CourseStatus } from "@/lib/admin/admin-data";
import {
  formatCurrencyPKR,
  formatDateLong,
} from "@/lib/admin/formatters";

import { CourseStatusToggle } from "@/components/CourseStatusToggle/CourseStatusToggle";

const Detail = ({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}) => (
  <div className="flex flex-col gap-0.5 border-b py-2.5 last:border-b-0">
    <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
      {label}
    </span>
    <span className="text-sm">{value}</span>
  </div>
);

const statusVariant = (
  status: CourseStatus,
): "default" | "secondary" | "outline" => {
  if (status === "live") return "secondary";
  if (status === "draft") return "outline";
  return "default";
};

function FillPct({ pct }: { readonly pct: number }) {
  return (
    <div className="flex items-center gap-3">
      <Progress value={pct} className="h-2 w-40" />
      <span className="font-mono text-xs tabular-nums text-muted-foreground">
        {pct}%
      </span>
    </div>
  );
}

const page = ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  return params.then(async ({ courseId }) => {
    const course = findCourse(courseId);
    if (!course) notFound();
    const teacher = findUser(course.teacherUserId);
    const enrollments = adminEnrollments.filter(
      (e) => e.courseId === course.id,
    );
    const fillPct = Math.round((course.enrolled / course.capacity) * 100);

    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 gap-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/dashboard/admin/courses">
              <ArrowLeft className="size-3.5" />
              Back to courses
            </Link>
          </Button>
          <CourseStatusToggle
            courseId={course.id}
            code={course.code}
            status={course.status}
          />
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                    {course.code}
                  </span>
                  <Badge variant={statusVariant(course.status)}>
                    {courseStatusLabel(course.status)}
                  </Badge>
                </div>
                <h1 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                  {course.title}
                </h1>
                <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
                  {course.subtitle}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild className="gap-1.5">
                <Link href={`/dashboard/teacher/courses/${course.id}/edit`}>
                  <Pencil className="size-3.5" />
                  Edit
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                {course.title} ·
                <span className="ml-1 font-mono text-sm text-muted-foreground">
                  {course.code}
                </span>
              </CardTitle>
              <CardDescription className="text-xs">
                {course.summary}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
              <div>
                <Detail label="Code" value={course.code} />
                <Detail label="Title" value={course.title} />
                <Detail
                  label="Capacity"
                  value={`${course.enrolled} / ${course.capacity}`}
                />
                <Detail
                  label="Status"
                  value={courseStatusLabel(course.status)}
                />
              </div>
              <div>
                <Detail label="Teacher" value={teacher?.name ?? "—"} />
                <Detail
                  label="Fee per seat"
                  value={formatCurrencyPKR(course.feePerSeat)}
                />
                <Detail
                  label="Created"
                  value={formatDateLong(course.createdAt)}
                />
                <Detail
                  label="Last updated"
                  value={formatDateLong(course.createdAt)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                Enrollment
              </CardTitle>
              <CardDescription className="text-xs">
                Seats filled against total capacity.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <FillPct pct={fillPct} />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {course.enrolled} enrolled · {course.capacity - course.enrolled} open
                </span>
                <span>
                  Revenue <TrendingUp className="size-3.5" />
                </span>
              </div>
              <span className="font-display text-2xl font-medium">
                {formatCurrencyPKR(course.enrolled * course.feePerSeat)}
              </span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/admin/enrollments">
                  All enrollments
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg font-medium">
              Enrollments
            </CardTitle>
            <CardDescription className="text-xs">
              {enrollments.length} total · progress mocked.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Student</TableHead>
                  <TableHead className="hidden md:table-cell">Enrolled</TableHead>
                  <TableHead className="pr-5">Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="px-5 py-8 text-center text-xs text-muted-foreground"
                    >
                      No enrollments yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  enrollments.map((e) => {
                    const u = findUser(e.studentUserId);
                    return (
                      <TableRow key={e.id}>
                        <TableCell className="pl-5">
                          <Link
                            href={`/dashboard/admin/students/${e.studentUserId}`}
                            className="font-medium hover:underline"
                          >
                            {u?.name ?? e.studentUserId}
                          </Link>
                        </TableCell>
                        <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                          {formatDateLong(e.enrolledAt)}
                        </TableCell>
                        <TableCell className="pr-5">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={e.progressPct}
                              className="h-2 w-32"
                            />
                            <span className="font-mono text-xs">
                              {e.progressPct}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  });
};

export default page;
