import { adminUsers, countsByRole } from "@/lib/admin/admin-data";
import type { AdminKpi } from "@/lib/admin/admin-data";

import { AdminStatStrip } from "@/components/AdminStatStrip/AdminStatStrip";
import { AdminUsersTable } from "@/components/AdminUsersTable/AdminUsersTable";

const page = () => {
  const counts = countsByRole();

  const items: ReadonlyArray<AdminKpi> = [
    {
      label: "All users",
      value: String(adminUsers.length),
      hint: "Across all 5 roles",
    },
    { label: "Super admins", value: String(counts.superAdmin) },
    { label: "Admins", value: String(counts.admin) },
    { label: "Staff", value: String(counts.staff) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Users
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          All users
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Filter every user on LearnHub by role, search by name or email,
          and dive into a profile to manage ban status or change their role.
        </p>
      </header>

      <AdminStatStrip items={items} />

      <AdminUsersTable users={adminUsers} />
    </div>
  );
};

export default page;
