import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  adminEnrollments,
  findCourse,
  findStudent,
  findUser,
} from "@/lib/staff/staff-data";
import {
  feeStatusLabel,
} from "@/lib/admin/admin-data";
import {
  formatDateLong,
  initials,
} from "@/lib/admin/formatters";

type Params = Promise<{ courseId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { courseId } = await params;
  const course = findCourse(courseId);
  if (!course) {
    notFound();
  }
  const teacher = findUser(course.teacherUserId);

  const rows = adminEnrollments
    .filter((e) => e.courseId === courseId)
    .map((e) => {
      const student = findStudent(e.studentUserId);
      const user = findUser(e.studentUserId);
      if (!student || !user) return null;
      return {
        enrollment: e,
        student,
        user,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {course.code} · Roster
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Enrolled students
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            {rows.length} students currently on {course.title}. Taught by{" "}
            {teacher?.name ?? "—"} · enrolled{" "}
            {formatDateLong(course.createdAt)}.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link
            href={`/dashboard/staff/enrollments/new?course=${courseId}`}
          >
            <Plus className="mr-1.5 size-3.5" />
            Enroll another
          </Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Course roster
          </CardTitle>
          <CardDescription className="text-xs">
            Sorted by enrollment date.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Student</TableHead>
                <TableHead className="hidden md:table-cell">Roll</TableHead>
                <TableHead className="hidden md:table-cell">Section</TableHead>
                <TableHead className="hidden md:table-cell">Fee</TableHead>
                <TableHead className="hidden md:table-cell">
                  Enrolled on
                </TableHead>
                <TableHead className="text-right">Progress</TableHead>
                <TableHead className="pr-5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-5 py-10 text-center text-xs text-muted-foreground"
                  >
                    No students enrolled yet.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.enrollment.id}>
                    <TableCell className="pl-5">
                      <Link
                        href={`/dashboard/staff/students/${row.user.id}`}
                        className="flex items-center gap-3 hover:underline"
                      >
                        <Avatar className="size-8 rounded-md">
                          <AvatarFallback className="rounded-md bg-primary text-[11px] text-primary-foreground">
                            {initials(row.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-0.5 leading-tight">
                          <span className="text-sm font-medium">
                            {row.user.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {row.user.email}
                          </span>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs tabular-nums text-muted-foreground md:table-cell">
                      {row.student.rollNumber}
                    </TableCell>
                    <TableCell className="hidden text-xs md:table-cell">
                      Sec {row.student.section}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant={
                          row.student.feeStatus === "paid"
                            ? "secondary"
                            : row.student.feeStatus === "due"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {feeStatusLabel(row.student.feeStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                      {formatDateLong(row.enrollment.enrolledAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="font-mono">
                        {row.enrollment.progressPct}%
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/dashboard/staff/students/${row.user.id}/results`}
                        >
                          View results
                        </Link>
                      </Button>
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
