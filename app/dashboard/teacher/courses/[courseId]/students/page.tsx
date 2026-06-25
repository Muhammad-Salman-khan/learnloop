import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudentsTable } from "@/components/StudentsTable/StudentsTable";
import {
  findCourse,
  studentsByCourse,
} from "@/lib/dashboard/teacher-data";

const CourseStudentsPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;
  const course = findCourse(courseId);
  if (!course) notFound();

  const students = studentsByCourse[courseId] ?? [];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <section>
        <Badge variant="secondary" className="mb-2 font-mono uppercase tracking-[0.14em]">
          Students
        </Badge>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
              Enrolled students
            </h2>
            <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
              {students.length} of {course.students} shown. Filter by fee state
              or search by name to triage.
            </p>
          </div>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium tracking-tight">
            Roster
          </CardTitle>
          <CardDescription>
            Progress column shows roadmap completion for {course.code}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StudentsTable students={students} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseStudentsPage;
