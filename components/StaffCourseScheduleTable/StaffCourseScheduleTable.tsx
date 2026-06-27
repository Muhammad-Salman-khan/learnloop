"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type {
  ScheduleEntry,
  ScheduleWeekday,
} from "@/lib/staff/staff-data";
import {
  SCHEDULE_WEEKDAYS,
  findCourse,
  findUser,
  weekdayLabel,
  weekdayShortLabel,
} from "@/lib/staff/staff-data";
import { usePaginator } from "@/lib/hooks/usePagination";
import { TablePagination } from "@/components/TablePagination/TablePagination";
import {
  MobileCard,
  MobileCardList,
} from "@/components/MobileCard/MobileCard";

type StaffCourseScheduleTableProps = {
  readonly slots: ReadonlyArray<ScheduleEntry>;
};

export function StaffCourseScheduleTable({
  slots,
}: StaffCourseScheduleTableProps) {
  const [query, setQuery] = useState("");
  const [activeDay, setActiveDay] = useState<ScheduleWeekday>("mon");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return slots
      .filter((s) => s.day === activeDay)
      .filter((s) => {
        if (!q) return true;
        const c = findCourse(s.courseId);
        const t = findUser(s.teacherUserId);
        return (
          c?.title.toLowerCase().includes(q) ||
          c?.code.toLowerCase().includes(q) ||
          (t?.name.toLowerCase().includes(q) ?? false) ||
          s.room.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [slots, query, activeDay]);

  const paginator = usePaginator(list.length, 10);

  useEffect(() => {
    paginator.goTo(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, activeDay, list.length]);

  const pageSlots = paginator.slice(list);

  function summaryFor(day: ScheduleWeekday): number {
    return slots.filter((s) => s.day === day).length;
  }

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={activeDay}
        onValueChange={(v) => setActiveDay(v as ScheduleWeekday)}
        className="w-full"
      >
        {/* Day picker — horizontal scroll on small screens so the seven
            weekday buttons never wrap awkwardly. */}
        <div className="overflow-x-auto">
          <TabsList className="inline-flex h-auto w-max min-w-full justify-start gap-1 bg-transparent p-0 md:w-full md:justify-center">
            {SCHEDULE_WEEKDAYS.map((day) => (
              <TabsTrigger
                key={day}
                value={day}
                className="rounded-md border px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <span className="flex items-center gap-2 text-xs">
                  <span className="font-medium">
                    {weekdayShortLabel(day)}
                  </span>
                  <span className="text-[10.5px] uppercase tracking-[0.18em] opacity-70">
                    {summaryFor(day)}
                  </span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-xs text-muted-foreground">
            Showing slots for{" "}
            <span className="font-medium text-foreground">
              {weekdayLabel(activeDay)}
            </span>
            .
          </p>
          <div className="relative w-full lg:w-72">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter this day"
              className="h-9 pl-8 text-sm"
            />
          </div>
        </div>

        {/* Important: the TabsContent wrapper must render the same on
            any selection change. Putting two tab-panels renders 7
            separate content trees on mount — set value here, then
            render the active day once. */}
        <TabsContent value={activeDay} />
      </Tabs>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-md border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5 w-28">Time</TableHead>
              <TableHead>Course</TableHead>
              <TableHead className="hidden md:table-cell">Teacher</TableHead>
              <TableHead className="hidden md:table-cell">Room</TableHead>
              <TableHead className="hidden md:table-cell">Recurrence</TableHead>
              <TableHead className="pr-5 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageSlots.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-5 py-10 text-center text-xs text-muted-foreground"
                >
                  {list.length === 0
                    ? "Nothing scheduled this day."
                    : "Nothing on this page."}
                </TableCell>
              </TableRow>
            ) : (
              pageSlots.map((slot) => {
                const c = findCourse(slot.courseId);
                const t = findUser(slot.teacherUserId);
                return (
                  <TableRow key={slot.id}>
                    <TableCell className="pl-5 font-mono text-xs tabular-nums">
                      {slot.startTime}–{slot.endTime}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                          {c?.code ?? "—"}
                        </span>
                        <span className="text-sm font-medium">
                          {c?.title ?? "Untitled"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-xs md:table-cell">
                      {t?.name ?? "TBA"}
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs md:table-cell">
                      {slot.room}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
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
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile */}
      <MobileCardList>
        {pageSlots.length === 0 ? (
          <div className="rounded-md border bg-card p-6 text-center text-xs text-muted-foreground">
            {list.length === 0
              ? "Nothing scheduled this day."
              : "Nothing on this page."}
          </div>
        ) : (
          pageSlots.map((slot) => {
            const c = findCourse(slot.courseId);
            const t = findUser(slot.teacherUserId);
            return (
              <MobileCard
                key={slot.id}
                emphasis={
                  <Badge variant="outline" className="font-mono">
                    {weekdayShortLabel(slot.day)} · {slot.startTime}–
                    {slot.endTime}
                  </Badge>
                }
                fields={[
                  {
                    label: "Course",
                    value: c ? `${c.code} · ${c.title}` : "Untitled",
                  },
                  { label: "Teacher", value: t?.name ?? "TBA" },
                  { label: "Room", value: slot.room },
                  { label: "Recurrence", value: slot.recurrence },
                  { label: "Notes", value: slot.notes ?? "—" },
                ]}
                actions={
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <Link href={`/dashboard/staff/schedule/${slot.id}/edit`}>
                      Edit slot
                    </Link>
                  </Button>
                }
              />
            );
          })
        )}
      </MobileCardList>

      <TablePagination paginator={paginator} />
    </div>
  );
}

export default StaffCourseScheduleTable;
