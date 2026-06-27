import Link from "next/link";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminStatStrip } from "@/components/AdminStatStrip/AdminStatStrip";
import { StaffPrintButton } from "@/components/StaffPrintButton/StaffPrintButton";
import type { AdminKpi } from "@/lib/staff/staff-data";
import {
  findCourse,
  findUser,
  SCHEDULE_WEEKDAYS,
  scheduleEntries,
  weekdayShortLabel,
} from "@/lib/staff/staff-data";

const page = () => {
  const grouped = SCHEDULE_WEEKDAYS.map((day) => ({
    day,
    slots: scheduleEntries
      .filter((s) => s.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));

  const teacherList = scheduleEntries.map((s) => s.teacherUserId);
  const teacherCount = new Set(teacherList).size;
  const roomCount = new Set(scheduleEntries.map((s) => s.room)).size;

  const kpis: ReadonlyArray<AdminKpi> = [
    {
      label: "Slots",
      value: String(scheduleEntries.length),
      hint: "Across the active term",
    },
    {
      label: "Courses in calendar",
      value: String(
        new Set(scheduleEntries.map((s) => s.courseId)).size,
      ),
      delta: "Across the term",
      trend: "flat",
    },
    { label: "Distinct teachers", value: String(teacherCount) },
    { label: "Rooms in use", value: String(roomCount) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Staff · Schedule
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Weekly timetable
          </h1>
          <p className="max-w-[72ch] text-sm text-muted-foreground md:text-base">
            Filter by course, teacher, or batch in the table below. Use print
            mode for a clean PDF-friendly version.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StaffPrintButton />
          <Button size="sm" asChild>
            <Link href="/dashboard/staff/schedule/new">
              <Plus className="mr-1.5 size-3.5" />
              Set schedule
            </Link>
          </Button>
        </div>
      </header>

      <AdminStatStrip items={kpis} />

      <div className="grid gap-4 md:grid-cols-7">
        {grouped.map(({ day, slots }) => (
          <Card key={day} className="md:col-span-1">
            <CardHeader className="pb-2">
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                {day.toUpperCase()}
              </span>
              <CardTitle className="font-display text-base font-medium">
                {weekdayShortLabel(day)}
              </CardTitle>
              <CardDescription className="text-xs">
                {slots.length} slot{slots.length === 1 ? "" : "s"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {slots.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nothing here.</p>
              ) : (
                slots.map((slot) => {
                  const course = findCourse(slot.courseId);
                  const teacher = findUser(slot.teacherUserId);
                  return (
                    <div
                      key={slot.id}
                      className="rounded-md border bg-card px-2.5 py-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono tabular-nums">
                          {slot.startTime}–{slot.endTime}
                        </span>
                        <Badge
                          variant="outline"
                          className="h-4 px-1 text-[10.5px] font-mono"
                        >
                          {slot.recurrence}
                        </Badge>
                      </div>
                      <p className="mt-1 line-clamp-1 font-medium">
                        {course?.code ?? "—"} · {course?.title ?? "Untitled"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {teacher?.name ?? "TBA"}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Room {slot.room}
                      </p>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Master schedule
          </CardTitle>
          <CardDescription className="text-xs">
            Every slot in the term, course → teacher → room.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5 w-24">Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="hidden md:table-cell">Course</TableHead>
                <TableHead className="hidden md:table-cell">Teacher</TableHead>
                <TableHead className="hidden md:table-cell">Room</TableHead>
                <TableHead className="text-right">Recurrence</TableHead>
                <TableHead className="pr-5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduleEntries.map((slot) => {
                const course = findCourse(slot.courseId);
                const teacher = findUser(slot.teacherUserId);
                return (
                  <TableRow key={slot.id}>
                    <TableCell className="pl-5 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      {weekdayShortLabel(slot.day)}
                    </TableCell>
                    <TableCell className="font-mono text-xs tabular-nums">
                      {slot.startTime}–{slot.endTime}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                          {course?.code ?? "—"}
                        </span>
                        <span className="text-xs">
                          {course?.title ?? "Untitled"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-xs md:table-cell">
                      {teacher?.name ?? "TBA"}
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs md:table-cell">
                      {slot.room}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-mono">
                        {slot.recurrence}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/dashboard/staff/schedule/${slot.id}/edit`}
                        >
                          Edit
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
