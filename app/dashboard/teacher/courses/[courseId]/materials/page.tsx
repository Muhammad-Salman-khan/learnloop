import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MaterialsList } from "@/components/MaterialsList/MaterialsList";
import { findCourse, materialsByCourse } from "@/lib/dashboard/teacher-data";

const CourseMaterialsPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;
  const course = findCourse(courseId);
  if (!course) notFound();

  const materials = materialsByCourse[courseId] ?? [];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <section>
        <Badge variant="secondary" className="mb-2 font-mono uppercase tracking-[0.14em]">
          Materials · demo data
        </Badge>
        <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
          Course materials
        </h2>
        <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
          Upload PDFs to auto-summarise, chat, and generate quizzes. Indexed
          chunks power the AI tutor for enrolled students.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium tracking-tight">
            Library
          </CardTitle>
          <CardDescription>
            {materials.length} materials currently linked to {course.code}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MaterialsList courseId={courseId} initial={materials} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseMaterialsPage;
