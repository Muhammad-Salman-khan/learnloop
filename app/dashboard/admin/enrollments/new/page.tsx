import {
  adminCourses,
  adminStudents,
  findUser,
} from "@/lib/admin/admin-data";
import type {
  AdminStudent,
  AdminUser,
} from "@/lib/admin/admin-data";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EnrollmentForm } from "@/components/EnrollmentForm/EnrollmentForm";

type Row = {
  readonly student: AdminStudent;
  readonly user: AdminUser;
};

const page = () => {
  const students: ReadonlyArray<Row> = adminStudents
    .map((s) => {
      const u = findUser(s.userId);
      return u ? { student: s, user: u } : null;
    })
    .filter((r): r is Row => r !== null);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Enrollments · Manual
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Manually enroll a student
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Skip self-signup and place a student directly into a course.
          Useful for transfers, late admissions, and roll-number overrides.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Enrollment details
          </CardTitle>
          <CardDescription className="text-xs">
            Pick the target student and the course they should be added to.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnrollmentForm
            students={students}
            courses={adminCourses}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
