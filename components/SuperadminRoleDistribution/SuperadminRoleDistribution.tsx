"use client";

import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function prettyRole(name: string): string {
  if (name === "superAdmin") return "Super admin";
  return name[0].toUpperCase() + name.slice(1);
}

export function SuperadminRoleDistribution({
  data,
}: {
  readonly data: ReadonlyArray<{ name: string; value: number }>;
}) {
  if (data.every((d) => d.value === 0)) {
    return (
      <p className="flex h-60 items-center justify-center text-xs text-muted-foreground">
        No users on the platform yet.
      </p>
    );
  }
  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={80}
            strokeWidth={2}
            stroke="var(--background)"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, _name, props) => {
              const v = typeof value === "number" ? value : Number(value ?? 0);
              const role = String(props?.payload?.name ?? "");
              return [v, prettyRole(role)] as [number, string];
            }}
            contentStyle={{
              fontSize: 12,
              borderRadius: 6,
              border: "1px solid var(--border)",
              background: "var(--popover)",
              color: "var(--popover-foreground)",
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconSize={8}
            wrapperStyle={{ fontSize: 11 }}
            formatter={(v: string) => prettyRole(String(v))}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SuperadminRoleDistribution;
