import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EditCourseForm } from "@/components/EditCourseForm/EditCourseForm";
import {
  findCourse,
  type TeacherCourse,
} from "@/lib/dashboard/teacher-data";
import type { NewCourseFormValues } from "@/lib/dashboard/new-course-schema";

function courseToFormValues(course: TeacherCourse): NewCourseFormValues {
  const numericFee = Number(course.feePerSeat.replace(/[^0-9.]/g, "")) || 0;
  const fee = course.feePerSeat.startsWith("$") ? course.feePerSeat : `$${numericFee}`;
  return {
    code: course.code,
    title: course.title,
    subtitle: course.subtitle,
    status: course.status,
    feePerSeat: fee,
    description: `${course.subtitle}. ${course.modules}-module course with ${course.materials} materials and ${course.assignments} assignments managed by Salman Khan.`,
    seats: Math.max(20, Math.round(course.students * 1.2)),
    notifyOnSubmission: true,
  };
}

const EditCoursePage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;
  const course = findCourse(courseId);
  if (!course) notFound();

  const defaults = courseToFormValues(course);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <section>
        <Badge variant="secondary" className="mb-2 font-mono uppercase tracking-[0.14em]">
          Edit · {course.code}
        </Badge>
        <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
          Edit course details
        </h2>
        <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
          Changes propagate to the catalogue immediately. Students with active
          enrolment keep their existing progress.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium tracking-tight">
            Course details
          </CardTitle>
          <CardDescription>
            Saved automatically. Use the discard button to revert.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditCourseForm defaults={defaults} courseId={course.id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCoursePage;
