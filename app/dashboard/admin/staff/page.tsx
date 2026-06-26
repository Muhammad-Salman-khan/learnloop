import {
  adminStaff,
  findUser,
} from "@/lib/admin/admin-data";
import type {
  AdminKpi,
  AdminStaff,
  AdminUser,
} from "@/lib/admin/admin-data";

import { AdminStatStrip } from "@/components/AdminStatStrip/AdminStatStrip";
import { AdminStaffTable } from "@/components/AdminStaffTable/AdminStaffTable";

type Row = { readonly staff: AdminStaff; readonly user: AdminUser };

const page = () => {
  const rows: ReadonlyArray<Row> = adminStaff
    .map((s) => {
      const u = findUser(s.userId);
      return u ? { staff: s, user: u } : null;
    })
    .filter((r): r is Row => r !== null);

  const items: ReadonlyArray<AdminKpi> = [
    { label: "Total staff", value: String(adminStaff.length) },
    {
      label: "Active",
      value: String(adminStaff.filter((s) => s.isActive).length),
      trend: "up",
    },
    {
      label: "Inactive",
      value: String(adminStaff.filter((s) => !s.isActive).length),
    },
    {
      label: "Departments",
      value: String(
        new Set(adminStaff.map((s) => s.department)).size,
      ),
      hint: "Distinct departments",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Users · Staff
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Staff
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Operations, finance, and front-desk staff. Toggle inactive rows
          when somebody rotates out of the platform.
        </p>
      </header>

      <AdminStatStrip items={items} />

      <AdminStaffTable rows={rows} />
    </div>
  );
};

export default page;
