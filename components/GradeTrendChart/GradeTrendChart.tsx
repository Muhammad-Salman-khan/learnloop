"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type WeeklyPoint = {
  readonly week: string;
  readonly averageGrade: number;
};

type GradeTrendChartProps = {
  readonly data: ReadonlyArray<WeeklyPoint>;
};

// One steel blue bar per week. Single accent, mono labels, no "good/bad" color coding
// to avoid the AI-tell of color = sentiment.
const chartConfig: ChartConfig = {
  averageGrade: {
    label: "Average grade",
    color: "var(--chart-1)",
  },
};

export function GradeTrendChart({ data }: GradeTrendChartProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="font-display text-xl font-medium tracking-tight">
          Grade trajectory
        </CardTitle>
        <CardDescription>
          Term average, weighted across 6 active courses. Target line is 90.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer
          config={chartConfig}
          className="h-56 w-full"
        >
          <BarChart data={data as WeeklyPoint[]} accessibilityLayer>
            <CartesianGrid
              strokeDasharray="2 4"
              vertical={false}
              stroke="var(--border)"
            />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={11}
              stroke="var(--muted-foreground)"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              fontSize={11}
              width={32}
              domain={[60, 100]}
              stroke="var(--muted-foreground)"
            />
            <ChartTooltip
              cursor={{ fill: "var(--muted)" }}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="averageGrade" radius={[3, 3, 0, 0]} maxBarSize={22}>
              {(data as WeeklyPoint[]).map((entry) => (
                <Cell
                  key={entry.week}
                  fill={
                    entry.averageGrade >= 90
                      ? "var(--chart-2)"
                      : "var(--chart-1)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default GradeTrendChart;
