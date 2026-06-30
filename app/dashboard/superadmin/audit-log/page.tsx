// Server Component — the super-admin audit log.
// Reads paginated rows from the audit_event table via lib/superadmin/audit.ts
// and resolves actor names via lib/superadmin/data.ts → findUserById.

import Link from "next/link";

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

import { listAuditEvents, type AuditLogEntry } from "@/lib/superadmin/audit";
import { findUserById } from "@/lib/superadmin/data";

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
  const rows: ReadonlyArray<AuditLogEntry> = await listAuditEvents({
    take: 100,
  });

  const actorMap: Record<string, string> = {};
  for (const r of rows) {
    if (actorMap[r.actorId]) continue;
    const u = await findUserById(r.actorId);
    actorMap[r.actorId] = u?.name ?? "Unknown";
  }

  const totalShown = rows.length;
  const uniqueActors = new Set(rows.map((r) => r.actorId)).size;
  const uniqueActions = new Set(rows.map((r) => r.action)).size;
  const last24h = rows.filter(
    (r) => ANCHOR_NOW.getTime() - new Date(r.createdAt).getTime() < 86_400_000,
  ).length;

  return (
    <SuperadminPage
      eyebrow="Super-admin · Governance"
      title="Audit log"
      description="Immutable record of every sensitive action the super-admin console performs: user create · update · ban · role-change · impersonation · settings change. Written by recordAudit(...) inside each Server Action."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Audit log" },
      ]}
    >
      <SuperadminStatStrip
        stats={[
          { label: "Events", value: totalShown, hint: "Showing latest 100" },
          { label: "Distinct actors", value: uniqueActors },
          { label: "Distinct actions", value: uniqueActions },
          {
            label: "Last 24h",
            value: last24h,
            hint: "Recent activity count",
          },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Recent events
          </CardTitle>
          <CardDescription className="text-xs">
            Newest first. Page is server-rendered against live Prisma data.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {rows.length === 0 ? (
            <p className="px-6 pb-6 text-center text-xs text-muted-foreground">
              No audit events recorded yet. Ban, role-change, or impersonate
              a user to populate this log.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">When</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead className="hidden md:table-cell">Target</TableHead>
                  <TableHead className="pr-5 text-right">Meta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="pl-5 text-xs text-muted-foreground">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono tabular-nums">
                          {new Date(row.createdAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "2-digit" },
                          )}
                        </span>
                        <span>{relative(row.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/superadmin/users/${row.actorId}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {actorMap[row.actorId] ?? row.actorId.slice(0, 8)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          {row.action.split(".")[0]}
                        </Badge>
                        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                          {row.action}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {row.target ? (
                        <Link
                          href={`/dashboard/superadmin/users/${row.target}`}
                          className="font-mono text-xs text-muted-foreground hover:underline"
                        >
                          {row.target.slice(0, 10)}…
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="pr-5 text-right font-mono text-[11px] text-muted-foreground">
                      {row.meta ? "json" : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </SuperadminPage>
  );
};

export default page;
