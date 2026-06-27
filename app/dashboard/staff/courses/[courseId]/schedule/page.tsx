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

import { StaffCourseScheduleTable } from "@/components/StaffCourseScheduleTable/StaffCourseScheduleTable";
import {
  findCourse,
  scheduleEntries,
} from "@/lib/staff/staff-data";

type Params = Promise<{ courseId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { courseId } = await params;
  const course = findCourse(courseId);
  if (!course) {
    notFound();
  }

  const mySlots = scheduleEntries.filter((s) => s.courseId === courseId);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {course.code} · Schedule
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Weekly slots
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            {mySlots.length} sessions scheduled for {course.title}.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/dashboard/staff/schedule/new">
            <Plus className="mr-1.5 size-3.5" />
            Add slot
          </Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Day-by-day view
          </CardTitle>
          <CardDescription className="text-xs">
            Pick a weekday to see the slots for that day.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaffCourseScheduleTable slots={mySlots} />
        </CardContent>
      </Card>

      {mySlots.length === 0 ? (
        <p className="px-2 text-xs text-muted-foreground">
          No slots exist for this course yet — use the Set Schedule page to
          create one.
        </p>
      ) : null}
    </div>
  );
};

export default page;
