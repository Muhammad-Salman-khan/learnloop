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
import type { CourseGradeRow } from "@/lib/dashboard/student-data";

type CoursesTableProps = {
  readonly rows: ReadonlyArray<CourseGradeRow>;
};

function gpaVariant(gpa: number): "default" | "secondary" | "outline" {
  if (gpa >= 3.7) return "default";
  if (gpa >= 3.0) return "secondary";
  return "outline";
}

function gpaLabel(gpa: number): string {
  if (gpa >= 3.7) return "Honours";
  if (gpa >= 3.0) return "On track";
  if (gpa >= 2.0) return "Watch";
  return "At risk";
}

// Courses page. Server Component. Read-only shadcn Table; per AGENTS every row
// is a TableRow (no custom <div> rows).
export function CoursesTable({ rows }: CoursesTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 border-b">
        <div className="space-y-1">
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Workspace
          </span>
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            Course portfolio
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Six enrolled courses this term. Open the Schedule tab to see when
            each session meets.
          </p>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Course</TableHead>
              <TableHead className="hidden md:table-cell">Instructor</TableHead>
              <TableHead className="hidden md:table-cell">Credits</TableHead>
              <TableHead className="w-[200px]">Progress</TableHead>
              <TableHead className="text-right">Current grade</TableHead>
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
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                    {row.instructor}
                  </TableCell>
                  <TableCell className="hidden font-mono text-xs tabular-nums text-muted-foreground md:table-cell">
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
                    <span className="block leading-none">{row.currentGrade}</span>
                    <span className="block text-[10.5px] text-muted-foreground">
                      GPA {row.termGpa.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Badge variant={gpaVariant(row.termGpa)}>
                      {gpaLabel(row.termGpa)}
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

export default CoursesTable;
