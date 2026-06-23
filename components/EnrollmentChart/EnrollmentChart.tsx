"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  readonly studyHours: number;
};

type EnrollmentChartProps = {
  readonly data: ReadonlyArray<WeeklyPoint>;
};

// Demo: study hours logged per week. Single-series area chart with a single
// navy accent (chart-2 in the radix-mira palette), no rainbow palette.
const chartConfig: ChartConfig = {
  studyHours: {
    label: "Study hours",
    color: "var(--chart-2)",
  },
};

export function EnrollmentChart({ data }: EnrollmentChartProps) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="font-display text-xl font-medium tracking-tight">
          Weekly study hours
        </CardTitle>
        <CardDescription>
          Hours logged across all enrolled courses, week 1 to 12 of 16.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer
          config={chartConfig}
          className="h-56 w-full"
        >
          <AreaChart data={data as WeeklyPoint[]} accessibilityLayer>
            <defs>
              <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.32}
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
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
              stroke="var(--muted-foreground)"
            />
            <ChartTooltip
              cursor={{ stroke: "var(--muted-foreground)", strokeWidth: 1, strokeDasharray: "2 4" }}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              type="monotone"
              dataKey="studyHours"
              stroke="var(--chart-2)"
              strokeWidth={2}
              fill="url(#studyGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default EnrollmentChart;
