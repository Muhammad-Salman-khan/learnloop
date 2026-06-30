// Server Component — pulls real Prisma data, hands it to recharts Client islands.

import Link from "next/link";

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
  countsAcrossAll,
  countsByRole,
  bannedCounts,
  signupsByDay,
} from "@/lib/superadmin/data";
import { listAuditEvents, type AuditLogEntry } from "@/lib/superadmin/audit";
import { findUserById } from "@/lib/superadmin/data";

import { SuperadminRoleDistribution } from "@/components/SuperadminRoleDistribution/SuperadminRoleDistribution";
import { SuperadminSignupTrend } from "@/components/SuperadminSignupTrend/SuperadminSignupTrend";
import { SuperadminBannedChart } from "@/components/SuperadminBannedChart/SuperadminBannedChart";

const ANCHOR_NOW = new Date("2026-01-12T09:00:00Z");

function relative(iso: Date | string): string {
  const t = new Date(iso).getTime();
  const diff = ANCHOR_NOW.getTime() - t;
  const abs = Math.abs(diff);
  const min = Math.round(abs / 60_000);
  if (min < 1) return "just now";
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.round(hr / 24);
  if (d < 7) return `${d}d ago`;
  const w = Math.round(d / 7);
  if (w < 5) return `${w}w ago`;
  const m = Math.round(d / 30);
  if (m < 12) return `${m}mo ago`;
  const y = Math.round(d / 365);
  return `${y}y ago`;
}

const page = async () => {
  //  audit_
  const [aggregate, roleRows, ban, trend] = await Promise.all([
    countsAcrossAll(),
    countsByRole(),
    bannedCounts(),
    signupsByDay(14),
    // listAuditEvents({ take: 8 }),
  ]);
  // const audit: ReadonlyArray<AuditLogEntry> = audit_;

  // Resolve actor names for the recent audit table
  // const actorIds: string[] = Array.from(
  //   new Set(audit.map((a: AuditLogEntry) => a.actorId)),
  // );
  // const actorMap: Record<string, string> = {};
  // for (const id of actorIds) {
  //   const u = await findUserById(id);
  //   actorMap[id] = u?.name ?? "Unknown";
  // }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Super-admin · Overview
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Platform governance
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            Live counts, role distribution, signup velocity, and the latest
            audit-trailed actions across LearnHub.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/superadmin/users/new">Create user</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/superadmin/roles">Manage roles</Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-[10.5px] uppercase tracking-[0.18em]">
              Total users
            </CardDescription>
            <CardTitle className="font-display text-3xl font-medium tracking-tight">
              {aggregate.users}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Across every role, including banned.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-[10.5px] uppercase tracking-[0.18em]">
              Students
            </CardDescription>
            <CardTitle className="font-display text-3xl font-medium tracking-tight">
              {aggregate.students}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            With a Student profile row.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-[10.5px] uppercase tracking-[0.18em]">
              Teachers
            </CardDescription>
            <CardTitle className="font-display text-3xl font-medium tracking-tight">
              {aggregate.teachers}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Active in the platform.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-[10.5px] uppercase tracking-[0.18em]">
              Staff
            </CardDescription>
            <CardTitle className="font-display text-3xl font-medium tracking-tight">
              {aggregate.staff}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Operations + admin support.
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription className="text-[10.5px] uppercase tracking-[0.18em]">
              Role distribution
            </CardDescription>
            <CardTitle className="font-display text-lg font-medium">
              Users by role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SuperadminRoleDistribution
              data={roleRows.map((r: { role: string; count: number }) => ({
                name: r.role,
                value: r.count,
              }))}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardDescription className="text-[10.5px] uppercase tracking-[0.18em]">
              Signups
            </CardDescription>
            <CardTitle className="font-display text-lg font-medium">
              Signups, last 14 days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SuperadminSignupTrend data={trend} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription className="text-[10.5px] uppercase tracking-[0.18em]">
              Banned vs active
            </CardDescription>
            <CardTitle className="font-display text-lg font-medium">
              Account status split
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SuperadminBannedChart banned={ban.banned} active={ban.active} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <CardDescription className="text-[10.5px] uppercase tracking-[0.18em]">
                Audit trail
              </CardDescription>
              <CardTitle className="mt-1 font-display text-lg font-medium">
                Recent governance actions
              </CardTitle>
              <CardDescription className="text-xs">
                The most recent recorded mutations kept by the audit log.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/superadmin/audit-log">
                View audit log →
              </Link>
            </Button>
          </CardHeader>
          {/* <CardContent>
            {audit.length === 0 ?
              <p className="py-8 text-center text-xs text-muted-foreground">
                No audit events yet. Ban, role-change, or impersonate to
                populate.
              </p>
            : <ol className="flex flex-col divide-y">
                {audit.map((a: AuditLogEntry) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 py-2.5 text-xs"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                    />
                    <div className="flex flex-1 flex-col gap-0.5 leading-tight">
                      <span className="text-sm">
                        <span className="font-medium">
                          {actorMap[a.actorId] ?? a.actorId.slice(0, 8)}
                        </span>{" "}
                        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                          {a.action}
                        </span>{" "}
                        {a.target ?
                          <span className="text-muted-foreground">
                            → {a.target.slice(0, 8)}
                          </span>
                        : null}
                      </span>
                      <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                        {relative(a.createdAt)}
                      </span>
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {a.action.split(".")[0]}
                    </Badge>
                  </li>
                ))}
              </ol>
            }
          </CardContent> */}
        </Card>
      </div>
    </div>
  );
};

export default page;
