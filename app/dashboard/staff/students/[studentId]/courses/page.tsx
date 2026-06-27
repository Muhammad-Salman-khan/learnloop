import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { StaffStudentEnrollmentsList } from "@/components/StaffStudentEnrollmentsList/StaffStudentEnrollmentsList";
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

  const enrolledCourses = adminEnrollments
    .filter((e) => e.studentUserId === studentId)
    .map((e) => ({
      enrollment: e,
      course: findCourse(e.courseId),
    }));

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
            {enrolledCourses.length} courses · paginated 10 per page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaffStudentEnrollmentsList
            rows={enrolledCourses.map(({ enrollment, course }) => ({
              enrollment,
              course: course ?? null,
            }))}
          />
        </CardContent>
      </Card>

      <p className="text-[11px] text-muted-foreground">
        Enrolled since{" "}
        <span className="font-mono">
          {formatDateLong(student.enrollmentDate)}
        </span>
        .
      </p>
    </div>
  );
};

export default page;
