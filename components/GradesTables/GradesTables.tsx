import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  AssignmentScore,
  CourseGradeRow,
} from "@/lib/dashboard/student-data";

type CourseGradesTableProps = {
  readonly rows: ReadonlyArray<CourseGradeRow>;
};

function standingVariant(gpa: number): "default" | "secondary" | "outline" {
  if (gpa >= 3.7) return "default";
  if (gpa >= 3.0) return "secondary";
  return "outline";
}

function standingLabel(gpa: number): string {
  if (gpa >= 3.7) return "Honours";
  if (gpa >= 3.0) return "On track";
  return "Watch";
}

// First table on the Grades page: per-course summary.
export function CourseGradesTable({ rows }: CourseGradesTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 border-b sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Workspace
          </span>
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            Term grade summary
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Per-course credits, completion, and term GPA. Standing is derived
            from weighted GPA.
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Course</TableHead>
              <TableHead className="hidden md:table-cell">Instructor</TableHead>
              <TableHead className="hidden md:table-cell text-right">
                Credits
              </TableHead>
              <TableHead className="w-[200px]">Completion</TableHead>
              <TableHead className="text-right">Term GPA</TableHead>
              <TableHead className="pr-6 text-right">Standing</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const pct = Math.round((row.completed / row.total) * 100);
              return (
                <TableRow key={row.id}>
                  <TableCell className="pl-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                        {row.code}
                      </span>
                      <span className="font-medium leading-tight">
                        {row.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Current grade:{" "}
                        <span className="font-mono tabular-nums text-foreground">
                          {row.currentGrade}
                        </span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    {row.instructor}
                  </TableCell>
                  <TableCell className="hidden text-right font-mono text-xs tabular-nums text-muted-foreground md:table-cell">
                    {row.credits}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Progress
                        value={pct}
                        className="h-1.5 w-24 sm:w-32"
                      />
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {row.completed}/{row.total}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums">
                    {row.termGpa.toFixed(1)}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Badge variant={standingVariant(row.termGpa)}>
                      {standingLabel(row.termGpa)}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

type AssignmentBreakdownTableProps = {
  readonly scores: ReadonlyArray<AssignmentScore>;
};

function statusVariant(
  status: AssignmentScore["status"]
): "default" | "secondary" | "outline" {
  if (status === "late") return "outline";
  if (status === "pending") return "secondary";
  return "default";
}

function statusLabel(status: AssignmentScore["status"]): string {
  if (status === "late") return "Late";
  if (status === "pending") return "Pending";
  return "Graded";
}

// Second table on the Grades page: assignment-level breakdown.
export function AssignmentBreakdownTable({
  scores,
}: AssignmentBreakdownTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 border-b sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Workspace
          </span>
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            Assignment breakdown
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Per-assignment scores, weights, and submission state. Sum of
            weights here totals 100% across graded items.
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Assignment</TableHead>
              <TableHead className="hidden md:table-cell">Course</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden text-right md:table-cell">
                Weight
              </TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead className="pr-6 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="pl-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium leading-tight">
                      {row.title}
                    </span>
                    <span className="font-mono text-[10.5px] text-muted-foreground">
                      {row.submittedAt}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground md:table-cell">
                  {row.courseCode}
                </TableCell>
                <TableCell className="hidden text-sm capitalize text-muted-foreground md:table-cell">
                  {row.category}
                </TableCell>
                <TableCell className="hidden text-right font-mono text-xs tabular-nums text-muted-foreground md:table-cell">
                  {row.weight}%
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {row.status === "graded" ? (
                    row.score
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Badge variant={statusVariant(row.status)}>
                    {statusLabel(row.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
