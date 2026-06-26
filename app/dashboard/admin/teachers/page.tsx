import {
  adminTeachers,
  findUser,
} from "@/lib/admin/admin-data";
import type {
  AdminKpi,
  AdminTeacher,
  AdminUser,
} from "@/lib/admin/admin-data";

import { AdminStatStrip } from "@/components/AdminStatStrip/AdminStatStrip";
import { AdminTeachersTable } from "@/components/AdminTeachersTable/AdminTeachersTable";

type Row = { readonly teacher: AdminTeacher; readonly user: AdminUser };

const page = () => {
  const rows: ReadonlyArray<Row> = adminTeachers
    .map((t) => {
      const u = findUser(t.userId);
      return u ? { teacher: t, user: u } : null;
    })
    .filter((r): r is Row => r !== null);

  const active = adminTeachers.filter((t) => t.isActive).length;
  const items: ReadonlyArray<AdminKpi> = [
    {
      label: "Teachers",
      value: String(adminTeachers.length),
      hint: "All cohorts",
    },
    { label: "Active", value: String(active), trend: "up" },
    { label: "Inactive", value: String(adminTeachers.length - active) },
    {
      label: "Courses taught",
      value: String(
        adminTeachers.reduce(
          (acc, t) => acc + t.assignedCourseIds.length,
          0,
        ),
      ),
      hint: "Across all teachers",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Users · Teachers
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Teachers
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Manage the teaching staff: hire records, assignments, and
          active/inactive state.
        </p>
      </header>

      <AdminStatStrip items={items} />

      <AdminTeachersTable rows={rows} />
    </div>
  );
};

export default page;
