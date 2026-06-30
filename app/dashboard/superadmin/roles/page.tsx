// Server Component — the Roles access-management console.
// The five role definitions live in lib/superadmin/roles.ts. Counts come
// live from the User table via countsByRole(). There is no per-role
// permission table in the Prisma schema yet, so the permission list
// shown here is the implicit capability each role gets today.

import Link from "next/link";
import { KeyRound, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SuperadminPage,
} from "@/components/SuperadminPage/SuperadminPage";

import { countsByRole } from "@/lib/superadmin/data";
import {
  ALL_ROLES,
  roleBadgeVariant,
  roleLabel,
  type SuperadminRole,
} from "@/lib/superadmin/roles";

type CapabilityLine = { readonly label: string; readonly detail: string };

const SUPER_CAPABILITIES: ReadonlyArray<CapabilityLine> = [
  { label: "Platform ownership", detail: "Edits system, institute, and integration settings." },
  { label: "User governance", detail: "Create, promote, demote, ban, restore, impersonate." },
  { label: "Audit trail", detail: "Read-only access to every recorded governance action." },
  { label: "All admin surfaces", detail: "Routes resolve to /dashboard/superadmin/*." },
];

const ADMIN_CAPABILITIES: ReadonlyArray<CapabilityLine> = [
  { label: "Operations", detail: "Manage announcements, notifications, fees, schedule." },
  { label: "User management", detail: "Edit Student / Teacher / Staff profiles; no role mutation." },
  { label: "Reports", detail: "Read attendance, results, enrollment history." },
];

const STAFF_CAPABILITIES: ReadonlyArray<CapabilityLine> = [
  { label: "Day-to-day ops", detail: "Enrollments, attendance, fee collection, marks entry." },
  { label: "Notifications", detail: "Push alerts to students and teachers." },
];

const TEACHER_CAPABILITIES: ReadonlyArray<CapabilityLine> = [
  { label: "Course owner", detail: "Edit syllabus and teaching materials for assigned courses." },
  { label: "Marks entry", detail: "Submit quiz / exam / assignment scores." },
  { label: "Attendance", detail: "Mark daily attendance by section." },
];

const STUDENT_CAPABILITIES: ReadonlyArray<CapabilityLine> = [
  { label: "Self-service", detail: "View enrolled courses, schedule, results, fees." },
  { label: "Notifications", detail: "Receive announcements targeted at students." },
];

const CAPABILITIES_BY_ROLE: Record<SuperadminRole, ReadonlyArray<CapabilityLine>> = {
  superAdmin: SUPER_CAPABILITIES,
  admin: ADMIN_CAPABILITIES,
  staff: STAFF_CAPABILITIES,
  teacher: TEACHER_CAPABILITIES,
  student: STUDENT_CAPABILITIES,
};

const ROLE_DESCRIPTION: Record<SuperadminRole, string> = {
  superAdmin: "Platform owners. Write to system settings and impersonate users.",
  admin: "Operations leads. Govern announcements, fees, schedule, and most user profiles.",
  staff: "Operational staff. Day-to-day enrollment, attendance, and fee collection.",
  teacher: "Faculty. Edit assigned course material and submit marks.",
  student: "End-user accounts. Read-only access to their own surface.",
};

const page = async () => {
  const roleRows = await countsByRole();
  const counts: Record<string, number> = {};
  for (const r of roleRows) counts[r.role] = r.count;
  const totalUsers = Object.values(counts).reduce((acc, n) => acc + n, 0);

  return (
    <SuperadminPage
      eyebrow="Super-admin · Access"
      title="Roles"
      description="Five built-in roles power every dashboard. Roles are enforced both in code (lib/auth routing) and in the Prisma schema (User.role enum). Mutations are recorded in the audit log."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Roles" },
      ]}
      actions={
        <>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/superadmin/audit-log">
              <KeyRound className="mr-1.5 size-3.5" />
              Audit log
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/superadmin/users/new">
              <Plus className="mr-1.5 size-3.5" />
              Assign role
            </Link>
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ALL_ROLES.map((role) => {
          const count = counts[role] ?? 0;
          const caps = CAPABILITIES_BY_ROLE[role];
          const pct = totalUsers === 0 ? 0 : Math.round((count / totalUsers) * 100);
          return (
            <Card key={role} className="flex flex-col">
              <CardHeader className="flex-row items-start justify-between space-y-0">
                <div>
                  <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                    Role
                  </span>
                  <CardTitle className="mt-1 font-display text-lg font-medium">
                    <Badge variant={roleBadgeVariant(role)}>{roleLabel(role)}</Badge>
                  </CardTitle>
                  <CardDescription className="mt-2 text-xs">
                    {ROLE_DESCRIPTION[role]}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-0.5 text-right">
                  <span className="font-display text-2xl font-medium tracking-tight tabular-nums">
                    {count}
                  </span>
                  <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                    {pct}% of total
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-foreground"
                      style={{ width: `${Math.min(100, Math.max(2, pct))}%` }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <ul className="flex flex-col gap-2 text-xs">
                  {caps.map((c) => (
                    <li
                      key={c.label}
                      className="flex flex-col gap-0.5 rounded-md border bg-muted/30 px-3 py-2"
                    >
                      <span className="font-medium">{c.label}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {c.detail}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-1 flex items-center justify-between gap-2 text-[11px]">
                  <Link
                    href={`/dashboard/superadmin/users?role=${role}`}
                    className="text-muted-foreground hover:underline"
                  >
                    View users →
                  </Link>
                  <code className="font-mono text-[10.5px] text-muted-foreground">
                    enum: {role}
                  </code>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            How role mutation works
          </CardTitle>
          <CardDescription className="text-xs">
            Every role change is implemented as a Server Action that calls
            recordAudit(...) so the super-admin audit log has a permanent trail.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          <ol className="flex flex-col gap-2">
            <li>· <span className="font-medium">Promote / demote</span> — server action rewrites User.role, then writes <code className="font-mono">user.role.promote</code> or <code className="font-mono">user.role.demote</code>.</li>
            <li>· <span className="font-medium">Ban / unban</span> — toggles User.banned + banReason; writes <code className="font-mono">user.ban</code> / <code className="font-mono">user.unban</code>.</li>
            <li>· <span className="font-medium">Impersonate</span> — opens a session with <code className="font-mono">Session.impersonatedBy</code> set; <code className="font-mono">impersonation.start</code> is recorded.</li>
          </ol>
        </CardContent>
      </Card>
    </SuperadminPage>
  );
};

export default page;
