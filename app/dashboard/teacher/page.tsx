import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RecentSubmissionsTable } from "@/components/RecentSubmissionsTable/RecentSubmissionsTable";
import {
  type TeacherActivityEntry,
  TeacherActivityFeed,
} from "@/components/TeacherActivityFeed/TeacherActivityFeed";
import { TeacherStatKpiStrip } from "@/components/TeacherStatKpiStrip/TeacherStatKpiStrip";
import { UpcomingTeachingList } from "@/components/UpcomingTeachingList/UpcomingTeachingList";
import {
  recentSubmissions,
  teacherCourses,
  teacherKpis,
  upcomingTeaching,
} from "@/lib/dashboard/teacher-data";
import { relativeTime } from "@/lib/dashboard/date-utils";

// Demo data is colocated with the import line  -  small, page-scoped.
const activity: ReadonlyArray<TeacherActivityEntry> = [
  {
    id: "af-1",
    actor: "Ayesha Siddiqui",
    verb: "submitted the assignment",
    target: "Discriminated union router",
    at: "12 min ago",
  },
  {
    id: "af-2",
    actor: "Hamza Tariq",
    verb: "completed quiz",
    target: "Conditional types basics · 84%",
    at: "1h ago",
  },
  {
    id: "af-3",
    actor: "Sara Naseem",
    verb: "commented on",
    target: "Type-safe API client kickoff thread",
    at: "2h ago",
  },
  {
    id: "af-4",
    actor: "12 students",
    verb: "started",
    target: "TS-301 · Module 4 advanced narrowing",
    at: "today",
  },
  {
    id: "af-5",
    actor: "Bilal Ashraf",
    verb: "asked a question in",
    target: "TS-301 office hours",
    at: "yesterday",
  },
];

const page = () => {
  const liveCourses = teacherCourses.filter((c) => c.status === "live").slice(0, 4);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
      <section className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <Badge variant="secondary" className="mb-3 font-mono uppercase tracking-[0.14em]">
            Teacher console, demo data
          </Badge>
          <h1 className="font-display text-3xl font-medium leading-[1.05] tracking-tight text-balance md:text-4xl lg:text-[2.75rem]">
            Your classes, at a glance.
          </h1>
          <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted-foreground md:text-base">
            23 submissions waiting, four deadlines this week, and two quiz
            attempts since Monday. Pick any card to jump straight into the work.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <Button asChild className="gap-2">
            <Link href="/dashboard/teacher/courses/new">
              <Plus className="size-3.5" aria-hidden="true" />
              New course
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/dashboard/teacher/courses">
              All courses
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      <TeacherStatKpiStrip items={teacherKpis} />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <RecentSubmissionsTable items={recentSubmissions} />
        <UpcomingTeachingList items={upcomingTeaching} />
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-medium tracking-tight">
              Live courses
            </h2>
            <p className="text-sm text-muted-foreground">
              Top four active courses by enrollment.
            </p>
          </div>
          <Link
            href="/dashboard/teacher/courses"
            className="text-sm font-medium text-foreground/80 hover:text-foreground"
          >
            See all →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {liveCourses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="font-mono text-[10.5px]">
                    {course.code}
                  </Badge>
                  <Badge variant="secondary">Live</Badge>
                </div>
                <CardTitle className="font-display text-lg font-medium leading-tight tracking-tight">
                  {course.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.subtitle}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex flex-col gap-3">
                <div className="text-xs text-muted-foreground">
                  {course.students} students · {course.modules} modules · {course.materials} materials
                </div>
                <div>
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <span className="text-muted-foreground">Avg. progress</span>
                    <span className="font-mono">{course.progressPct}%</span>
                  </div>
                  <Progress value={course.progressPct} className="mt-1 h-1.5" />
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/dashboard/teacher/courses/${course.id}`}>
                    Open course
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <TeacherActivityFeed entries={activity} />

      <p className="text-center text-xs text-muted-foreground">
        Last sync {relativeTime(new Date(Date.now() - 1000 * 60 * 7).toISOString())}
        · demo data only
      </p>
    </div>
  );
};

export default page;
