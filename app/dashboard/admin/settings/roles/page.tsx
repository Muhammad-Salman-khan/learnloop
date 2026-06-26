import { adminUsers, countsByRole } from "@/lib/admin/admin-data";
import type { AdminKpi } from "@/lib/admin/admin-data";

import { RolesOverviewTable } from "@/components/RolesOverviewTable/RolesOverviewTable";

const page = () => {
  const counts = countsByRole();

  const kpis: ReadonlyArray<AdminKpi> = [
    { label: "Super admins", value: String(counts.superAdmin) },
    { label: "Admins", value: String(counts.admin) },
    { label: "Staff", value: String(counts.staff) },
    { label: "Teachers", value: String(counts.teacher) },
    { label: "Students", value: String(counts.student) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Admin · Roles
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Role management
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          View which users have which roles and promote or demote users
          across the platform.
        </p>
      </header>

      <RolesOverviewTable users={adminUsers} kpis={kpis} />
    </div>
  );
};

export default page;
