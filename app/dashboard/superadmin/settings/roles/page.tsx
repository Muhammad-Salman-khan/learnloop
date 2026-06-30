// Server Component — Settings · Roles at /dashboard/superadmin/settings/roles
// The Roles access-management console already lives at
// /dashboard/superadmin/roles. This page is the configuration-side
// counterpart: capability matrix and which roles can be assigned by whom.

import Link from "next/link";
import { KeyRound } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
} from "@/components/SuperadminPage/SuperadminPage";

import { countsByRole } from "@/lib/superadmin/data";
import {
  ALL_ROLES,
  roleBadgeVariant,
  roleLabel,
  type SuperadminRole,
} from "@/lib/superadmin/roles";

type Cell = "yes" | "no" | "self";

type Matrix = Record<SuperadminRole, Record<string, Cell>>;

const CAPABILITIES = [
  "Read users",
  "Mutate users",
  "Promote / demote role",
  "Ban / unban",
  "Impersonate",
  "Read audit log",
  "Edit finance",
  "Push announcements",
  "Edit system settings",
] as const;

const MATRIX: Matrix = {
  superAdmin: {
    "Read users": "yes",
    "Mutate users": "yes",
    "Promote / demote role": "yes",
    "Ban / unban": "yes",
    Impersonate: "yes",
    "Read audit log": "yes",
    "Edit finance": "yes",
    "Push announcements": "yes",
    "Edit system settings": "yes",
  },
  admin: {
    "Read users": "yes",
    "Mutate users": "yes",
    "Promote / demote role": "no",
    "Ban / unban": "no",
    Impersonate: "no",
    "Read audit log": "no",
    "Edit finance": "yes",
    "Push announcements": "yes",
    "Edit system settings": "no",
  },
  staff: {
    "Read users": "yes",
    "Mutate users": "yes",
    "Promote / demote role": "no",
    "Ban / unban": "no",
    Impersonate: "no",
    "Read audit log": "no",
    "Edit finance": "yes",
    "Push announcements": "yes",
    "Edit system settings": "no",
  },
  teacher: {
    "Read users": "yes",
    "Mutate users": "self",
    "Promote / demote role": "no",
    "Ban / unban": "no",
    Impersonate: "no",
    "Read audit log": "no",
    "Edit finance": "no",
    "Push announcements": "no",
    "Edit system settings": "no",
  },
  student: {
    "Read users": "self",
    "Mutate users": "no",
    "Promote / demote role": "no",
    "Ban / unban": "no",
    Impersonate: "no",
    "Read audit log": "no",
    "Edit finance": "no",
    "Push announcements": "no",
    "Edit system settings": "no",
  },
};

function cellLabel(c: Cell): string {
  if (c === "yes") return "Yes";
  if (c === "no") return "—";
  return "Self only";
}

function CellBadge({ c }: { readonly c: Cell }) {
  if (c === "yes") return <Badge variant="default">Yes</Badge>;
  if (c === "self")
    return (
      <Badge variant="outline" className="font-mono">
        self
      </Badge>
    );
  return (
    <span className="text-xs text-muted-foreground" aria-label="no">
      —
    </span>
  );
}

const page = async () => {
  const rows = await countsByRole();
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.role] = r.count;

  return (
    <SuperadminPage
      eyebrow="Configuration · Roles"
      title="Role capabilities"
      description="Capability matrix that drives the super-admin console. The User.role enum is the source of truth; this table is documentation, enforced in code via lib/auth/* and lib/superadmin/*."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Settings", href: "/dashboard/superadmin/settings" },
        { label: "Roles" },
      ]}
      actions={
        <Link
          href="/dashboard/superadmin/roles"
          className="text-xs text-muted-foreground hover:underline"
        >
          ← Roles access console
        </Link>
      }
    >
      <Alert>
        <KeyRound className="size-4" />
        <AlertTitle>Source of truth</AlertTitle>
        <AlertDescription>
          The capability matrix below is the current enforced behaviour. To
          change it, edit the role gating in{" "}
          <code className="font-mono">lib/auth/*</code> and{" "}
          <code className="font-mono">lib/superadmin/*</code>; the enum itself
          lives in <code className="font-mono">prisma/schema.prisma</code>.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Permission matrix
          </CardTitle>
          <CardDescription className="text-xs">
            Per role × capability. <span className="font-medium">Yes</span> = full,
            <span className="font-mono"> self</span> = own records only.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Capability</TableHead>
                {ALL_ROLES.map((r) => (
                  <TableHead key={r}>
                    <div className="flex items-center gap-1">
                      <Badge variant={roleBadgeVariant(r)}>{roleLabel(r)}</Badge>
                      <span className="font-mono text-[10.5px] text-muted-foreground">
                        ({counts[r] ?? 0})
                      </span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {CAPABILITIES.map((cap) => (
                <TableRow key={cap}>
                  <TableCell className="pl-5 font-medium">{cap}</TableCell>
                  {ALL_ROLES.map((r) => (
                    <TableCell key={r}>
                      <CellBadge c={MATRIX[r][cap] ?? "no"} />
                      <span className="sr-only">{cellLabel(MATRIX[r][cap] ?? "no")}</span>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </SuperadminPage>
  );
};

export default page;
