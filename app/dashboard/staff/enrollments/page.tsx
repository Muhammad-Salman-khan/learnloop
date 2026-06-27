import Link from "next/link";
import { Plus } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";

import {
  adminEnrollments,
  findCourse,
  findUser,
} from "@/lib/staff/staff-data";
import { formatDateLong } from "@/lib/admin/formatters";

const page = () => {
  const rows = [...adminEnrollments]
    .sort((a, b) =>
      a.enrolledAt < b.enrolledAt ? 1 : -1,
    )
    .map((e) => ({
      enrollment: e,
      student: findUser(e.studentUserId),
      course: findCourse(e.courseId),
    }));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Staff · Enrollments
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            All enrollments
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            Every student ↔ course pairing in the platform, including manually
            added entries. Newest first.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/dashboard/staff/enrollments/new">
            <Plus className="mr-1.5 size-3.5" />
            Manual enrollment
          </Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Enrollment ledger
          </CardTitle>
          <CardDescription className="text-xs">
            {rows.length} total · including draft and live courses.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Student</TableHead>
                <TableHead className="hidden md:table-cell">Course</TableHead>
                <TableHead className="hidden md:table-cell">
                  Enrolled on
                </TableHead>
                <TableHead className="text-right">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="px-5 py-10 text-center text-xs text-muted-foreground"
                  >
                    No enrollments yet.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map(({ enrollment, student, course }) => (
                  <TableRow key={enrollment.id}>
                    <TableCell className="pl-5">
                      {student ? (
                        <Link
                          href={`/dashboard/staff/students/${student.id}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {student.name}
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Unknown
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                          {course?.code ?? "—"}
                        </span>
                        <span className="text-xs">
                          {course?.title ?? "Untitled course"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                      {formatDateLong(enrollment.enrolledAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="font-mono">
                        {enrollment.progressPct}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
