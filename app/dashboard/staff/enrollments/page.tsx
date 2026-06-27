import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { StaffEnrollmentsTable } from "@/components/StaffEnrollmentsTable/StaffEnrollmentsTable";
import {
  adminEnrollments,
  findCourse,
  findUser,
} from "@/lib/staff/staff-data";

const page = () => {
  const rows = [...adminEnrollments]
    .map((e) => ({
      enrollment: e,
      student: findUser(e.studentUserId),
      course: findCourse(e.courseId),
    }))
    .sort((a, b) =>
      a.enrollment.enrolledAt < b.enrollment.enrolledAt ? 1 : -1,
    );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Staff · Enrollments
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          All enrollments
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Every student ↔ course pairing on the platform, newest first. Use
          search to find a student or filter by course id.
        </p>
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
        <CardContent>
          <StaffEnrollmentsTable rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
