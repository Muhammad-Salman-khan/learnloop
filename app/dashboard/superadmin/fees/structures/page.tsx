// Server Component — Fee structures catalog at /dashboard/superadmin/fees/structures.
// Schema for FeeStructure is not yet in prisma/schema.prisma; renders an
// honest empty placeholder.

import Link from "next/link";
import { Plus, Settings2 } from "lucide-react";

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
      title="Fee structures"
      description="Define how much each cohort owes and how often: monthly tuition, one-time admission, lab fees, exam fees, late-payment penalties."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Fees", href: "/dashboard/superadmin/fees" },
        { label: "Structures" },
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
          { label: "Active", value: "—", hint: "Currently billing" },
          { label: "Inactive", value: "—", hint: "Retired" },
          { label: "Recurring", value: "—", hint: "monthly · quarterly · yearly" },
        ]}
      />

      <Alert>
        <Settings2 className="size-4" />
        <AlertTitle>Schema not landed</AlertTitle>
        <AlertDescription>
          The <code className="font-mono">FeeStructure</code> table is not yet in
          schema.prisma. Once it ships, this table will render{" "}
          <code className="font-mono">name · amount · frequency · applicableFor</code>
          rows with edit and retire actions.
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
              What a row will look like once the table exists.
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono">
            schema preview
          </Badge>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            {[
              ["name", ""],
              ["description", ""],
              ["amount", "Integer cents"],
              ["frequency", "monthly · quarterly · yearly · one-time"],
              ["applicableFor[]", "Cohort filter (class / section / batch)"],
              ["dueDay", "Day of month"],
              ["lateFee", "Per-day penalty"],
              ["status", "active · inactive"],
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
