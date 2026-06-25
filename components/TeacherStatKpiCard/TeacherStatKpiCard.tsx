import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TeacherKpi } from "@/lib/dashboard/teacher-data";

type TeacherStatKpiCardProps = {
  readonly item: TeacherKpi;
};

function trendClasses(trend: TeacherKpi["trend"]) {
  if (trend === "up") return "text-emerald-600 dark:text-emerald-400";
  if (trend === "down") return "text-rose-600 dark:text-rose-400";
  return "text-muted-foreground";
}

function TrendIcon({ trend }: { trend: TeacherKpi["trend"] }) {
  if (trend === "up") return <ArrowUpRight className="size-3.5" aria-hidden="true" />;
  if (trend === "down") return <ArrowDownRight className="size-3.5" aria-hidden="true" />;
  return <Minus className="size-3.5" aria-hidden="true" />;
}

export function TeacherStatKpiCard({ item }: TeacherStatKpiCardProps) {
  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {item.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <span className="font-display text-4xl font-medium leading-none tracking-tight">
          {item.value}
        </span>
        <div className="mt-3 flex items-center justify-between gap-2">
          {item.delta && item.trend ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 font-mono text-xs",
                trendClasses(item.trend),
              )}
            >
              <TrendIcon trend={item.trend} />
              {item.delta}
            </span>
          ) : (
            <span />
          )}
          {item.hint && (
            <span className="text-xs text-muted-foreground">{item.hint}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default TeacherStatKpiCard;
