import Link from "next/link";
import {
  AlertOctagon,
  ArrowUpRight,
  CalendarClock,
  Megaphone,
  Plus,
  Wallet,
} from "lucide-react";

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
import {
  audienceLabel,
  buildOverviewSnapshot,
  findCourse,
  findUser,
  severityLabel,
} from "@/lib/staff/staff-data";
import {
  formatDateLong,
  relativeTime,
} from "@/lib/admin/formatters";

const page = () => {
  const snap = buildOverviewSnapshot();
  const {
    kpis,
    todaysSchedule,
    recentEnrollments,
    unreadUrgent,
    pendingFeeDues,
  } = snap;

  // Map today's schedule to display rows.
  const todaysRows = todaysSchedule.map((entry) => {
    const course = findCourse(entry.courseId);
    const teacher = findUser(entry.teacherUserId);
    return {
      id: entry.id,
      startTime: entry.startTime,
      endTime: entry.endTime,
      courseCode: course?.code ?? "—",
      courseTitle: course?.title ?? "Untitled course",
      teacherName: teacher?.name ?? "TBA",
      room: entry.room,
      recurrence: entry.recurrence,
      notes: entry.notes,
      courseId: entry.courseId,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Staff · Overview
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Today, in your loop
          </h1>
          <p className="max-w-[64ch] text-sm text-muted-foreground md:text-base">
            A focused snapshot of the four loops you own: pending fee dues, the
            day&apos;s timetable, recent enrollments, and unread urgent alerts.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/staff/notifications/new">
              <Megaphone className="mr-1.5 size-3.5" />
              Push alert
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/staff/students/new">
              <Plus className="mr-1.5 size-3.5" />
              Add student
            </Link>
          </Button>
        </div>
      </header>

      <AdminStatStrip items={kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Pending fee dues */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400"
              >
                <Wallet className="size-4" />
              </span>
              <div>
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  Pending fee dues
                </span>
                <CardTitle className="mt-1 font-display text-lg font-medium leading-tight">
                  {pendingFeeDues} students need attention
                </CardTitle>
                <CardDescription className="text-xs">
                  Across the current billing cycle.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href="/dashboard/staff/fees">
                Open fees ledger
                <ArrowUpRight className="ml-1.5 size-3.5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Today's schedule */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-300"
              >
                <CalendarClock className="size-4" />
              </span>
              <div>
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  Today&apos;s schedule
                </span>
                <CardTitle className="mt-1 font-display text-lg font-medium leading-tight">
                  {todaysRows.length} sessions running today
                </CardTitle>
                <CardDescription className="text-xs">
                  Weekly recurring unless flagged otherwise.
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/staff/schedule">Open timetable →</Link>
            </Button>
          </CardHeader>

          <CardContent className="px-0 pb-0">
            {todaysRows.length === 0 ? (
              <p className="px-6 pb-6 text-xs text-muted-foreground">
                No sessions scheduled for today.
              </p>
            ) : (
              <>
                {/* md+ desktop table */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-5 w-24">Time</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Teacher
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Room
                        </TableHead>
                        <TableHead className="pr-5 text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todaysRows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="pl-5 font-mono text-xs tabular-nums">
                            {row.startTime}–{row.endTime}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-0.5">
                              <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                                {row.courseCode}
                              </span>
                              <span className="text-sm font-medium">
                                {row.courseTitle}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden text-xs md:table-cell">
                            {row.teacherName}
                          </TableCell>
                          <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                            {row.room}
                          </TableCell>
                          <TableCell className="pr-5 text-right">
                            <Button variant="ghost" size="sm" asChild>
                              <Link
                                href={`/dashboard/staff/courses/${row.courseId}`}
                              >
                                Open
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile cards */}
                <ul className="flex flex-col gap-2 px-5 pb-5 md:hidden">
                  {todaysRows.map((row) => (
                    <li
                      key={row.id}
                      className="rounded-md border bg-card px-3 py-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono tabular-nums">
                          {row.startTime}–{row.endTime}
                        </span>
                        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                          {row.recurrence}
                        </span>
                      </div>
                      <Link
                        href={`/dashboard/staff/courses/${row.courseId}`}
                        className="mt-1 line-clamp-1 text-sm font-medium hover:underline"
                      >
                        {row.courseTitle}
                      </Link>
                      <p className="text-[11px] text-muted-foreground">
                        {row.teacherName} · Room {row.room}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent enrollments */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Recent enrollments
              </span>
              <CardTitle className="mt-1 font-display text-lg font-medium leading-tight">
                Latest student sign-ups
              </CardTitle>
              <CardDescription className="text-xs">
                Across every live and draft course.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/staff/enrollments">
                All enrollments →
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="px-0 pb-0">
            {recentEnrollments.length === 0 ? (
              <p className="px-6 pb-6 text-center text-xs text-muted-foreground">
                No enrollments this term yet.
              </p>
            ) : (
              <>
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-5">Student</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Course
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Enrolled
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentEnrollments.map((e) => (
                        <TableRow key={e.id}>
                          <TableCell className="pl-5">
                            <Link
                              href={`/dashboard/staff/students/${e.studentId}`}
                              className="text-sm font-medium hover:underline"
                            >
                              {e.studentName}
                            </Link>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                                {e.courseCode}
                              </span>
                              <span className="text-xs">{e.courseTitle}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                            {formatDateLong(e.enrolledAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <ul className="flex flex-col gap-2 px-5 pb-5 md:hidden">
                  {recentEnrollments.map((e) => (
                    <li
                      key={e.id}
                      className="rounded-md border bg-card px-3 py-2.5 text-xs"
                    >
                      <Link
                        href={`/dashboard/staff/students/${e.studentId}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {e.studentName}
                      </Link>
                      <div className="mt-0.5 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                        <span>
                          {e.courseCode} · {e.courseTitle}
                        </span>
                        <span>{formatDateLong(e.enrolledAt)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>

        {/* Unread urgent alerts */}
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive"
              >
                <AlertOctagon className="size-4" />
              </span>
              <div>
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  Urgent alerts
                </span>
                <CardTitle className="mt-1 font-display text-lg font-medium leading-tight">
                  {unreadUrgent.length} awaiting acknowledgement
                </CardTitle>
                <CardDescription className="text-xs">
                  Staff receives both normal and urgent.
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/staff/notifications">All alerts →</Link>
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {unreadUrgent.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No urgent items pending. Good work.
              </p>
            ) : (
              unreadUrgent.map((alert) => {
                const author = findUser(alert.authorUserId);
                return (
                  <article
                    key={alert.id}
                    className="flex flex-col gap-1 rounded-md border bg-card px-3 py-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium leading-tight">
                        {alert.title}
                      </span>
                      <Badge variant="destructive" className="h-5 shrink-0">
                        {severityLabel(alert.severity)}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                      {alert.message}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      <span>
                        {audienceLabel(alert.audience)} · {author?.name ?? "—"}
                      </span>
                      <span>{relativeTime(alert.publishedAt)}</span>
                    </div>
                  </article>
                );
              })
            )}
            <Button variant="outline" size="sm" asChild className="mt-1">
              <Link href="/dashboard/staff/notifications/new">
                <Megaphone className="mr-1.5 size-3.5" />
                Push new alert
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
