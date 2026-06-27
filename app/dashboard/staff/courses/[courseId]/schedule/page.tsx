import Link from "next/link";
import { notFound } from "next/navigation";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  findCourse,
  findUser,
  scheduleEntries,
  SCHEDULE_WEEKDAYS,
  weekdayShortLabel,
} from "@/lib/staff/staff-data";

type Params = Promise<{ courseId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { courseId } = await params;
  const course = findCourse(courseId);
  if (!course) {
    notFound();
  }

  const mySlots = scheduleEntries.filter((s) => s.courseId === courseId);

  const grouped = SCHEDULE_WEEKDAYS.map((day) => ({
    day,
    slots: mySlots
      .filter((s) => s.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {course.code} · Schedule
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Weekly slots
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            {mySlots.length} sessions scheduled for {course.title}.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/dashboard/staff/schedule/new">
            <Plus className="mr-1.5 size-3.5" />
            Add slot
          </Link>
        </Button>
      </header>

      <Tabs defaultValue="lst" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[320px]">
          <TabsTrigger value="lst">By day</TabsTrigger>
          <TabsTrigger value="tbl">Table</TabsTrigger>
        </TabsList>

        <TabsContent value="lst" className="mt-6">
          <div className="flex flex-col gap-4">
            {grouped.map(({ day, slots }) => (
              <Card key={day}>
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div>
                    <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      {day.toUpperCase()}
                    </span>
                    <CardTitle className="mt-1 font-display text-lg font-medium">
                      {weekdayShortLabel(day)}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {slots.length} slot{slots.length === 1 ? "" : "s"} on this
                      day.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y">
                    {slots.length === 0 ? (
                      <li className="px-6 py-6 text-center text-xs text-muted-foreground">
                        Nothing booked on {weekdayShortLabel(day)}.
                      </li>
                    ) : (
                      slots.map((slot) => {
                        const teacher = findUser(slot.teacherUserId);
                        return (
                          <li
                            key={slot.id}
                            className="flex flex-col gap-2 px-6 py-3 md:flex-row md:items-center md:justify-between"
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                                {slot.startTime}–{slot.endTime}
                              </span>
                              <span className="text-sm font-medium">
                                Room {slot.room} · {teacher?.name ?? "TBA"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {slot.notes ?? "No additional notes"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono">
                                {slot.recurrence}
                              </Badge>
                              <Button variant="ghost" size="sm" asChild>
                                <Link
                                  href={`/dashboard/staff/schedule/${slot.id}/edit`}
                                >
                                  Edit
                                </Link>
                              </Button>
                            </div>
                          </li>
                        );
                      })
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tbl" className="mt-6">
          <Card>
            <CardContent className="px-0 pb-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                    <th className="pl-6 py-3 text-left">Day</th>
                    <th className="py-3 text-left">Time</th>
                    <th className="py-3 text-left">Room</th>
                    <th className="py-3 text-left">Teacher</th>
                    <th className="py-3 pr-6 text-right">Recurrence</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mySlots.map((slot) => {
                    const teacher = findUser(slot.teacherUserId);
                    return (
                      <tr key={slot.id}>
                        <td className="pl-6 py-3 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                          {weekdayShortLabel(slot.day)}
                        </td>
                        <td className="py-3 font-mono text-xs">
                          {slot.startTime}–{slot.endTime}
                        </td>
                        <td className="py-3 font-mono text-xs">
                          {slot.room}
                        </td>
                        <td className="py-3 text-xs">
                          {teacher?.name ?? "TBA"}
                        </td>
                        <td className="py-3 pr-6 text-right text-xs">
                          <Badge variant="outline" className="font-mono">
                            {slot.recurrence}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                  {mySlots.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-xs text-muted-foreground"
                      >
                        No slots scheduled.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
