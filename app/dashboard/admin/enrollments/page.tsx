import {
  adminEnrollments,
  adminCourses,
  findCourse,
  findUser,
} from "@/lib/admin/admin-data";
import type {
  AdminCourse,
  AdminEnrollment,
  AdminUser,
  AdminKpi,
} from "@/lib/admin/admin-data";

import { AdminStatStrip } from "@/components/AdminStatStrip/AdminStatStrip";
import { AdminEnrollmentsTable } from "@/components/AdminEnrollmentsTable/AdminEnrollmentsTable";

type Row = {
  readonly enrollment: AdminEnrollment;
  readonly student: AdminUser | null;
  readonly course: AdminCourse | null;
};

const page = () => {
  const rows: ReadonlyArray<Row> = adminEnrollments
    .slice()
    .reverse()
    .map((e) => ({
      enrollment: e,
      student: findUser(e.studentUserId),
      course: findCourse(e.courseId),
    }));

  const total = adminEnrollments.length;
  const liveCourses = adminCourses.filter((c) => c.status === "live");
  const avg = liveCourses.length
    ? Math.round(total / liveCourses.length)
    : 0;

  const items: ReadonlyArray<AdminKpi> = [
    { label: "Enrollments", value: String(total), trend: "up" },
    {
      label: "Avg / course",
      value: String(avg),
      hint: `${liveCourses.length} live courses`,
    },
    {
      label: "Median progress",
      value: (() => {
        const sorted = [...adminEnrollments]
          .map((e) => e.progressPct)
          .sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length === 0
          ? "0"
          : String(sorted[mid] ?? 0) + "%";
      })(),
    },
    {
      label: "Courses represented",
      value: String(adminCourses.length),
      hint: "Across all statuses",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Enrollments
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          All enrollments
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Every active enrollment across LearnHub. Filter by course, drill
          into a student, or kick off a new enrollment manually.
        </p>
      </header>

      <AdminStatStrip items={items} />

      <AdminEnrollmentsTable rows={rows} />
    </div>
  );
};

export default page;
