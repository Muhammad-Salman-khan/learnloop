import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarClock, Plus, Users } from "lucide-react";

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
  adminEnrollments,
  findCourse,
  findStudent,
  findTeacher,
  findUser,
  scheduleEntries,
} from "@/lib/staff/staff-data";
import {
  courseStatusLabel,
} from "@/lib/admin/admin-data";
import {
  formatCurrencyPKR,
  formatDateLong,
} from "@/lib/admin/formatters";

type Params = Promise<{ courseId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { courseId } = await params;
  const course = findCourse(courseId);
  if (!course) {
    notFound();
  }

  const teacher = findTeacher(course.teacherUserId);
  const teacherUser = findUser(course.teacherUserId);

  const studentRows = adminEnrollments
    .filter((e) => e.courseId === courseId)
    .map((e) => {
      const student = findStudent(e.studentUserId);
      const user = findUser(e.studentUserId);
      return student && user
        ? {
            enrollment: e,
            student,
            user,
          }
        : null;
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  const slots = scheduleEntries
    .filter((s) => s.courseId === courseId)
    .sort((a, b) => {
      const order = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
      const da = order.indexOf(a.day) - order.indexOf(b.day);
      if (da !== 0) return da;
      return a.startTime.localeCompare(b.startTime);
    });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {course.code}
          </span>
          <Badge
            variant={
              course.status === "live"
                ? "secondary"
                : course.status === "draft"
                  ? "outline"
                  : "ghost"
            }
          >
            {courseStatusLabel(course.status)}
          </Badge>
        </div>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
              {course.title}
            </h1>
            <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
              {course.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/dashboard/staff/courses/${courseId}/students`}
              >
                <Users className="mr-1.5 size-3.5" />
                Roster
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/staff/courses/${courseId}/schedule`}>
                <CalendarClock className="mr-1.5 size-3.5" />
                Schedule
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link
                href={`/dashboard/staff/enrollments/new?course=${courseId}`}
              >
                <Plus className="mr-1.5 size-3.5" />
                Enroll student
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Course summary
            </span>
            <CardTitle className="font-display text-lg font-medium">
              {course.summary}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-x-6 gap-y-3 text-sm md:grid-cols-3">
              <Detail
                label="Created"
                value={formatDateLong(course.createdAt)}
              />
              <Detail
                label="Teacher"
                value={teacherUser?.name ?? "—"}
              />
              <Detail
                label="Capacity"
                value={`${course.enrolled} / ${course.capacity}`}
              />
              <Detail
                label="Fee per seat"
                value={formatCurrencyPKR(course.feePerSeat)}
              />
              <Detail
                label="Status"
                value={courseStatusLabel(course.status)}
              />
              <Detail
                label="Weekly slots"
                value={String(slots.length)}
              />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Quick actions
            </span>
            <CardTitle className="font-display text-lg font-medium">
              What you can do here
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/staff/results/${courseId}`}>
                View results
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/staff/results/export?course=${courseId}`}>
                Export results card
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/staff/schedule/new">
                Add a teaching slot
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Teacher
              </span>
              <CardTitle className="font-display text-lg font-medium">
                {teacherUser?.name ?? "—"}
              </CardTitle>
              <CardDescription className="text-xs">
                {teacher?.subjectProficiency.join(", ") ?? "—"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href={`/dashboard/staff/teachers/${course.teacherUserId}`}
              >
                Open profile →
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {teacher?.bio ?? "No bio on file."}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Roster
              </span>
              <CardTitle className="font-display text-lg font-medium">
                {studentRows.length} students enrolled
              </CardTitle>
              <CardDescription className="text-xs">
                Sorted by enrollment date.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/staff/courses/${courseId}/students`}>
                View full roster →
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {studentRows.slice(0, 4).map((row) => (
                <li
                  key={row.enrollment.id}
                  className="flex items-center justify-between gap-3 px-6 py-3 text-sm"
                >
                  <Link
                    href={`/dashboard/staff/students/${row.user.id}`}
                    className="flex flex-col gap-0.5 hover:underline"
                  >
                    <span className="font-medium">{row.user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {row.student.rollNumber} · Sec {row.student.section}
                    </span>
                  </Link>
                  <Badge variant="secondary" className="font-mono">
                    {row.enrollment.progressPct}%
                  </Badge>
                </li>
              ))}
              {studentRows.length === 0 ? (
                <li className="px-6 py-8 text-center text-xs text-muted-foreground">
                  No students enrolled yet.
                </li>
              ) : null}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Schedule
            </span>
            <CardTitle className="font-display text-lg font-medium">
              Slots owned by this course
            </CardTitle>
            <CardDescription className="text-xs">
              {slots.length} slots this term.
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/staff/courses/${courseId}/schedule`}>
              Open schedule →
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {slots.length === 0 ? (
              <li className="px-6 py-8 text-center text-xs text-muted-foreground">
                No teaching slots scheduled.
              </li>
            ) : (
              slots.slice(0, 5).map((slot) => (
                <li
                  key={slot.id}
                  className="flex items-center justify-between gap-3 px-6 py-3 text-sm"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      {slot.day.toUpperCase()} · {slot.startTime}–
                      {slot.endTime}
                    </span>
                    <span className="font-medium">Room {slot.room}</span>
                    <span className="text-xs text-muted-foreground">
                      {slot.notes ?? "—"}
                    </span>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    {slot.recurrence}
                  </Badge>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm leading-snug">{value}</dd>
    </div>
  );
}

export default page;
