import Link from "next/link";
import { ArrowLeft, Building2, GraduationCap, Mail, Phone } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  teacherCourses,
  teacherOfficeHours,
  teacherProfile,
} from "@/lib/dashboard/teacher-data";

// Server Component. Public-facing profile page (separate from the editable
// settings form that lives elsewhere).
const TeacherProfilePage = () => {
  const p = teacherProfile;
  // Show only courses you teach and that are still active — an archived
  // coaching course belongs on the alumni/diploma page, not your public
  // teacher profile.
  const visibleCourses = teacherCourses.filter((c) => c.status !== "archived");

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
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

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar
                size="lg"
                className="size-16 text-base ring-1 ring-foreground/10"
                aria-hidden="true"
              >
                <AvatarFallback>{p.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  Teacher profile
                </span>
                <CardTitle className="font-display text-2xl font-medium tracking-tight">
                  {p.name}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{p.headline}</span>
                  <span aria-hidden="true">·</span>
                  <span>{p.location}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{p.timezone}</span>
                </div>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/teacher/settings#profile">
                Edit profile
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
            {p.bio}
          </p>
          <div className="flex flex-wrap gap-2">
            {p.subjects.map((s) => (
              <Badge key={s} variant="outline">
                {s}
              </Badge>
            ))}
            <Badge variant="secondary">
              {p.yearsTeaching} years teaching
            </Badge>
            <Badge variant="secondary">
              {p.totalLearners} learners to date
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            Office hours
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Recurring weekly slots students can book. Drop-ins are welcome for
            in-person hours; online hours open 15 minutes before start.
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Room</TableHead>
                <TableHead className="hidden md:table-cell">Mode</TableHead>
                <TableHead className="pr-6 text-right">Booking</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teacherOfficeHours.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell className="pl-6 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {slot.day}
                  </TableCell>
                  <TableCell className="font-mono text-sm tabular-nums">
                    {slot.startTime}-{slot.endTime}
                  </TableCell>
                  <TableCell className="text-sm">{slot.room}</TableCell>
                  <TableCell className="hidden text-sm md:table-cell">
                    <Badge variant="outline">
                      {slot.mode === "in_person"
                        ? "In person"
                        : "Live online"}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right text-xs text-muted-foreground">
                    {slot.bookingNote}
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
            Contact cards
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Channels students and the directory can use to reach you. Visibility
            column is a demo snapshot — once preferences land in Settings, the
            badges will reflect live state.
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Channel</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="hidden md:table-cell">
                  Visibility
                </TableHead>
                <TableHead className="pr-6 text-right">Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="pl-6 font-medium">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    Email
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {p.email}
                </TableCell>
                <TableCell className="hidden text-sm md:table-cell">
                  <Badge variant="outline">Instructors only</Badge>
                </TableCell>
                <TableCell className="pr-6 text-right font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                  auth
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6 font-medium">
                  <span className="inline-flex items-center gap-2">
                    <Phone className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    Phone
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {p.phone || "—"}
                </TableCell>
                <TableCell className="hidden text-sm md:table-cell">
                  <Badge variant="outline">Students only</Badge>
                </TableCell>
                <TableCell className="pr-6 text-right font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                  self-edited
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-6 font-medium">
                  <span className="inline-flex items-center gap-2">
                    <Building2 className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    Office
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  Room CS-212
                </TableCell>
                <TableCell className="hidden text-sm md:table-cell">
                  <Badge variant="outline">Directory</Badge>
                </TableCell>
                <TableCell className="pr-6 text-right font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                  registrar
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            Courses taught
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Auto-listed from your active courses. Toggle which ones show on the
            public directory from settings once that arrives.
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Cohort</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="pr-6 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleCourses.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="pl-6 font-mono text-xs uppercase tracking-[0.12em]">
                    {c.code}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2">
                      <GraduationCap
                        className="size-3.5 text-muted-foreground"
                        aria-hidden="true"
                      />
                      {c.title}
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-sm md:table-cell text-muted-foreground">
                    Cohort {c.students > 0 ? "16" : "—"}
                  </TableCell>
                  <TableCell className="hidden text-sm md:table-cell">
                    <Badge
                      variant={
                        c.status === "live"
                          ? "default"
                          : c.status === "draft"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/dashboard/teacher/courses/${c.id}`}
                      >
                        Open
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherProfilePage;
