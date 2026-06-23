import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScheduleTable } from "@/components/ScheduleTable/ScheduleTable";
import { scheduleSlots } from "@/lib/dashboard/student-data";

// Server Component. The Schedule sub-page is a tabular view, per AGENTS no
// Card lists for tabular data.
const SchedulePage = () => {
  // Group by day for the small "what day is busiest" preview table.
  const counts = new Map<string, number>();
  for (const slot of scheduleSlots) {
    counts.set(slot.day, (counts.get(slot.day) ?? 0) + 1);
  }
  const daySummary = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
    (day) => [day, counts.get(day) ?? 0] as const
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit gap-2 text-muted-foreground hover:text-foreground"
      >
        <Link href="/dashboard/student">
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to overview
        </Link>
      </Button>

      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Workspace
        </span>
        <h1 className="font-display text-3xl font-medium leading-[1.05] tracking-tight text-balance md:text-4xl">
          Schedule
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground">
          Your weekly timetable, live sessions, and room locations. The summary
          below counts how many sessions land on each day.
        </p>
      </header>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            Sessions per day
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Quick read of how your week is weighted.
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Day</TableHead>
                <TableHead className="pr-6 text-right">Sessions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {daySummary.map(([day, count]) => (
                <TableRow key={day}>
                  <TableCell className="pl-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {day}
                  </TableCell>
                  <TableCell className="pr-6 text-right font-mono tabular-nums">
                    {count > 0 ? (
                      <Badge variant={count >= 3 ? "default" : "secondary"}>
                        {count} {count === 1 ? "session" : "sessions"}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">off</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ScheduleTable slots={scheduleSlots} />
    </div>
  );
};

export default SchedulePage;
