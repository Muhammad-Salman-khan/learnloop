"use client";

/* eslint-disable react/no-children-prop -- TanStack Form requires render-prop `children` on <form.Field>. */

import * as React from "react";
import { Loader2, Save } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import {
  type GradebookCell,
  type GradebookCellStatus,
} from "@/lib/dashboard/teacher-data";

// Editor schema kept inline because it is single-use; pulling in another
// zod file would just rename variables. Fields mirror the GradebookCell type
// with the Zod v4 + TanStack rule applied: z.number() only (no z.coerce), and
// the String -> number cast happens at the onChange boundary.
const cellEditorSchema = (() => {
  // We deliberately use the global zod via inline z.object to avoid creating
  // a tiny new file. Build the schema via a local helper so the inferred
  // type is reusable at the call site.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { z } = require("zod") as typeof import("zod");
  return z.object({
    score: z
      .number({ message: "Enter a score." })
      .min(0, "Score cannot be below 0.")
      .max(100, "Score cannot exceed 100."),
    // Treat empty/whitespace as the empty string and cap length. Optional
    // .default("") would change the inferred shape to string|undefined
    // which makes TanStack's StandardSchemaV1 input contract disagree
    // with our CellEditorValues - so we keep it required-string here.
    feedback: z
      .string()
      .max(800, "Feedback is too long (max 800 chars)."),
    status: z.enum(["pending", "submitted", "late", "graded"]),
  });
})();

type CellEditorValues = {
  score: number;
  feedback: string;
  status: GradebookCellStatus;
};

function FieldInfo({ field }: { field: AnyFieldApi }) {
  const errors = field.state.meta.errors;
  if (!errors.length) return null;
  const first = errors[0];
  const message =
    first && typeof first === "object" && "message" in first
      ? String(first.message)
      : typeof first === "string"
        ? first
        : "Invalid value.";
  return <FieldError errors={[{ message }]} />;
}

type GradebookCellEditorProps = {
  readonly cell: GradebookCell;
  readonly studentName: string;
  readonly assignmentTitle: string;
  readonly onSave: (next: GradebookCell) => void;
};// One editable cell in the gradebook. Opens a Popover with a TanStack-Form
// mini form: score (number, 0-100) + feedback (textarea, optional) + status
// (select). Submitting the form calls onSave with the merged cell value.
export function GradebookCellEditor({
  cell,
  studentName,
  assignmentTitle,
  onSave,
}: GradebookCellEditorProps) {
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm({
    defaultValues: {
      score: cell.score ?? 0,
      feedback: cell.feedback ?? "",
      status: cell.status,
    } satisfies CellEditorValues,
    validators: {
      onChange: cellEditorSchema,
      // Cast: validators is typed against FormState<unknown>; zod schema's
      // inferred shape is fine at runtime because TanStack uses
      // StandardSchemaV1.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubmit: cellEditorSchema as any,
    },
    onSubmit: async ({ value }) => {
      setSubmitting(true);
      // Demo: no Server Action yet (mutations land alongside the rest of
      // the dashboard). The row state is patched in the parent; the toast
      // is the user-visible signal that the cell was saved.
      await new Promise((r) => setTimeout(r, 250));
      setSubmitting(false);
      onSave({
        assignmentId: cell.assignmentId,
        status: value.status,
        score: value.status === "graded" ? value.score : cell.score,
        feedback: value.feedback.length > 0 ? value.feedback : null,
        gradedAt: value.status === "graded" ? new Date().toISOString() : null,
      });
      toast.success("Cell saved", {
        description: `${studentName} · ${assignmentTitle}`,
      });
      setOpen(false);
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-full items-center justify-center rounded-md border bg-background px-2 text-sm tabular-nums transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Edit grade for ${studentName} on ${assignmentTitle}`}
        >
          <CellDisplay cell={cell} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-80 p-4"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <FieldGroup className="gap-3">
            <div className="space-y-0.5">
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Edit grade
              </span>
              <p className="text-sm font-medium leading-tight">
                {studentName}
              </p>
              <p className="text-xs text-muted-foreground">{assignmentTitle}</p>
            </div>

            <form.Field
              name="score"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="gap-1.5">
                    <FieldLabel htmlFor={field.name}>Score (0-100)</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={100}
                      step={1}
                      className="font-mono tabular-nums"
                      value={Number.isFinite(field.state.value)
                        ? field.state.value
                        : ""}
                      onChange={(e) => {
                        // Zod v4 gotcha: z.coerce.number() typed as unknown
                        // to TanStack validators - coerce at boundary instead.
                        const next = e.target.value;
                        field.handleChange(
                          next === "" ? 0 : Number(next),
                        );
                      }}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    <FieldInfo field={field} />
                  </Field>
                );
              }}
            />

            <form.Field
              name="status"
              children={(field) => (
                <Field className="gap-1.5">
                  <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) =>
                      field.handleChange(v as GradebookCellStatus)
                    }
                  >
                    <SelectTrigger id={field.name} className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="graded">Graded</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <form.Field
              name="feedback"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="gap-1.5">
                    <FieldLabel htmlFor={field.name}>
                      Feedback <span className="text-muted-foreground">(optional)</span>
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      rows={3}
                      placeholder="What went well or what to revisit..."
                      className="resize-none"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                    />
                    <FieldInfo field={field} />
                  </Field>
                );
              }}
            />

            <div className="flex items-center justify-between gap-2 pt-1">
              <form.Subscribe
                selector={(s) => ({
                  canSubmit: s.canSubmit,
                  isSubmitting: s.isSubmitting,
                })}
                children={({ canSubmit }) => (
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!canSubmit || submitting}
                    className="gap-2"
                  >
                    {submitting ? (
                      <Loader2
                        className="size-3.5 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <Save className="size-3.5" aria-hidden="true" />
                    )}
                    Save cell
                  </Button>
                )}
              />
              <Badge variant="outline" className="font-mono text-[10.5px]">
                Enter 0-100
              </Badge>
            </div>
          </FieldGroup>
        </form>
      </PopoverContent>
    </Popover>
  );
}

function CellDisplay({ cell }: { cell: GradebookCell }) {
  if (cell.status === "graded" && cell.score !== null) {
    return (
      <span className="font-mono text-sm tabular-nums">
        {Math.round(cell.score)}
      </span>
    );
  }
  const labels: Record<GradebookCellStatus, string> = {
    pending: "—",
    submitted: "...",
    late: "L",
    graded: "—",
  };
  const colors: Record<GradebookCellStatus, string> = {
    pending: "text-muted-foreground",
    submitted: "text-foreground",
    late: "text-amber-500",
    graded: "text-muted-foreground",
  };
  return (
    <span className={`font-mono text-[11px] uppercase tracking-[0.12em] ${colors[cell.status]}`}>
      {labels[cell.status]}
    </span>
  );
}

export default GradebookCellEditor;
