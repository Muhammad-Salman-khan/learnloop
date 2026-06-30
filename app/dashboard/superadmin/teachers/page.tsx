// Server Component — lists every Teacher-profile user (User.role === "teacher").
// Wired to real Prisma data via lib/superadmin/data.ts → listTeachers().

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

import { listTeachers } from "@/lib/superadmin/data";

const page = async () => {
  const rows = await listTeachers();
  type TeacherRow = {
    section: string | null;
    dob: Date;
    phoneNumber: string | null;
    address: string | null;
    bio: string | null;
    isActive: boolean;
    employmentId: string | null;
    nic: string | null;
    hireDate: Date;
    assgin_class: string | null;
    subjectProficiency: unknown;
  };

  const enrichable = rows.map((u) => {
    const teacher = u.teacher as unknown as TeacherRow | null;
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      banned: u.banned ?? false,
      createdAt: u.createdAt.toISOString(),
      employmentId: teacher?.employmentId ?? null,
      isActive: teacher?.isActive ?? null,
    };
  });

  const activeCount = enrichable.filter((r) => !r.banned).length;
  const bannedCount = enrichable.filter((r) => r.banned).length;
  const onPayroll = enrichable.filter((r) => r.isActive === true).length;

  return (
    <SuperadminPage
      eyebrow="Super-admin · Users"
      title="Teachers"
      description="Every account whose User.role is teacher. Profiles expose employmentId, subject proficiency, and assigned classes."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin" },
        { label: "Users", href: "/dashboard/superadmin/users" },
        { label: "Teachers" },
      ]}
    >
      <SuperadminStatStrip
        stats={[
          { label: "Teachers", value: enrichable.length },
          { label: "Active", value: activeCount, hint: "Not banned" },
          { label: "Banned", value: bannedCount, hint: "Blocked from sign-in" },
          {
            label: "On payroll",
            value: onPayroll,
            hint: "Teacher.isActive === true",
          },
        ]}
      />

      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Faculty
            </span>
            <CardTitle className="mt-1 font-display text-lg font-medium">
              All teachers
            </CardTitle>
            <CardDescription className="text-xs">
              Search by name, email, employment ID, or department.
            </CardDescription>
          </div>
          <Link
            href="/dashboard/superadmin/users/new"
            className="text-xs text-muted-foreground hover:underline"
          >
            Hire new teacher →
          </Link>
        </CardHeader>
        <CardContent>
          <SuperadminDataTable
            rowKey={(r) => r.id}
            rowHref={(r) => `/dashboard/superadmin/users/${r.id}`}
            searchPlaceholder="Search teachers…"
            caption="Showing teacher-role users across the platform."
            emptyMessage="No teachers yet. Hire one from Users → New."
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
                id: "section",
                header: "Section",
                hidden: "lg",
                cell: () => (
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
                header: "Hired",
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
