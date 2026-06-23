import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

type StatKpiProps = {
  readonly label: string;
  readonly value: string;
  readonly delta: string;
  readonly trend: "up" | "down" | "flat";
  readonly footnote: string;
};

function trendClasses(trend: StatKpiProps["trend"]) {
  if (trend === "up") return "text-emerald-600 dark:text-emerald-400";
  if (trend === "down") return "text-rose-600 dark:text-rose-400";
  return "text-muted-foreground";
}

function TrendIcon({ trend }: { trend: StatKpiProps["trend"] }) {
  if (trend === "up") return <ArrowUpRight className="size-3.5" aria-hidden="true" />;
  if (trend === "down") return <ArrowDownRight className="size-3.5" aria-hidden="true" />;
  return <Minus className="size-3.5" aria-hidden="true" />;
}

// Server component. Single KPI card with bare knuckle layout:
// notch over the number small, value dominant in serif display, footnote in micro caps.
// No icon-as-decoration on the card itself (the trend glyph is functional).
export function StatKpi({ label, value, delta, trend, footnote }: StatKpiProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card p-5">
      <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span className="font-display text-4xl font-medium leading-none tracking-tight">
        {value}
      </span>
      <div className="flex items-center justify-between gap-2 pt-1">
        <span
          className={cn(
            "inline-flex items-center gap-1 font-mono text-xs",
            trendClasses(trend),
          )}
        >
          <TrendIcon trend={trend} />
          {delta}
        </span>
        <span className="text-xs text-muted-foreground">{footnote}</span>
      </div>
    </div>
  );
}

export default StatKpi;
