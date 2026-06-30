// Server Component — Fees "Master" landing page at /dashboard/superadmin/fees.
// The Fee tables (FeeStructure, FeeRecord) are not yet modelled in
// prisma/schema.prisma; this page resolves the route as a top-level
// overview that links to the Structures and Records sub-pages.

import Link from "next/link";
import { ClipboardList, Plus, Settings2, Wallet } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  SuperadminStatStrip,
} from "@/components/SuperadminPage/SuperadminPage";

const page = () => {
  return (
    <SuperadminPage
      eyebrow="Super-admin · Finance"
      title="Fees — master"
      description="Top-level finance overview for the platform. Open the structures catalog to define recurring and one-time fees, or jump to the records ledger for per-student transactions."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Fees" },
      ]}
      actions={
        <Button size="sm" asChild>
          <Link href="/dashboard/superadmin/fees/structures/new">
            <Plus className="mr-1.5 size-3.5" />
            New structure
          </Link>
        </Button>
      }
    >
      <SuperadminStatStrip
        stats={[
          { label: "Structures", value: "—" },
          { label: "Records", value: "—", hint: "Per-student transactions" },
          { label: "Outstanding", value: "—", hint: "Across all structures" },
          { label: "Collected (term)", value: "—", hint: "Sum of paid" },
        ]}
      />

      <Alert>
        <Wallet className="size-4" />
        <AlertTitle>Schema not landed</AlertTitle>
        <AlertDescription>
          The <code className="font-mono">FeeStructure</code> and{" "}
          <code className="font-mono">FeeRecord</code> tables are referenced by
          the staff fees ledger. Until the migration ships, this page renders
          the planned layout.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-300"
              >
                <Settings2 className="size-4" />
              </span>
              <div>
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  Catalog
                </span>
                <CardTitle className="mt-1 font-display text-lg font-medium">
                  Structures
                </CardTitle>
                <CardDescription className="text-xs">
                  Define how much each cohort owes and when.
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="font-mono">
              schema preview
            </Badge>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Fields: <code className="font-mono">name</code>,{" "}
            <code className="font-mono">amount</code>,{" "}
            <code className="font-mono">frequency</code>,{" "}
            <code className="font-mono">applicableFor[]</code>,{" "}
            <code className="font-mono">dueDay</code>,{" "}
            <code className="font-mono">lateFee</code>.
          </CardContent>
          <CardContent className="flex flex-wrap items-center gap-2 pt-0">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/superadmin/fees/structures">Open catalog →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400"
              >
                <ClipboardList className="size-4" />
              </span>
              <div>
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  Ledger
                </span>
                <CardTitle className="mt-1 font-display text-lg font-medium">
                  Records
                </CardTitle>
                <CardDescription className="text-xs">
                  Every per-student fee transaction: charged, paid, pending, overdue.
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="font-mono">
              schema preview
            </Badge>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Fields: <code className="font-mono">studentId</code>,{" "}
            <code className="font-mono">structureId</code>,{" "}
            <code className="font-mono">amount</code>,{" "}
            <code className="font-mono">paidAmount</code>,{" "}
            <code className="font-mono">dueDate</code>,{" "}
            <code className="font-mono">paidDate</code>,{" "}
            <code className="font-mono">status</code>.
          </CardContent>
          <CardContent className="flex flex-wrap items-center gap-2 pt-0">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/superadmin/fees/records">Open ledger →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </SuperadminPage>
  );
};

export default page;
