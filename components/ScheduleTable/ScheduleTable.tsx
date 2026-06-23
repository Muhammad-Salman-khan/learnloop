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
import type { ScheduleSlot } from "@/lib/dashboard/student-data";

type ScheduleTableProps = {
  readonly slots: ReadonlyArray<ScheduleSlot>;
};

function modeVariant(
  mode: ScheduleSlot["mode"]
): "default" | "secondary" | "outline" {
  if (mode === "live_online") return "default";
  if (mode === "recorded") return "secondary";
  return "outline";
}

function modeLabel(mode: ScheduleSlot["mode"]): string {
  if (mode === "live_online") return "Live online";
  if (mode === "recorded") return "Recording";
  return "In person";
}

const dayOrder: ReadonlyArray<ScheduleSlot["day"]> = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

// Schedule page. Server Component. Sorted by day then start time.
export function ScheduleTable({ slots }: ScheduleTableProps) {
  const sorted = [...slots].sort((a, b) => {
    const da = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    if (da !== 0) return da;
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 border-b sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Workspace
          </span>
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            Weekly timetable
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Lectures, labs, and live online sessions for the active term.
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6 w-[80px]">Day</TableHead>
              <TableHead className="w-[140px]">Time</TableHead>
              <TableHead>Course</TableHead>
              <TableHead className="hidden md:table-cell">
                Class teacher
              </TableHead>
              <TableHead className="hidden md:table-cell">
                Period teacher
              </TableHead>
              <TableHead className="hidden md:table-cell">Room</TableHead>
              <TableHead className="pr-6 text-right">Mode</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((slot) => (
              <TableRow key={slot.id}>
                <TableCell className="pl-6 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  {slot.day}
                </TableCell>
                <TableCell className="font-mono text-xs tabular-nums">
                  {slot.startTime}–{slot.endTime}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      {slot.courseCode}
                    </span>
                    <span className="font-medium leading-tight">
                      {slot.courseTitle}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  {slot.classTeacher}
                </TableCell>
                <TableCell className="hidden text-sm md:table-cell">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={slot.isPeriodTeacher ? "" : "text-muted-foreground"}>
                      {slot.instructor}
                    </span>
                    {slot.isPeriodTeacher ? (
                      <Badge variant="secondary">Substitute</Badge>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                  {slot.room}
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Badge variant={modeVariant(slot.mode)}>
                    {modeLabel(slot.mode)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ScheduleTable;
