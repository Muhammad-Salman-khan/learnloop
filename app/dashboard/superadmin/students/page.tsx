// Server Component — lists every Student-profile user (User.role === "student")
// with filters for class & status. Wired to real Prisma data via
// lib/superadmin/data.ts → listStudents().

import Link from "next/link";
import { GraduationCap } from "lucide-react";

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

import { listStudents } from "@/lib/superadmin/data";

const page = async () => {
  const rows = await listStudents();
  const enrichable = rows.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    banned: u.banned ?? false,
    createdAt: u.createdAt.toISOString(),
    rollNumber: u.student?.rollNumber ?? null,
    class: u.student?.class ?? null,
    section: u.student?.section ?? null,
  }));

  const activeCount = enrichable.filter((r) => !r.banned).length;
  const bannedCount = enrichable.filter((r) => r.banned).length;
  const classCount = new Set(
    enrichable.map((r) => r.class).filter((c): c is string => Boolean(c)),
  ).size;

  return (
    <SuperadminPage
      eyebrow="Super-admin · Users"
      title="Students"
      description="Every account whose User.role is student. Open a profile to manage course enrollment, results, and fee ledger."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin" },
        { label: "Users", href: "/dashboard/superadmin/users" },
        { label: "Students" },
      ]}
    >
      <SuperadminStatStrip
        stats={[
          { label: "Students", value: enrichable.length },
          {
            label: "Active",
            value: activeCount,
            hint: "Not banned",
          },
          {
            label: "Banned",
            value: bannedCount,
            hint: "Blocked from sign-in",
          },
          {
            label: "Distinct classes",
            value: classCount,
            hint: "Across active cohorts",
          },
        ]}
      />

      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Roster
            </span>
            <CardTitle className="mt-1 font-display text-lg font-medium">
              All student accounts
            </CardTitle>
            <CardDescription className="text-xs">
              Search by name, email, roll number, or class.
            </CardDescription>
          </div>
          <Link
            href="/dashboard/superadmin/users/new"
            className="text-xs text-muted-foreground hover:underline"
          >
            Enroll new student →
          </Link>
        </CardHeader>
        <CardContent>
          <SuperadminDataTable
            rowKey={(r) => r.id}
            rowHref={(r) => `/dashboard/superadmin/users/${r.id}`}
            searchPlaceholder="Search students…"
            caption="Showing student-role users across the platform."
            emptyMessage="No students yet. Enroll one from Users → New."
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
                      <GraduationCap className="size-3.5" />
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
                id: "roll",
                header: "Roll #",
                hidden: "sm",
                cell: (r) =>
                  r.rollNumber ? (
                    <span className="font-mono text-xs">{r.rollNumber}</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  ),
              },
              {
                id: "class",
                header: "Class · Sec",
                cell: (r) =>
                  r.class ? (
                    <span className="font-mono text-xs">
                      {r.class}
                      {r.section ? `·${r.section}` : ""}
                    </span>
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
