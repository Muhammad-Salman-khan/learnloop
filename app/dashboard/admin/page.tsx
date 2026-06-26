import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Button,
} from "@/components/ui/button";

import { AdminStatStrip } from "@/components/AdminStatStrip/AdminStatStrip";

import {
  adminOverviewActivity,
  adminOverviewKpis,
  adminEnrollments,
  findUser,
  findCourse,
  feeSummary,
  adminAnnouncements,
} from "@/lib/admin/admin-data";

import {
  AdminFeeSnapshot,
} from "@/components/AdminFeeSnapshot/AdminFeeSnapshot";
import {
  AdminAnnouncementsList,
} from "@/components/AdminAnnouncementsList/AdminAnnouncementsList";
import { formatDateLong } from "@/lib/admin/formatters";

const page = () => {
  const kpis = adminOverviewKpis;
  const fee = feeSummary();
  const recentEnrollments = adminEnrollments
    .map((e) => {
      const student = findUser(e.studentUserId);
      const course = findCourse(e.courseId);
      return {
        id: e.id,
        studentName: student?.name ?? "Unknown",
        studentId: e.studentUserId,
        courseTitle: course?.title ?? "Unknown course",
        courseCode: course?.code ?? "—",
        enrolledAt: e.enrolledAt,
        progressPct: e.progressPct,
      };
    })
    .slice(-6)
    .reverse();
  const recentAnnouncements = adminAnnouncements.slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Admin · Overview
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Platform snapshot
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            The full state of LearnHub at a glance. Every number below is
            computed from mocked demo data — replace admin-data.ts with live
            Prisma queries when the platform ships.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/admin/users/new">Create user</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/dashboard/admin/announcements/new">
              New announcement
            </Link>
          </Button>
        </div>
      </header>

      <AdminStatStrip items={kpis} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AdminFeeSnapshot
          paid={fee.paid}
          unpaid={fee.unpaid}
          due={fee.due}
          collected={fee.collectedPkr}
        />

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Activity
              </span>
              <CardTitle className="mt-1 font-display text-lg font-medium">
                Recent platform activity
              </CardTitle>
              <CardDescription className="text-xs">
                Last six actions across users, fees, and content.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/admin/announcements">
                View announcements →
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="max-h-72 overflow-auto px-5 pb-5">
              <ol className="flex flex-col gap-3">
                {adminOverviewActivity.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-start gap-3 text-xs"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                    />
                    <div className="flex flex-1 flex-col gap-0.5 leading-tight">
                      <span className="text-sm">
                        <span className="font-medium">{a.actor}</span>{" "}
                        <span className="text-muted-foreground">
                          {a.verb}
                        </span>{" "}
                        <span>{a.target}</span>
                      </span>
                      <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                        {a.at}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Enrollments
              </span>
              <CardTitle className="mt-1 font-display text-lg font-medium">
                Recent enrollments
              </CardTitle>
              <CardDescription className="text-xs">
                Latest student sign-ups across all courses.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/admin/enrollments">All enrollments →</Link>
            </Button>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5">Student</TableHead>
                  <TableHead className="hidden md:table-cell">Course</TableHead>
                  <TableHead className="hidden md:table-cell">Enrolled</TableHead>
                  <TableHead className="pr-5 text-right">Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEnrollments.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="pl-5">
                      <Link
                        href={`/dashboard/admin/students/${e.studentId}`}
                        className="font-medium hover:underline"
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
                    <TableCell className="pr-5 text-right">
                      <Badge variant="secondary" className="font-mono">
                        {e.progressPct}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <AdminAnnouncementsList items={recentAnnouncements} compact />
      </div>
    </div>
  );
};

export default page;
