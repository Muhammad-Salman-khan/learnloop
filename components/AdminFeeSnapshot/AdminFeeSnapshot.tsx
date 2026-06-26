import Link from "next/link";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { formatCurrencyPKR } from "@/lib/admin/formatters";

type Status = "paid" | "due" | "unpaid";

type StatusRow = {
  readonly status: Status;
  readonly count: number;
  readonly icon: typeof CheckCircle2;
  readonly tone: "good" | "warn" | "danger";
  readonly label: string;
};

type AdminFeeSnapshotProps = {
  readonly paid: number;
  readonly unpaid: number;
  readonly due: number;
  readonly collected: number;
};

function toneClasses(tone: StatusRow["tone"]) {
  if (tone === "good")
    return "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10";
  if (tone === "warn")
    return "text-amber-600 dark:text-amber-400 bg-amber-500/10";
  return "text-rose-600 dark:text-rose-400 bg-rose-500/10";
}

function StatusCell({ row }: { row: StatusRow }) {
  const Icon = row.icon;
  return (
    <div className="flex items-center gap-3 rounded-md border bg-card px-3 py-2.5">
      <span
        aria-hidden="true"
        className={`flex size-8 items-center justify-center rounded-md ${toneClasses(row.tone)}`}
      >
        <Icon className="size-4" />
      </span>
      <div className="flex flex-col gap-0 leading-tight">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {row.label}
        </span>
        <span className="font-display text-xl font-medium">
          {row.count}
        </span>
      </div>
    </div>
  );
}

// Server Component. Compact fee snapshot for the overview page. The master
// fees table lives at /dashboard/admin/fees; this card just teases it.
export function AdminFeeSnapshot({
  paid,
  unpaid,
  due,
  collected,
}: AdminFeeSnapshotProps) {
  const rows: ReadonlyArray<StatusRow> = [
    {
      status: "paid",
      count: paid,
      icon: CheckCircle2,
      tone: "good",
      label: "Paid",
    },
    {
      status: "due",
      count: due,
      icon: Clock,
      tone: "warn",
      label: "Due",
    },
    {
      status: "unpaid",
      count: unpaid,
      icon: AlertTriangle,
      tone: "danger",
      label: "Unpaid",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Fees
        </span>
        <CardTitle className="mt-1 font-display text-lg font-medium">
          Months at a glance
        </CardTitle>
        <CardDescription className="text-xs">
          Current cycle, all courses rolled up.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          {rows.map((row) => (
            <StatusCell key={row.status} row={row} />
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between rounded-md bg-muted/40 px-3 py-2.5">
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Collected this cycle
          </span>
          <Badge variant="secondary" className="font-mono text-xs">
            {formatCurrencyPKR(collected)}
          </Badge>
        </div>
        <Button variant="outline" size="sm" asChild className="mt-1">
          <Link href="/dashboard/admin/fees">Open fees ledger</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default AdminFeeSnapshot;
