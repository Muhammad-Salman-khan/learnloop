"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function SuperadminBannedChart({
  banned,
  active,
}: {
  readonly banned: number;
  readonly active: number;
}) {
  const data = [
    { name: "Active", value: active },
    { name: "Banned", value: banned },
  ];
  if (active + banned === 0) {
    return (
      <p className="flex h-60 items-center justify-center text-xs text-muted-foreground">
        No users yet.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={45}
              outerRadius={70}
              strokeWidth={2}
              stroke="var(--background)"
            >
              <Cell fill="var(--chart-1)" />
              <Cell fill="var(--destructive)" />
            </Pie>
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 6,
                border: "1px solid var(--border)",
                background: "var(--popover)",
                color: "var(--popover-foreground)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-around gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span aria-hidden className="size-2 rounded-full" style={{ background: "var(--chart-1)" }} />
          <span>Active: {active}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span aria-hidden className="size-2 rounded-full" style={{ background: "var(--destructive)" }} />
          <span>Banned: {banned}</span>
        </div>
      </div>
    </div>
  );
}

export default SuperadminBannedChart;
