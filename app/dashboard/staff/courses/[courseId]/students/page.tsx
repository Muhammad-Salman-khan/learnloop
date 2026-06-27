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

import { StaffCourseRosterTable } from "@/components/StaffCourseRosterTable/StaffCourseRosterTable";
import {
  adminEnrollments,
  findCourse,
  findStudent,
  findUser,
} from "@/lib/staff/staff-data";
import { formatDateLong } from "@/lib/admin/formatters";

type Params = Promise<{ courseId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { courseId } = await params;
  const course = findCourse(courseId);
  if (!course) {
    notFound();
  }
  const teacher = findUser(course.teacherUserId);

  const rows = adminEnrollments
    .filter((e) => e.courseId === courseId)
    .map((e) => {
      const student = findStudent(e.studentUserId);
      const user = findUser(e.studentUserId);
      if (!student || !user) return null;
      return {
        enrollment: e,
        student,
        user,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {course.code} · Roster
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Enrolled students
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            {rows.length} students currently on {course.title}. Taught by{" "}
            {teacher?.name ?? "—"} · enrolled{" "}
            {formatDateLong(course.createdAt)}.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link
            href={`/dashboard/staff/enrollments/new?course=${courseId}`}
          >
            <Plus className="mr-1.5 size-3.5" />
            Enroll another
          </Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Course roster
          </CardTitle>
          <CardDescription className="text-xs">
            Search by name or filter by fee status. Paginates 10 rows per page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaffCourseRosterTable rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
