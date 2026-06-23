import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AssignmentBreakdownTable,
  CourseGradesTable,
} from "@/components/GradesTables/GradesTables";
import {
  assignmentScores,
  courseGradeRows,
} from "@/lib/dashboard/student-data";

// Server Component. Grades sub-page = two stacked shadcn Tables.
const GradesPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8 md:py-12">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit gap-2 text-muted-foreground hover:text-foreground"
      >
        <Link href="/dashboard/student">
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Back to overview
        </Link>
      </Button>

      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Workspace
        </span>
        <h1 className="font-display text-3xl font-medium leading-[1.05] tracking-tight text-balance md:text-4xl">
          Grades
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground">
          Per-course grade breakdowns, term GPA, and the long view across all
          your terms. Designed for serious review, not sparkle.
        </p>
      </header>

      <CourseGradesTable rows={courseGradeRows} />
      <AssignmentBreakdownTable scores={assignmentScores} />
    </div>
  );
};

export default GradesPage;
