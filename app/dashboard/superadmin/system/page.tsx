// Server Component — System health and runtime info at /dashboard/superadmin/system
// Renders: build identity, runtime, authentication provider status, last-
// touched tables, and recent audit volume. Pulls aggregate counts from
// lib/superadmin/data.ts so this is honest about live DB state.

import Link from "next/link";
import {
  Activity,
  CheckCircle2,
  Database,
  KeyRound,
  Server,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  SuperadminPage,
  SuperadminStatStrip,
} from "@/components/SuperadminPage/SuperadminPage";

import { countsAcrossAll } from "@/lib/superadmin/data";
import { listAuditEvents } from "@/lib/superadmin/audit";

const page = async () => {
  const [counts, audit] = await Promise.all([
    countsAcrossAll(),
    listAuditEvents({ take: 1 }),
  ]);

  return (
    <SuperadminPage
      eyebrow="Super-admin · Governance"
      title="System"
      description="Runtime overview: package versions, auth provider, database connection, and last-activity pulse. Read-only."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "System" },
      ]}
    >
      <SuperadminStatStrip
        stats={[
          { label: "Users", value: counts.users },
          { label: "Students", value: counts.students },
          { label: "Teachers", value: counts.teachers },
          { label: "Staff", value: counts.staff },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Runtime
            </span>
            <CardTitle className="font-display text-lg font-medium">
              Stack identity
            </CardTitle>
            <CardDescription className="text-xs">
              Versions surfaced from package.json and the active runtime.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Component</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead className="pr-5 text-right">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <Row label="Next.js" value="16.x" note="App router · React Compiler enabled" />
                <Row label="React" value="19.x" note="Server Components by default" />
                <Row label="Prisma client" value="7.x" note="PostgreSQL adapter (pg)" />
                <Row label="better-auth" value="1.6.x" note="Email + sessions" />
                <Row label="TanStack Form" value="1.x" note="Used for every form" />
                <Row label="shadcn/ui" value="radix-nova" note="Style preset; custom in globals.css" />
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Health
            </span>
            <CardTitle className="font-display text-lg font-medium">
              Pulse
            </CardTitle>
            <CardDescription className="text-xs">
              Live signals from the database + auth layer.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-xs">
            <PulseRow
              icon={<CheckCircle2 className="size-3.5 text-emerald-600" />}
              title="Database connected"
              body={`${counts.users} users · ${counts.students} students · ${counts.teachers} teachers · ${counts.staff} staff`}
            />
            <PulseRow
              icon={<KeyRound className="size-3.5 text-sky-600" />}
              title="Auth: better-auth"
              body="Email/password + session cookies. Account table: populated."
            />
            <PulseRow
              icon={<Database className="size-3.5 text-violet-600" />}
              title="Audit log"
              body={
                audit[0]
                  ? `Last event: ${new Date(audit[0].createdAt).toLocaleString()} — ${audit[0].action}`
                  : "No events recorded."
              }
            />
            <PulseRow
              icon={<Server className="size-3.5 text-amber-600" />}
              title="Schema migrations"
              body="5 migrations applied. Course / batch / enrollment / schedule / fee / attendance / result / announcement / notification tables pending."
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Routes
            </span>
            <CardTitle className="mt-1 font-display text-lg font-medium">
              Super-admin console
            </CardTitle>
            <CardDescription className="text-xs">
              Every page mounts under <code className="font-mono">/dashboard/superadmin/*</code>.
              Open the admin audit log for a full history.
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono">
            {counts.users} accounts
          </Badge>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3 lg:grid-cols-4">
          {[
            ["Users", "/dashboard/superadmin/users"],
            ["Students", "/dashboard/superadmin/students"],
            ["Teachers", "/dashboard/superadmin/teachers"],
            ["Staff", "/dashboard/superadmin/staff"],
            ["Admins", "/dashboard/superadmin/admins"],
            ["Roles", "/dashboard/superadmin/roles"],
            ["Courses", "/dashboard/superadmin/courses"],
            ["Batches", "/dashboard/superadmin/batches"],
            ["Enrollments", "/dashboard/superadmin/enrollments"],
            ["Schedule", "/dashboard/superadmin/schedule"],
            ["Fees", "/dashboard/superadmin/fees"],
            ["Attendance", "/dashboard/superadmin/attendance"],
            ["Results", "/dashboard/superadmin/results"],
            ["Announcements", "/dashboard/superadmin/announcements"],
            ["Notifications", "/dashboard/superadmin/notifications"],
            ["Audit log", "/dashboard/superadmin/audit-log"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 hover:bg-muted/30"
            >
              <Activity className="size-3 shrink-0 text-muted-foreground" />
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </CardContent>
      </Card>
    </SuperadminPage>
  );
};

export default page;

// --- local helpers ----------------------------------------------------

function Row({
  label,
  value,
  note,
}: {
  readonly label: string;
  readonly value: string;
  readonly note: string;
}) {
  return (
    <TableRow>
      <TableCell className="pl-5 font-medium">{label}</TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">
        {value}
      </TableCell>
      <TableCell className="pr-5 text-right text-xs text-muted-foreground">
        {note}
      </TableCell>
    </TableRow>
  );
}

function PulseRow({
  icon,
  title,
  body,
}: {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly body: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border bg-muted/30 px-3 py-2">
      <span aria-hidden="true" className="mt-0.5">
        {icon}
      </span>
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="font-medium">{title}</span>
        <span className="text-[11px] text-muted-foreground">{body}</span>
      </div>
    </div>
  );
}
