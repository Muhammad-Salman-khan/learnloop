// Server Component — lists every Admin or Super-admin account.
// Wired to real Prisma data via lib/superadmin/data.ts → listAdmins().

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

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
import {
  ALL_ROLES,
  roleBadgeVariant,
  roleLabel,
  type SuperadminRole,
} from "@/lib/superadmin/roles";

import { listAdmins } from "@/lib/superadmin/data";

const page = async () => {
  const rows = await listAdmins();
  const enrichable = rows.map((u) => {
    const role = u.role as SuperadminRole;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role,
      banned: u.banned ?? false,
      banReason: u.banReason ?? null,
      createdAt: u.createdAt.toISOString(),
    };
  });

  const superAdmins = enrichable.filter((r) => r.role === "superAdmin").length;
  const admins = enrichable.filter((r) => r.role === "admin").length;
  const banned = enrichable.filter((r) => r.banned).length;

  return (
    <SuperadminPage
      eyebrow="Super-admin · Users"
      title="Admins"
      description="Accounts with admin or superAdmin role. Super-admins manage the platform; admins manage day-to-day operations."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Users", href: "/dashboard/superadmin/users" },
        { label: "Admins" },
      ]}
    >
      <SuperadminStatStrip
        stats={[
          { label: "Total admins", value: enrichable.length },
          {
            label: "Super admins",
            value: superAdmins,
            hint: "Platform owners",
          },
          { label: "Admins", value: admins, hint: "Operations leads" },
          { label: "Banned", value: banned, hint: "Blocked from sign-in" },
        ]}
      />

      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Governance
            </span>
            <CardTitle className="mt-1 font-display text-lg font-medium">
              All admin accounts
            </CardTitle>
            <CardDescription className="text-xs">
              Promote, demote, ban, or impersonate from the row menu.
            </CardDescription>
          </div>
          <Link
            href="/dashboard/superadmin/users/new"
            className="text-xs text-muted-foreground hover:underline"
          >
            Promote a user →
          </Link>
        </CardHeader>
        <CardContent>
          <SuperadminDataTable
            rowKey={(r) => r.id}
            rowHref={(r) => `/dashboard/superadmin/users/${r.id}`}
            searchPlaceholder="Search admins…"
            caption="Showing admin + superAdmin role users."
            emptyMessage="No admin accounts exist yet."
            rows={enrichable}
            columns={[
              {
                id: "name",
                header: "Name",
                cell: (r) => (
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="flex size-7 items-center justify-center rounded-md bg-foreground text-background"
                    >
                      <ShieldAlert className="size-3.5" />
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
                id: "role",
                header: "Role",
                cell: (r) =>
                  ALL_ROLES.includes(r.role) ? (
                    <Badge variant={roleBadgeVariant(r.role)}>
                      {roleLabel(r.role)}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">{r.role}</Badge>
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
