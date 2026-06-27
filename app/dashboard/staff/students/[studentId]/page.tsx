import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ClipboardCheck,
  Mail,
  Pencil,
  Phone,
  Wallet,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  adminEnrollments,
  findCourse,
  findStudent,
  findUser,
  gpaForStudent,
  resultRows,
} from "@/lib/staff/staff-data";
import {
  feeRecords as feeSeed,
} from "@/lib/staff/staff-data";
import {
  feeStatusLabel,
} from "@/lib/admin/admin-data";
import {
  formatDateLong,
  initials,
  relativeTime,
} from "@/lib/admin/formatters";

type Params = Promise<{ studentId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { studentId } = await params;
  const student = findStudent(studentId);
  const user = findUser(studentId);
  if (!student || !user) {
    notFound();
  }

  const studentEnrollments = adminEnrollments.filter(
    (e) => e.studentUserId === studentId,
  );
  const enrolledCourses = studentEnrollments.map((e) => ({
    enrollment: e,
    course: findCourse(e.courseId),
  }));
  const studentResults = resultRows.filter(
    (r) => r.studentUserId === studentId,
  );

  const feeRows = feeSeed.filter((r) => r.studentUserId === studentId);

  const gpa = gpaForStudent(studentId);
  const avg = studentResults.length
    ? Math.round(
        studentResults.reduce((acc, r) => {
          const pct = r.maxScore > 0 ? (r.score / r.maxScore) * 100 : 0;
          return acc + pct;
        }, 0) / studentResults.length,
      )
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="size-16 rounded-lg">
            <AvatarFallback className="rounded-lg bg-primary text-base text-primary-foreground">
              {initials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Student profile
            </span>
            <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
              {user.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5" />
                {user.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-3.5" />
                {student.phoneNumber}
              </span>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em]">
                {student.rollNumber}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/staff/students/${studentId}/edit`}>
              <Pencil className="mr-1.5 size-3.5" />
              Edit student
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/dashboard/staff/fees/${studentId}`}>
              <Wallet className="mr-1.5 size-3.5" />
              Update fees
            </Link>
          </Button>
        </div>
      </header>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-[640px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="font-display text-lg font-medium">
                  Personal details
                </CardTitle>
                <CardDescription className="text-xs">
                  Snapshot of the StudentProfile. Edit in the{" "}
                  <Link
                    href={`/dashboard/staff/students/${studentId}/edit`}
                    className="underline"
                  >
                    edit form
                  </Link>
                  .
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-x-6 gap-y-3 text-sm md:grid-cols-2">
                  <Detail label="Roll number" value={student.rollNumber} mono />
                  <Detail
                    label="Class"
                    value={`${student.className} · Section ${student.section}`}
                  />
                  <Detail label="Father name" value={student.fatherName} />
                  <Detail label="Mother name" value={student.motherName} />
                  <Detail
                    label="Date of birth"
                    value={formatDateLong(student.dob)}
                  />
                  <Detail
                    label="Parent phone"
                    value={student.parentPhone}
                    mono
                  />
                  <Detail label="Address" value={student.address} wide />
                </dl>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                    Fee status
                  </span>
                  <CardTitle className="font-display text-lg font-medium">
                    {feeStatusLabel(student.feeStatus)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm">
                  <p className="text-muted-foreground">
                    Latest invoice is {feeRows[0] ? feeStatusLabel(feeRows[0].status) : "—"} for{" "}
                    {feeRows[0]?.monthLabel ?? "—"} cycle.
                  </p>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <Link href={`/dashboard/staff/fees/${studentId}`}>
                      Open ledger
                      <ArrowRight className="ml-1 size-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                    Academic standing
                  </span>
                  <CardTitle className="font-display text-lg font-medium">
                    GPA-style snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Letter grade</span>
                    <Badge variant="default" className="font-mono">
                      {gpa}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Avg. %</span>
                    <Badge variant="secondary" className="font-mono">
                      {avg}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Results on file</span>
                    <span className="font-mono text-xs">
                      {studentResults.length}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="mt-6">
          <Card>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="font-display text-lg font-medium">
                  Enrolled courses
                </CardTitle>
                <CardDescription className="text-xs">
                  Progress and teacher for each current enrollment.
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href={`/dashboard/staff/enrollments/new?student=${studentId}`}
                >
                  Enroll in another course →
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {enrolledCourses.length === 0 ? (
                  <li className="px-6 py-8 text-center text-xs text-muted-foreground">
                    No current enrollments.
                  </li>
                ) : (
                  enrolledCourses.map(({ enrollment, course }) => {
                    if (!course) return null;
                    const teacher = findUser(course.teacherUserId);
                    return (
                      <li
                        key={enrollment.id}
                        className="flex flex-col gap-2 px-6 py-3 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                            {course.code}
                          </span>
                          <Link
                            href={`/dashboard/staff/courses/${course.id}`}
                            className="text-sm font-medium hover:underline"
                          >
                            {course.title}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {teacher?.name ?? "TBA"} · enrolled{" "}
                            {formatDateLong(enrollment.enrolledAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="font-mono">
                            {enrollment.progressPct}%
                          </Badge>
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/dashboard/staff/courses/${course.id}`}
                            >
                              Open
                            </Link>
                          </Button>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          <Card>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="font-display text-lg font-medium">
                  Quiz & assignment scores
                </CardTitle>
                <CardDescription className="text-xs">
                  Every entry graded for this student, newest first.
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href={`/dashboard/staff/results/export?student=${studentId}`}
                >
                  Export this student →
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {studentResults.length === 0 ? (
                  <li className="px-6 py-8 text-center text-xs text-muted-foreground">
                    No results on file yet.
                  </li>
                ) : (
                  [...studentResults]
                    .sort((a, b) =>
                      a.submittedOn < b.submittedOn ? 1 : -1,
                    )
                    .map((r) => {
                      const course = findCourse(r.courseId);
                      const grader = findUser(r.gradedByUserId);
                      const pct = r.maxScore > 0 ? (r.score / r.maxScore) * 100 : 0;
                      return (
                        <li
                          key={r.id}
                          className="flex flex-col gap-2 px-6 py-3 md:flex-row md:items-center md:justify-between"
                        >
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                                {course?.code ?? r.courseId}
                              </span>
                              <Badge variant="outline" className="h-5 text-[10.5px]">
                                {r.kind.toUpperCase()}
                              </Badge>
                            </div>
                            <span className="text-sm font-medium">
                              {r.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {course?.title ?? "Course"} · graded by{" "}
                              {grader?.name ?? "—"} ·{" "}
                              {formatDateLong(r.submittedOn)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="font-mono">
                              {pct.toFixed(0)}%
                            </Badge>
                            <span className="font-mono text-xs text-muted-foreground">
                              {r.score}/{r.maxScore}
                            </span>
                          </div>
                        </li>
                      );
                    })
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="mt-6">
          <Card>
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="font-display text-lg font-medium">
                  Fee history
                </CardTitle>
                <CardDescription className="text-xs">
                  Three latest cycles are visible by default — open the ledger
                  for the full history.
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/dashboard/staff/fees/${studentId}`}>
                  Open ledger
                  <ArrowRight className="ml-1 size-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {feeRows.length === 0 ? (
                  <li className="px-6 py-8 text-center text-xs text-muted-foreground">
                    No fee records yet.
                  </li>
                ) : (
                  feeRows.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between gap-3 px-6 py-3"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {r.monthLabel}
                        </span>
                        <span className="font-mono text-sm">
                          PKR {r.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            r.status === "paid"
                              ? "secondary"
                              : r.status === "due"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {feeStatusLabel(r.status)}
                        </Badge>
                        {r.paidOn ? (
                          <span className="text-xs text-muted-foreground">
                            paid {relativeTime(r.paidOn)}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            last update {relativeTime(r.updatedAt)}
                          </span>
                        )}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick links */}
      <div className="grid gap-3 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Academic work</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href={`/dashboard/staff/courses`}>
                <ClipboardCheck className="mr-1.5 size-3.5" />
                Master results
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/dashboard/staff/schedule">
                Weekly timetable
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Notify</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href={`/dashboard/staff/notifications/new?student=${studentId}`}>
                Push a personalized alert
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function Detail({
  label,
  value,
  mono,
  wide,
}: {
  label: string;
  value: string;
  mono?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <dt className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd
        className={
          mono
            ? "mt-0.5 font-mono text-xs"
            : "mt-0.5 text-sm leading-snug"
        }
      >
        {value}
      </dd>
    </div>
  );
}

export default page;
