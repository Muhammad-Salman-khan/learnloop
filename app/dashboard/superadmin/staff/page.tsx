// Server Component — lists every Staff-profile user (User.role === "staff").
// Wired to real Prisma data via lib/superadmin/data.ts → listStaff().

import Link from "next/link";
import { UserCog } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SuperadminPage,
  SuperadminStatStrip,
} from "@/components/SuperadminPage/SuperadminPage";
import { SuperadminDataTable } from "@/components/SuperadminDataTable/SuperadminDataTable";

import { listStaff } from "@/lib/superadmin/data";

const page = async () => {
  const rows = await listStaff();
  const enrichable = rows.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    banned: u.banned ?? false,
    createdAt: u.createdAt.toISOString(),
    employmentId: u.staff?.employmentId ?? null,
    department: u.staff?.department ?? null,
    designation: u.staff?.designation ?? null,
    isActive: u.staff?.isActive ?? null,
  }));

  const activeCount = enrichable.filter((r) => !r.banned).length;
  const bannedCount = enrichable.filter((r) => r.banned).length;
  const depts = new Set(
    enrichable.map((r) => r.department).filter((d): d is string => Boolean(d)),
  ).size;

  return (
    <SuperadminPage
      eyebrow="Super-admin · Users"
      title="Staff"
      description="Operational staff: accounts, attendance, and finance surface access. Created via Users → New (staff role)."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Users", href: "/dashboard/superadmin/users" },
        { label: "Staff" },
      ]}
    >
      <SuperadminStatStrip
        stats={[
          { label: "Staff", value: enrichable.length },
          { label: "Active", value: activeCount, hint: "Not banned" },
          {
            label: "Banned",
            value: bannedCount,
            hint: "Blocked from sign-in",
          },
          {
            label: "Departments",
            value: depts,
            hint: "Distinct dept values",
          },
        ]}
      />

      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Operations
            </span>
            <CardTitle className="mt-1 font-display text-lg font-medium">
              All staff accounts
            </CardTitle>
            <CardDescription className="text-xs">
              Search by name, email, employment ID, or department.
            </CardDescription>
          </div>
          <Link
            href="/dashboard/superadmin/users/new"
            className="text-xs text-muted-foreground hover:underline"
          >
            Add staff →
          </Link>
        </CardHeader>
        <CardContent>
          <SuperadminDataTable
            rowKey={(r) => r.id}
            rowHref={(r) => `/dashboard/superadmin/users/${r.id}`}
            searchPlaceholder="Search staff…"
            caption="Showing staff-role users across the platform."
            emptyMessage="No staff yet. Add one from Users → New with the staff role."
            rows={enrichable}
            columns={[
              {
                id: "name",
                header: "Name",
                cell: (r) => (
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground"
                    >
                      <UserCog className="size-3.5" />
                    </span>
                    <span className="font-medium">{r.name}</span>
                  </div>
                ),
              },
              {
                id: "email",
                header: "Email",
                hidden: "md",
                cell: (r) => (
                  <span className="font-mono text-xs text-muted-foreground">
                    {r.email}
                  </span>
                ),
              },
              {
                id: "emp",
                header: "Employment ID",
                hidden: "sm",
                cell: (r) =>
                  r.employmentId ? (
                    <span className="font-mono text-xs">{r.employmentId}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  ),
              },
              {
                id: "dept",
                header: "Department",
                hidden: "lg",
                cell: (r) =>
                  r.department ? (
                    <span className="text-xs">{r.department}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  ),
              },
              {
                id: "status",
                header: "Status",
                cell: (r) =>
                  r.banned ? (
                    <Badge variant="destructive">Banned</Badge>
                  ) : (
                    <Badge variant="secondary">Active</Badge>
                  ),
              },
              {
                id: "joined",
                header: "Joined",
                hidden: "lg",
                align: "right",
                cell: (r) => (
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </span>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>
    </SuperadminPage>
  );
};

export default page;
