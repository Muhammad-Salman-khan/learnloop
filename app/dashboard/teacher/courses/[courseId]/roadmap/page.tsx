import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RoadmapBuilder } from "@/components/RoadmapBuilder/RoadmapBuilder";
import { findCourse, roadmapByCourse } from "@/lib/dashboard/teacher-data";

const CourseRoadmapPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;
  const course = findCourse(courseId);
  if (!course) notFound();

  const modules = roadmapByCourse[courseId] ?? [];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-8 md:py-10">
      <section>
        <Badge variant="secondary" className="mb-2 font-mono uppercase tracking-[0.14em]">
          Roadmap · demo data
        </Badge>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <h2 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
              Curriculum roadmap
            </h2>
            <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
              Drop modules to reorder. Edits stay local until you save.
            </p>
          </div>
          <div className="flex gap-2 self-start text-xs text-muted-foreground md:self-auto">
            <span className="rounded-md border bg-muted/40 px-2 py-1">
              {modules.length} modules
            </span>
            <span className="rounded-md border bg-muted/40 px-2 py-1">
              {modules.reduce((a, m) => a + m.lessons, 0)} lessons
            </span>
            <span className="rounded-md border bg-muted/40 px-2 py-1">
              {modules.reduce((a, m) => a + m.minutes, 0)} min
            </span>
          </div>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium tracking-tight">
            Modules
          </CardTitle>
          <CardDescription>
            Each module groups a few lessons students will work through in order.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoadmapBuilder courseId={courseId} initial={modules} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseRoadmapPage;
