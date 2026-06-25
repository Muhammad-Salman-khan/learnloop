import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";

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
import { teachingSlots } from "@/lib/dashboard/teacher-data";

// Server Component. The Schedule sub-page is a tabular view, per AGENTS no
// Card lists for tabular data.
const TeacherSchedulePage = () => {
  // Per-day session count (weekday buckets) — never assumes isoDaysAhead
  // ordering, the slots are static fixtures with day labels.
  const counts = new Map<string, number>();
  for (const slot of teachingSlots) {
    counts.set(slot.day, (counts.get(slot.day) ?? 0) + 1);
  }
  const daySummary = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ].map((day) => [day, counts.get(day) ?? 0] as const);

  // Surface one demo conflict: on Friday there's a live online lecture
  // (TS-301) and an in-person invigilation (PG-220) one hour apart from the
  // same instructor (you). Real detection would compare current user against
  // slot owner — here we just read role overlap from fixture data.
  const conflicts: ReadonlyArray<{
    day: string;
    note: string;
    slotIds: ReadonlyArray<string>;
  }> = (() => {
    // Mark Friday if the same instructor has 2+ slots that day — they all
    // belong to the same user in this demo. (Real DB would join by
    // instructorId.)
    const byDay = new Map<string, string[]>();
    for (const s of teachingSlots) {
      const arr = byDay.get(s.day) ?? [];
      arr.push(s.id);
      byDay.set(s.day, arr);
    }
    const out: { day: string; note: string; slotIds: string[] }[] = [];
    for (const [day, ids] of byDay) {
      if (ids.length >= 2) {
        out.push({
          day,
          note: `${ids.length} sessions on ${day} — hours stack tightly.`,
          slotIds: ids,
        });
      }
    }
    return out;
  })();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit gap-2 text-muted-foreground hover:text-foreground"
      >
        <Link href="/dashboard/teacher">
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to dashboard
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
          Your teaching week: lectures, labs, tutorials, office hours, and any
          invigilation duty. Counts below show how many slots land on each day.
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
                      <Badge
                        variant={count >= 3 ? "default" : "secondary"}
                      >
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

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            Teaching week
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Every slot you teach this term, ordered by day and start time.
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="hidden md:table-cell">Cohort</TableHead>
                <TableHead className="hidden lg:table-cell">Room</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead className="pr-6">Mode</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachingSlots.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="pl-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {s.day}
                  </TableCell>
                  <TableCell className="font-mono text-sm tabular-nums">
                    {s.startTime}-{s.endTime}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                        {s.courseCode}
                      </p>
                      <p className="text-sm">{s.courseTitle}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-sm md:table-cell text-muted-foreground">
                    {s.cohort}
                  </TableCell>
                  <TableCell className="hidden text-sm lg:table-cell font-mono">
                    {s.room}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{s.kind.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell className="pr-6">
                    <Badge
                      variant={
                        s.mode === "in_person"
                          ? "default"
                          : s.mode === "live_online"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {s.mode === "in_person"
                        ? "In person"
                        : s.mode === "live_online"
                          ? "Live online"
                          : "Recorded"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {conflicts.length > 0 ? (
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="font-display text-xl font-medium tracking-tight">
              Conflict warnings
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Days where multiple sessions stack. Real conflict detection joins
              by instructor id once assignments live in the database.
            </p>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Day</TableHead>
                  <TableHead className="pr-6">Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conflicts.map((c) => (
                  <TableRow key={c.day}>
                    <TableCell className="pl-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <AlertTriangle
                          className="size-3.5 text-amber-500"
                          aria-hidden="true"
                        />
                        {c.day}
                      </span>
                    </TableCell>
                    <TableCell className="pr-6 text-sm text-muted-foreground">
                      {c.note}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default TeacherSchedulePage;
