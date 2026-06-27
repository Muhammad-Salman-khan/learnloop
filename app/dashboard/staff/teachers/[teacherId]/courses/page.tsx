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

import { StaffCoursesTable } from "@/components/StaffCoursesTable/StaffCoursesTable";
import {
  findCourse,
  findTeacher,
  findUser,
} from "@/lib/staff/staff-data";

type Params = Promise<{ teacherId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { teacherId } = await params;
  const teacher = findTeacher(teacherId);
  const user = findUser(teacherId);
  if (!teacher || !user) {
    notFound();
  }

  const courses = teacher.assignedCourseIds
    .map((id) => findCourse(id))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {user.name} · Courses
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Assigned courses
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            All courses currently taught by {user.name}. Open a course to view
            rosters, schedule, and results for that subject.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/dashboard/staff/schedule/new">
            <Plus className="mr-1.5 size-3.5" />
            Add a teaching slot
          </Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Course catalogue
          </CardTitle>
          <CardDescription className="text-xs">
            {courses.length} courses · paging 10 per page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaffCoursesTable
            rows={courses.map((course) => ({
              course,
              teacher: user,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
