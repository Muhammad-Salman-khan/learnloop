import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminStatStrip } from "@/components/AdminStatStrip/AdminStatStrip";

import {
  findCourse,
  findUser,
  gradeLetter,
  gpaForStudent,
  percentFromRow,
  resultRows,
  resultKindLabel,
} from "@/lib/staff/staff-data";
import {
  formatDateLong,
} from "@/lib/admin/formatters";

type Params = Promise<{ courseId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { courseId } = await params;
  const course = findCourse(courseId);
  if (!course) {
    notFound();
  }

  const rows = resultRows
    .filter((r) => r.courseId === courseId)
    .sort((a, b) => (a.submittedOn < b.submittedOn ? 1 : -1));

  const byStudent: Record<
    string,
    { rows: typeof rows; avg: number; letter: string }
  > = {};
  for (const r of rows) {
    if (!byStudent[r.studentUserId]) {
      byStudent[r.studentUserId] = { rows: [], avg: 0, letter: "—" };
    }
    byStudent[r.studentUserId]!.rows.push(r);
  }
  Object.values(byStudent).forEach((entry) => {
    const avg =
      entry.rows.reduce((acc, r) => acc + percentFromRow(r), 0) /
      entry.rows.length;
    entry.avg = Math.round(avg);
    entry.letter = gradeLetter(entry.avg);
  });

  const avgAll =
    rows.reduce((acc, r) => acc + percentFromRow(r), 0) /
    Math.max(1, rows.length);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 gap-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/dashboard/staff/results">
              <ArrowLeft className="size-3.5" />
              Back to master results
            </Link>
          </Button>
          <span className="mt-2 block text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {course.code} · Results
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Graded work for {course.title}
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            {rows.length} entries · course average {avgAll.toFixed(0)}%.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/dashboard/staff/results/export?course=${courseId}`}
            >
              <Download className="mr-1.5 size-3.5" />
              Export course
            </Link>
          </Button>
        </div>
      </header>

      <AdminStatStrip
        items={[
          { label: "Entries graded", value: String(rows.length) },
          { label: "Students covered", value: String(Object.keys(byStudent).length) },
          { label: "Course average", value: `${avgAll.toFixed(0)}%`, trend: "up" },
          { label: "Top performer", value: topPerformer(byStudent) ?? "—" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            By student
          </CardTitle>
          <CardDescription className="text-xs">
            One row per student with average score and letter grade.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {Object.entries(byStudent).map(([userId, entry]) => {
              const student = findUser(userId);
              const gpa = gpaForStudent(userId);
              return (
                <li
                  key={userId}
                  className="flex flex-col gap-2 px-6 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/dashboard/staff/students/${userId}/results`}
                      className="text-sm font-medium hover:underline"
                    >
                      {student?.name ?? "—"}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {entry.rows.length} entries · GPA-style {gpa}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">
                      {entry.avg}%
                    </Badge>
                    <Badge variant="outline" className="font-mono">
                      {entry.letter}
                    </Badge>
                  </div>
                </li>
              );
            })}
            {Object.keys(byStudent).length === 0 ? (
              <li className="px-6 py-8 text-center text-xs text-muted-foreground">
                No results for this course yet.
              </li>
            ) : null}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            All entries
          </CardTitle>
          <CardDescription className="text-xs">
            Newest first.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {rows.map((r) => {
              const student = findUser(r.studentUserId);
              const pct = percentFromRow(r);
              return (
                <li
                  key={r.id}
                  className="flex flex-col gap-1.5 px-6 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="h-5 text-[10.5px]"
                      >
                        {resultKindLabel(r.kind).toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium">{r.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {student?.name ?? "—"} ·{" "}
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
    </div>
  );
};

function topPerformer(
  byStudent: Record<
    string,
    { rows: ReadonlyArray<unknown>; avg: number; letter: string }
  >,
): string | null {
  let bestId: string | null = null;
  let best = -Infinity;
  for (const [id, entry] of Object.entries(byStudent)) {
    if (entry.avg > best) {
      best = entry.avg;
      bestId = id;
    }
  }
  return best > 0 ? `${findUser(bestId ?? "")?.name ?? "—"} (${best}%)` : null;
}

export default page;
