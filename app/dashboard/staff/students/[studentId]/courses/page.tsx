import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";

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
  findUser,
} from "@/lib/staff/staff-data";
import { formatDateLong } from "@/lib/admin/formatters";

type Params = Promise<{ studentId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { studentId } = await params;
  const student = findStudent(studentId);
  const user = findUser(studentId);
  if (!student || !user) {
    notFound();
  }

  const enrollments = adminEnrollments
    .filter((e) => e.studentUserId === studentId)
    .map((e) => ({
      enrollment: e,
      course: findCourse(e.courseId),
    }))
    .filter(({ course }) => course !== null);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {user.name} · Courses
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Enrolled courses
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            All courses currently assigned to {user.name}. Roll #{" "}
            <span className="font-mono">{student.rollNumber}</span>.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link
            href={`/dashboard/staff/enrollments/new?student=${studentId}`}
          >
            <Plus className="mr-1.5 size-3.5" />
            Enroll in another
          </Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Current enrollment
          </CardTitle>
          <CardDescription className="text-xs">
            {enrollments.length} courses · progress averaged across the term.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {enrollments.length === 0 ? (
              <li className="px-6 py-8 text-center text-xs text-muted-foreground">
                No active enrollments.
              </li>
            ) : (
              enrollments.map(({ enrollment, course }) => {
                if (!course) return null;
                const teacher = findUser(course.teacherUserId);
                return (
                  <li
                    key={enrollment.id}
                    className="flex items-center justify-between gap-3 px-6 py-3"
                  >
                    <div className="flex flex-col gap-1">
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
                          Open course
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
    </div>
  );
};

export default page;
