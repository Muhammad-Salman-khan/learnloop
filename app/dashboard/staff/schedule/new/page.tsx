import { ScheduleForm } from "@/components/ScheduleForm/ScheduleForm";
import {
  adminCourses,
  adminUsers,
} from "@/lib/staff/staff-data";

const page = () => {
  const teachers = adminUsers.filter(
    (u) => u.role === "teacher" || u.role === "staff" || u.role === "admin",
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Staff · Schedule
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Add a slot
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Pick the course and teacher, then specify the day, time, room, and
          recurrence. Recurring slots repeat weekly unless flagged as one-off.
        </p>
      </header>

      <ScheduleForm
        mode="create"
        courses={adminCourses}
        teachers={teachers}
        cancelHref="/dashboard/staff/schedule"
      />
    </div>
  );
};

export default page;
