import {
  adminStudents,
  adminUsers,
  findUser,
} from "@/lib/admin/admin-data";

import { AdminStatStrip } from "@/components/AdminStatStrip/AdminStatStrip";
import { AdminStudentsTable } from "@/components/AdminStudentsTable/AdminStudentsTable";
import type { AdminKpi } from "@/lib/admin/admin-data";

const page = () => {
  const rows = adminStudents
    .map((student) => {
      const user = findUser(student.userId);
      return user ? { student, user } : null;
    })
    .filter((x): x is { student: typeof adminStudents[number]; user: typeof adminUsers[number] } => x !== null);

  const totalCoursesEnrolled = adminStudents.reduce(
    (acc, s) => acc + s.enrolledCourseIds.length,
    0,
  );

  const feeCounts = {
    paid: adminStudents.filter((s) => s.feeStatus === "paid").length,
    due: adminStudents.filter((s) => s.feeStatus === "due").length,
    unpaid: adminStudents.filter((s) => s.feeStatus === "unpaid").length,
  };

  const items: ReadonlyArray<AdminKpi> = [
    {
      label: "Total students",
      value: String(adminStudents.length),
      hint: "Across all cohorts",
    },
    {
      label: "Courses enrolled",
      value: String(totalCoursesEnrolled),
      hint: "Sum of seats occupied",
    },
    {
      label: "Fee paid",
      value: String(feeCounts.paid),
      delta: `${feeCounts.paid}/${adminStudents.length}`,
      trend: "up",
    },
    {
      label: "Fee unpaid",
      value: String(feeCounts.unpaid + feeCounts.due),
      delta: `${feeCounts.unpaid} Unpaid / ${feeCounts.due} Due`,
      trend: "down",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Users · Students
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Students
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Manage student-level records, fee status, and enrolled courses in
          one place. Use the bulk action to flip several fee states at once.
        </p>
      </header>

      <AdminStatStrip items={items} />

      <AdminStudentsTable rows={rows} />
    </div>
  );
};

export default page;
