import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradebookTable } from "@/components/GradebookTable/GradebookTable";
import {
  assignmentsByCourse,
  findCourse,
  getGradebookForCourse,
} from "@/lib/dashboard/teacher-data";

type Params = { courseId: string };

// Server Component. Hosts the per-course gradebook matrix: rows = enrolled
// students, columns = assignments, last column = term totals. Each cell in
// the matrix is an editable mini-form; see GradebookCellEditor.
const CourseGradebookPage = async ({
  params,
}: {
  params: Promise<Params>;
}) => {
  const { courseId } = await params;
  const course = findCourse(courseId);
  if (!course) notFound();
  const rows = getGradebookForCourse(courseId);
  const assignments = assignmentsByCourse[courseId] ?? [];
  const totalGraded = rows.reduce(
    (sum, row) =>
      sum + row.cells.filter((c) => c.status === "graded").length,
    0,
  );
  const totalCells = rows.length * assignments.length;
  const overdue = rows.filter((r) => r.feeStatus === "overdue").length;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit gap-2 text-muted-foreground hover:text-foreground"
      >
        <Link href={`/dashboard/teacher/courses/${courseId}`}>
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to course
        </Link>
      </Button>

      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {course.code} · Gradebook
        </span>
        <h1 className="font-display text-3xl font-medium leading-[1.05] tracking-tight text-balance md:text-4xl">
          Gradebook
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground">
          One row per enrolled student, one column per assignment. Click a cell
          to enter a score, leave feedback, and update submission status.
          Totals are weighted by submission and recompute as you save.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryStat
          label="Enrolled"
          value={rows.length.toString()}
          hint="active students"
        />
        <SummaryStat
          label="Assignments"
          value={assignments.length.toString()}
          hint="in this course"
        />
        <SummaryStat
          label="Graded cells"
          value={`${totalGraded} / ${totalCells || 0}`}
          hint={`${totalCells ? Math.round((totalGraded / totalCells) * 100) : 0}% complete`}
        />
        <SummaryStat
          label="Overdue fees"
          value={overdue.toString()}
          hint={overdue > 0 ? "needs follow-up" : "all clear"}
        />
      </div>

      {rows.length === 0 ? (
        <div className="rounded-md border bg-card p-12 text-center text-sm text-muted-foreground">
          No enrolled students yet for {course.title}.
        </div>
      ) : assignments.length === 0 ? (
        <div className="rounded-md border bg-card p-12 text-center text-sm text-muted-foreground">
          No assignments yet — create an assignment first; the gradebook
          appears as soon as both roster and assignments exist.
        </div>
      ) : (
        <GradebookTable rows={rows} assignments={assignments} />
      )}

      <p className="text-xs text-muted-foreground">
        Demo data only — saving a cell updates the row in memory but does not
        persist to the database. Mutations will land with the rest of the
        Prisma-backed Server Actions.
      </p>
    </div>
  );
};

function SummaryStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-md border bg-card px-4 py-3">
      <p className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-mono text-2xl font-medium tabular-nums">
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export default CourseGradebookPage;
