import Link from "next/link";

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

import {
  adminCourses,
  findUser,
} from "@/lib/staff/staff-data";
import {
  courseStatusLabel,
} from "@/lib/admin/admin-data";
import {
  formatCurrencyPKR,
} from "@/lib/admin/formatters";

const page = () => {
  const liveCount = adminCourses.filter((c) => c.status === "live").length;
  const draftCount = adminCourses.filter((c) => c.status === "draft").length;
  const archivedCount = adminCourses.filter(
    (c) => c.status === "archived",
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Staff · Courses
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Course catalogue
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Every course on LearnHub. Open a course to manage enrolled students,
          weekly slots, and results.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Kpi label="Live courses" value={liveCount} />
        <Kpi label="Draft courses" value={draftCount} />
        <Kpi label="Archived courses" value={archivedCount} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            All courses
          </CardTitle>
          <CardDescription className="text-xs">
            {adminCourses.length} courses total.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Course</TableHead>
                <TableHead className="hidden md:table-cell">Teacher</TableHead>
                <TableHead className="hidden md:table-cell">
                  Enrollment
                </TableHead>
                <TableHead className="hidden md:table-cell">Fee</TableHead>
                <TableHead className="text-right">Status</TableHead>
                <TableHead className="pr-5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminCourses.map((course) => {
                const teacher = findUser(course.teacherUserId);
                return (
                  <TableRow key={course.id}>
                    <TableCell className="pl-5">
                      <Link
                        href={`/dashboard/staff/courses/${course.id}`}
                        className="flex flex-col gap-0.5 hover:underline"
                      >
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                          {course.code}
                        </span>
                        <span className="text-sm font-medium">
                          {course.title}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden text-xs md:table-cell">
                      {teacher?.name ?? "TBA"}
                    </TableCell>
                    <TableCell className="hidden text-xs md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-muted">
                          <div
                            className="h-1.5 rounded-full bg-primary"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round(
                                  (course.enrolled / course.capacity) * 100,
                                ),
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="font-mono tabular-nums">
                          {course.enrolled}/{course.capacity}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs md:table-cell">
                      {formatCurrencyPKR(course.feePerSeat)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          course.status === "live"
                            ? "secondary"
                            : course.status === "draft"
                              ? "outline"
                              : "ghost"
                        }
                      >
                        {courseStatusLabel(course.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/dashboard/staff/courses/${course.id}`}
                        >
                          Open
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

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <Card className="gap-2 py-5">
      <CardHeader className="px-5 pb-1">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </span>
      </CardHeader>
      <CardContent className="px-5 pt-0">
        <span className="font-display text-3xl font-medium tracking-tight">
          {value}
        </span>
      </CardContent>
    </Card>
  );
}

export default page;
