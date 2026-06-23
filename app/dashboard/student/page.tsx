import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ActivityFeed } from "@/components/ActivityFeed/ActivityFeed";
import { Announcements } from "@/components/Announcements/Announcements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CourseProgressTable } from "@/components/CourseProgressTable/CourseProgressTable";
import { EnrollmentChart } from "@/components/EnrollmentChart/EnrollmentChart";
import { GradeTrendChart } from "@/components/GradeTrendChart/GradeTrendChart";
import { StatKpiStrip } from "@/components/StatKpiStrip/StatKpiStrip";
import { UpcomingList } from "@/components/UpcomingList/UpcomingList";
import {
  activityFeed,
  announcements,
  enrolledCourses,
  studentKpis,
  upcomingItems,
  weeklySeries,
} from "@/lib/dashboard/student-data";

const studyHoursSeries = weeklySeries.map(({ week, studyHours }) => ({
  week,
  studyHours,
}));

const gradeSeries = weeklySeries.map(({ week, averageGrade }) => ({
  week,
  averageGrade,
}));

const page = () => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
      <section className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <Badge variant="secondary" className="mb-3 font-mono uppercase tracking-[0.14em]">
            Smart Hub, demo data
          </Badge>
          <h1 className="font-display text-3xl font-medium leading-[1.05] tracking-tight text-balance md:text-4xl lg:text-[2.75rem]">
            Your term, at a glance.
          </h1>
          <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted-foreground md:text-base">
            Six courses in flight, four deadlines closing, and a steady climb
            in your term grade. Open any section to see what moved this week.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="self-start gap-2 md:self-auto"
        >
          <Link href="/dashboard/student/courses">
            Continue learning
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </Button>
      </section>

      <StatKpiStrip items={studentKpis} />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <EnrollmentChart data={studyHoursSeries} />
        <GradeTrendChart data={gradeSeries} />
      </section>

      <CourseProgressTable courses={enrolledCourses} />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <UpcomingList items={upcomingItems} />
        <Announcements items={announcements} />
      </section>

      <ActivityFeed entries={activityFeed} />
    </div>
  );
};

export default page;
