// Server Component — Fee records ledger at /dashboard/superadmin/fees/records.
// Schema for FeeRecord is not yet in prisma/schema.prisma; this page
// resolves the route with an honest empty placeholder.

import Link from "next/link";
import { ClipboardList } from "lucide-react";

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
  SuperadminPage,
  SuperadminStatStrip,
} from "@/components/SuperadminPage/SuperadminPage";

const page = () => {
  return (
    <SuperadminPage
      eyebrow="Super-admin · Finance"
      title="Fee records"
      description="Every per-student fee transaction ever generated: charged amounts, partial payments, paid date, and overdue flags. The staff ledger writes here; this surface is read-only super-admin oversight."
      breadcrumbs={[
        { label: "Super-admin", href: "/dashboard/superadmin/" },
        { label: "Fees", href: "/dashboard/superadmin/fees" },
        { label: "Records" },
      ]}
    >
      <SuperadminStatStrip
        stats={[
          { label: "Records", value: "—" },
          { label: "Paid", value: "—" },
          { label: "Pending", value: "—", hint: "Not yet overdue" },
          { label: "Overdue", value: "—" },
        ]}
      />

      <Alert>
        <ClipboardList className="size-4" />
        <AlertTitle>Schema not landed</AlertTitle>
        <AlertDescription>
          The <code className="font-mono">FeeRecord</code> table is not yet in
          schema.prisma. Once it ships, this table renders the full ledger
          with filters by status, cohort, and date range. Use Staff → Fees in
          the meantime for the demo data ledger.
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
              One row per student × structure × billing cycle.
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono">
            schema preview
          </Badge>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
            {[
              ["studentId", "FK → User.id"],
              ["structureId", "FK → FeeStructure.id"],
              ["amount", "Charged"],
              ["paidAmount", "Settled so far"],
              ["dueDate", "When payment is due"],
              ["paidDate", "Settlement timestamp (nullable)"],
              ["status", "paid · pending · overdue · partial"],
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

      <div className="flex justify-end">
        <Link
          href="/dashboard/superadmin/fees"
          className="text-xs text-muted-foreground hover:underline"
        >
          ← Back to fees master
        </Link>
      </div>
    </SuperadminPage>
  );
};

export default page;
