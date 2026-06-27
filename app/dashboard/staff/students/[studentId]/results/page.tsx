import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { StaffStudentResultsList } from "@/components/StaffStudentResultsList/StaffStudentResultsList";
import {
  findCourse,
  findStudent,
  findUser,
  gpaForStudent,
  resultRows,
} from "@/lib/staff/staff-data";

type Params = Promise<{ studentId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { studentId } = await params;
  const student = findStudent(studentId);
  const user = findUser(studentId);
  if (!student || !user) {
    notFound();
  }

  const rows = resultRows.filter((r) => r.studentUserId === studentId);
  const gpa = gpaForStudent(studentId);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {user.name} · Results
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Quiz & assignment scores
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            Per-course breakdown with the GPA-style letter grade on the right.
            Overall average letter: <Badge className="ml-1 font-mono">{gpa}</Badge>
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link
            href={`/dashboard/staff/results/export?student=${studentId}`}
          >
            Export this student
          </Link>
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            All scored work
          </CardTitle>
          <CardDescription className="text-xs">
            {rows.length} graded entries · paginated 10 per page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaffStudentResultsList
            rows={rows.map((r) => ({
              result: r,
              course: findCourse(r.courseId),
              grader: findUser(r.gradedByUserId),
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
