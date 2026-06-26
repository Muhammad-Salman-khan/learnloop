import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  type AdminKpi,
} from "@/lib/admin/admin-data";
import { cn } from "@/lib/utils";

type Trend = "up" | "down" | "flat";

function trendClasses(trend: Trend | undefined) {
  if (trend === "up")
    return "text-emerald-600 dark:text-emerald-400";
  if (trend === "down") return "text-rose-600 dark:text-rose-400";
  return "text-muted-foreground";
}

function TrendBadge({
  trend,
}: {
  trend: Trend | undefined;
}) {
  if (trend === "up")
    return (
      <ArrowUpRight
        className="size-3.5"
        aria-hidden="true"
      />
    );
  if (trend === "down")
    return (
      <ArrowDownRight
        className="size-3.5"
        aria-hidden="true"
      />
    );
  return <Minus className="size-3.5" aria-hidden="true" />;
}

type AdminStatStripProps = {
  readonly items: ReadonlyArray<AdminKpi>;
};

// Server Component. 4-up strip on desktop (2-up on tablet, 1-up on mobile).
// Matches the StatKpi visual language used in the rest of the dashboards.
export function AdminStatStrip({ items }: AdminStatStripProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} className="gap-3 py-5">
          <CardHeader className="px-5">
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              {item.label}
            </span>
          </CardHeader>
          <CardContent className="px-5 pt-0">
            <span className="font-display text-4xl font-medium leading-none tracking-tight">
              {item.value}
            </span>
            <div className="mt-3 flex items-center justify-between gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-mono text-xs",
                  trendClasses(item.trend),
                )}
              >
                <TrendBadge trend={item.trend} />
                {item.delta ?? "—"}
              </span>
              {item.hint ? (
                <span className="text-[11px] text-muted-foreground">
                  {item.hint}
                </span>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default AdminStatStrip;
