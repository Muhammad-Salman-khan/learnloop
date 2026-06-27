import Link from "next/link";
import { Download } from "lucide-react";

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
  StaffResultsTable,
} from "@/components/StaffResultsTable/StaffResultsTable";
import {
  RESULT_KINDS,
  adminStudents,
  findCourse,
  resultRows,
  resultKindLabel,
  percentFromRow,
  findUser,
} from "@/lib/staff/staff-data";

const page = () => {
  const total = resultRows.length;
  const totalStudents = adminStudents.length;
  const avgAll =
    resultRows.reduce((acc, r) => acc + percentFromRow(r), 0) / total;
  const coursesCounted = new Set(resultRows.map((r) => r.courseId)).size;

  const rows = resultRows.map((r) => ({
    result: r,
    course: findCourse(r.courseId),
    student: findUser(r.studentUserId),
  }));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Staff · Results
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Master results
          </h1>
          <p className="max-w-[72ch] text-sm text-muted-foreground md:text-base">
            Every quiz, assignment, midterm, and final grade across all
            courses. Filter by course or kind in the table below.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/staff/results/export">
            <Download className="mr-1.5 size-3.5" />
            Export
          </Link>
        </Button>
      </header>

      <AdminStatStrip
        items={[
          { label: "Result rows", value: String(total), hint: "Across the term" },
          { label: "Courses covered", value: String(coursesCounted) },
          {
            label: "Students with grades",
            value: String(totalStudents),
            hint: "All enrolled students have at least one",
          },
          { label: "Average %", value: `${avgAll.toFixed(0)}%`, trend: "up" },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {RESULT_KINDS.map((kind) => {
          const kindRows = resultRows.filter((r) => r.kind === kind);
          const avg =
            kindRows.length === 0
              ? 0
              : kindRows.reduce((acc, r) => acc + percentFromRow(r), 0) /
                kindRows.length;
          return (
            <Card key={kind} className="gap-2 py-5">
              <CardHeader className="px-5 pb-1">
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  {resultKindLabel(kind)}s
                </span>
              </CardHeader>
              <CardContent className="px-5 pt-0">
                <span className="font-display text-3xl font-medium tracking-tight">
                  {kindRows.length}
                </span>
                <CardDescription className="mt-1 text-xs">
                  Average scored {avg.toFixed(0)}%
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            All results joined
          </CardTitle>
          <CardDescription className="text-xs">
            {total} graded entries · paginated 10 rows per page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaffResultsTable rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
