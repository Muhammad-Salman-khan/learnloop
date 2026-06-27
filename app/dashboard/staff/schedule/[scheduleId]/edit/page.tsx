import { notFound } from "next/navigation";

import { ScheduleForm } from "@/components/ScheduleForm/ScheduleForm";
import {
  adminCourses,
  adminUsers,
  findScheduleEntry,
} from "@/lib/staff/staff-data";

type Params = Promise<{ scheduleId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { scheduleId } = await params;
  const entry = findScheduleEntry(scheduleId);
  if (!entry) {
    notFound();
  }

  const teachers = adminUsers.filter(
    (u) =>
      u.role === "teacher" || u.role === "staff" || u.role === "admin",
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Edit · slot {entry.id.toUpperCase()}
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Edit schedule entry
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Save changes for day, time, room, or recurrence. The slot will be
          updated in the master timetable immediately.
        </p>
      </header>

      <ScheduleForm
        mode="edit"
        courses={adminCourses}
        teachers={teachers}
        cancelHref="/dashboard/staff/schedule"
        defaults={{
          courseId: entry.courseId,
          teacherUserId: entry.teacherUserId,
          day: entry.day,
          startTime: entry.startTime,
          endTime: entry.endTime,
          room: entry.room,
          recurrence: entry.recurrence,
          notes: entry.notes ?? "",
        }}
      />
    </div>
  );
};

export default page;
