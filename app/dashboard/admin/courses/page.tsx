import {
  adminCourses,
  adminEnrollments,
  adminTeachers,
  findUser,
} from "@/lib/admin/admin-data";
import type { AdminKpi } from "@/lib/admin/admin-data";
import type { AdminUser } from "@/lib/admin/admin-data";

import { AdminStatStrip } from "@/components/AdminStatStrip/AdminStatStrip";
import { AdminCoursesTable } from "@/components/AdminCoursesTable/AdminCoursesTable";

type Row = {
  readonly course: typeof adminCourses[number];
  readonly teacher: AdminUser | null;
};

const page = () => {
  const rows: ReadonlyArray<Row> = adminCourses.map((c) => ({
    course: c,
    teacher: findUser(c.teacherUserId),
  }));

  const live = adminCourses.filter((c) => c.status === "live").length;
  const draft = adminCourses.filter((c) => c.status === "draft").length;
  const archived = adminCourses.filter((c) => c.status === "archived")
    .length;
  const totalFeePerSeat = adminCourses.reduce(
    (acc, c) => acc + c.feePerSeat,
    0,
  );
  const totalEnrollments = adminEnrollments.length;

  const items: ReadonlyArray<AdminKpi> = [
    {
      label: "Total courses",
      value: String(adminCourses.length),
      hint: `${live} live · ${draft} draft · ${archived} archived`,
    },
    {
      label: "Live now",
      value: String(live),
      trend: "up",
    },
    {
      label: "Enrollments",
      value: String(totalEnrollments),
      hint: "Across all courses",
    },
    {
      label: "Avg fee / seat",
      value: Math.round(totalFeePerSeat / adminCourses.length)
        .toLocaleString(),
      hint: "PKR (mocked)",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Courses
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          All courses
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          {adminTeachers.length} teachers teaching {adminCourses.length}{" "}
          courses. Publish, archive, or pivot any course without leaving
          the table.
        </p>
      </header>

      <AdminStatStrip items={items} />

      <AdminCoursesTable rows={rows} />
    </div>
  );
};

export default page;
