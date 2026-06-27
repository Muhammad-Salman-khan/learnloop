import {
  StaffRoleSwitcher,
} from "@/components/StaffRoleSwitcher/StaffRoleSwitcher";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { adminUsers } from "@/lib/staff/staff-data";
import { roleLabel } from "@/lib/admin/admin-data";
import type { AdminRole } from "@/lib/admin/admin-data";

const page = () => {
  const kpis: Record<AdminRole, number> = {
    superAdmin: 0,
    admin: 0,
    staff: 0,
    teacher: 0,
    student: 0,
  };
  for (const u of adminUsers) kpis[u.role] += 1;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Staff · Role management
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Promote · demote
        </h1>
        <p className="max-w-[72ch] text-sm text-muted-foreground md:text-base">
          Staff is authorised to move users between{" "}
          <Badge variant="secondary">Student</Badge> and{" "}
          <Badge variant="outline">Teacher</Badge>. Other role transitions —
          admin / superAdmin / staff onboarding — happen in the admin console.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        {(
          ["student", "teacher", "admin", "superAdmin"] as ReadonlyArray<AdminRole>
        ).map((role) => (
          <Card key={role} className="gap-2 py-5">
            <CardHeader className="px-5 pb-1">
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                {roleLabel(role)}
              </span>
            </CardHeader>
            <CardContent className="px-5 pt-0">
              <span className="font-display text-3xl font-medium tracking-tight">
                {kpis[role]}
              </span>
              <CardDescription className="mt-1 text-xs">
                {role === "student" || role === "teacher"
                  ? "In your staff scope"
                  : "Admin-only transitions"}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <StaffRoleSwitcher users={adminUsers} />
    </div>
  );
};

export default page;
