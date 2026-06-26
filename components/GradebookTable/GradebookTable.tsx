"use client";

import * as React from "react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GradebookCellEditor } from "@/components/GradebookCellEditor/GradebookCellEditor";

import {
  letterFromScore,
  type GradebookCell,
  type GradebookRow,
  type TeacherAssignment,
} from "@/lib/dashboard/teacher-data";

type GradebookTableProps = {
  readonly rows: ReadonlyArray<GradebookRow>;
  readonly assignments: ReadonlyArray<TeacherAssignment>;
};

// One cell mutation: a row's cells array gets a new cell replacing the
// existing one by assignmentId. The parent table owns row state so a save
// in one cell re-aggregates the row's totals.
type CellUpdate = (studentId: string, next: GradebookCell) => void;

// Matrix view: rows = students, columns = assignments, last column = term
// total. Each cell renders <GradebookCellEditor /> so changes stay local.
export function GradebookTable({ rows, assignments }: GradebookTableProps) {
  // The table owns row state because saving one cell must re-derive the
  // row's weightedTotal + letterGrade. We start from the immutable fixture
  // and patch in-place as the teacher saves cells.
  const [state, setState] = useState<ReadonlyArray<GradebookRow>>(rows);

  const onCellSave = React.useCallback<CellUpdate>(
    (studentId, next) => {
      setState((prev) =>
        prev.map((row) => {
          if (row.studentId !== studentId) return row;
          const cells = row.cells.map((c) =>
            c.assignmentId === next.assignmentId ? next : c,
          );
          const { weightedTotal, letterGrade } = aggregateRow(cells);
          return { ...row, cells, weightedTotal, letterGrade };
        }),
      );
    },
    [],
  );

  return (
    <div className="overflow-x-auto rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-10 min-w-[12rem] bg-card pl-6">
              Student
            </TableHead>
            {assignments.map((a) => (
              <TableHead
                key={a.id}
                className="min-w-[6rem] text-center"
                title={a.title}
              >
                <div className="space-y-1 py-1">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                    {a.courseCode}
                  </span>
                  <p className="text-xs font-medium leading-tight text-foreground line-clamp-2">
                    {a.title}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {a.totalMarks} marks
                  </p>
                </div>
              </TableHead>
            ))}
            <TableHead className="sticky right-0 z-10 min-w-[7rem] bg-card pr-6 text-right">
              Term total
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.map((row) => (
            <TableRow key={row.studentId}>
              <TableCell className="sticky left-0 z-10 bg-card pl-6">
                <div className="flex items-center gap-3">
                  <Avatar
                    size="sm"
                    className="size-8 ring-1 ring-foreground/10"
                    aria-hidden="true"
                  >
                    <AvatarFallback className="text-[10.5px]">
                      {row.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-tight">
                      {row.studentName}
                    </p>
                    <p className="font-mono text-[10.5px] text-muted-foreground">
                      {row.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              {assignments.map((a) => {
                const cell =
                  row.cells.find((c) => c.assignmentId === a.id) ?? blankCell(a.id);
                return (
                  <TableCell key={a.id} className="p-1 text-center">
                    <GradebookCellEditor
                      cell={cell}
                      studentName={row.studentName}
                      assignmentTitle={a.title}
                      onSave={(next) => onCellSave(row.studentId, next)}
                    />
                  </TableCell>
                );
              })}
              <TableCell className="sticky right-0 z-10 bg-card pr-6 text-right">
                <RowTotal row={row} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function RowTotal({ row }: { row: GradebookRow }) {
  if (row.weightedTotal === null) {
    return (
      <span className="text-xs text-muted-foreground" title="No graded cells yet">
        —
      </span>
    );
  }
  const variant = row.weightedTotal >= 80 ? "default" : row.weightedTotal >= 70 ? "secondary" : "outline";
  return (
    <div className="flex items-center justify-end gap-2">
      <span className="font-mono tabular-nums">
        {row.weightedTotal.toFixed(1)}
      </span>
      <Badge variant={variant}>{row.letterGrade}</Badge>
    </div>
  );
}

// Empty cell used only as a defensive fall-back if a row misses an
// assignment. Real fixtures supply one cell per assignment id.
function blankCell(assignmentId: string): GradebookCell {
  return {
    assignmentId,
    status: "pending",
    score: null,
    feedback: null,
    gradedAt: null,
  };
}

// Compute weighted total + letter from the row's cells. Currently a flat
// mean; once the Assignment each carries a `weight` field the aggregation
// switches to weighted mean without changing the call site.
function aggregateRow(cells: ReadonlyArray<GradebookCell>): {
  weightedTotal: number | null;
  letterGrade: string | null;
} {
  const scored = cells.filter((c) => c.score !== null);
  if (scored.length === 0) {
    return { weightedTotal: null, letterGrade: null };
  }
  const mean =
    scored.reduce((sum, c) => sum + (c.score ?? 0), 0) / scored.length;
  const rounded = Math.round(mean * 10) / 10;
  return {
    weightedTotal: rounded,
    letterGrade: letterFromScore(rounded),
  };
}

export default GradebookTable;
