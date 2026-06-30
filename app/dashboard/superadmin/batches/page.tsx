// Server Component — superadmin Batches console.
// Batches are not yet modelled in prisma/schema.prisma; this page
// resolves the route and shows the planned shape with an honest
// schema-pending alert.

import Link from "next/link";
import { ClipboardList, Plus } from "lucide-react";

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
      eyebrow="Super-admin · Academics"
      title="Batches"
      description="Cohort-level grouping of courses over a term: name, year range, and student count. A batch owns many enrollments."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Batches" },
      ]}
      actions={
        <Button size="sm" asChild>
          <Link href="/dashboard/superadmin/batches/new">
            <Plus className="mr-1.5 size-3.5" />
            New batch
          </Link>
        </Button>
      }
    >
      <SuperadminStatStrip
        stats={[
          { label: "Batches", value: "—" },
          { label: "Active", value: "—", hint: "In session" },
          { label: "Upcoming", value: "—", hint: "Future cohorts" },
          { label: "Completed", value: "—", hint: "Past terms" },
        ]}
      />

      <Alert>
        <ClipboardList className="size-4" />
        <AlertTitle>Schema not landed</AlertTitle>
        <AlertDescription>
          A <code className="font-mono">Batch</code> table will group courses and
          enrollments by term. Until the migration ships, the table below is
          empty — but the page resolves and is reachable from the sidebar.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Schema preview
            </span>
            <CardTitle className="mt-1 font-display text-lg font-medium">
              Planned columns
            </CardTitle>
            <CardDescription className="text-xs">
              Fields the page expects to consume once the migration is applied.
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono">
            schema preview
          </Badge>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            {[
              ["name", "Display label, e.g. Fall 2026 — CS"],
              ["code", "Short identifier"],
              ["year", "Calendar year anchor"],
              ["startDate / endDate", "Term range"],
              ["courseCount", "Derived: count of courses in batch"],
              ["studentCount", "Derived: count of enrolled students"],
              ["status", "active · upcoming · completed"],
              ["createdAt", "Row timestamp"],
            ].map(([k, v]) => (
              <li
                key={k}
                className="flex items-start gap-2 rounded-md border bg-muted/30 px-3 py-2"
              >
                <code className="shrink-0 font-mono text-[11px]">{k}</code>
                <span className="text-muted-foreground">{v}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </SuperadminPage>
  );
};

export default page;
