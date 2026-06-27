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

import {
  findCourse,
  findStudent,
  findUser,
  gpaForStudent,
  resultRows,
} from "@/lib/staff/staff-data";
import { formatDateLong } from "@/lib/admin/formatters";

type Params = Promise<{ studentId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { studentId } = await params;
  const student = findStudent(studentId);
  const user = findUser(studentId);
  if (!student || !user) {
    notFound();
  }

  const rows = resultRows.filter((r) => r.studentUserId === studentId);
  const groupedByCourse: Record<
    string,
    { courseTitle: string; courseCode: string; rows: typeof rows }
  > = {};
  for (const r of rows) {
    const course = findCourse(r.courseId);
    const courseTitle = course?.title ?? "Untitled course";
    const courseCode = course?.code ?? r.courseId;
    if (!groupedByCourse[r.courseId]) {
      groupedByCourse[r.courseId] = {
        courseTitle,
        courseCode,
        rows: [],
      };
    }
    groupedByCourse[r.courseId]!.rows.push(r);
  }

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

      <div className="flex flex-col gap-4">
        {Object.keys(groupedByCourse).length === 0 ? (
          <Card>
            <CardContent className="px-0 py-12 text-center text-xs text-muted-foreground">
              No results on file yet.
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedByCourse).map(([courseId, group]) => {
            const courseRows = [...group.rows].sort((a, b) =>
              a.submittedOn < b.submittedOn ? 1 : -1,
            );
            const avg =
              courseRows.reduce((acc, r) => {
                const pct = r.maxScore > 0 ? (r.score / r.maxScore) * 100 : 0;
                return acc + pct;
              }, 0) / courseRows.length;
            return (
              <Card key={courseId}>
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div>
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      {group.courseCode}
                    </span>
                    <CardTitle className="mt-1 font-display text-lg font-medium">
                      {group.courseTitle}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {courseRows.length} entries · average{" "}
                      {avg.toFixed(0)}%
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/staff/courses/${courseId}`}>
                      Open course →
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y">
                    {courseRows.map((r) => {
                      const pct =
                        r.maxScore > 0
                          ? Math.round((r.score / r.maxScore) * 100)
                          : 0;
                      const grader = findUser(r.gradedByUserId);
                      return (
                        <li
                          key={r.id}
                          className="flex flex-col gap-1.5 px-6 py-3 md:flex-row md:items-center md:justify-between md:gap-3"
                        >
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="h-5 text-[10.5px]"
                              >
                                {r.kind.toUpperCase()}
                              </Badge>
                              <span className="text-sm font-medium">
                                {r.title}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              Graded by {grader?.name ?? "—"} on{" "}
                              {formatDateLong(r.submittedOn)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="font-mono">
                              {pct}%
                            </Badge>
                            <span className="font-mono text-xs text-muted-foreground">
                              {r.score}/{r.maxScore}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default page;
