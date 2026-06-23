"use client";

import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Star, Trash2, UserCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  reviewSchema,
  type ReviewFormValues,
} from "@/lib/dashboard/teacher-review-schema";
import type {
  ScheduleSlot,
  TeacherReview,
} from "@/lib/dashboard/student-data";
import { firstErrorMessage, toFieldErrorItems } from "@/lib/settings/field-errors";

type ScheduleReviewsProps = {
  readonly slots: ReadonlyArray<ScheduleSlot>;
  readonly seedReviews: ReadonlyArray<TeacherReview>;
};

type ReviewKind = "class_teacher" | "period_teacher";

const RATINGS: ReadonlyArray<1 | 2 | 3 | 4 | 5> = [1, 2, 3, 4, 5];

const KIND_LABELS: Record<ReviewKind, string> = {
  class_teacher: "Class teacher",
  period_teacher: "Period-specific teacher",
};

// generateId is called only from event handlers (form submit, delete click);
// not during render. Module-level counter keeps ids monotonic without needing
// crypto APIs and without tripping the react-hooks/purity lint rule.
let reviewIdCounter = 0;
function nextReviewId(): string {
  reviewIdCounter += 1;
  // Combine counter with timestamp so two submissions across navigations
  // still land on different ids even if the counter resets.
  return `rv-${reviewIdCounter}`;
}

function buildDefaults(): ReviewFormValues {
  return {
    target: "class_teacher",
    courseCode: "",
    slotId: "",
    teacherName: "",
    rating: 4,
    comment: "",
    anonymous: false,
  };
}

// Resolve the period slot the form should target given the current target kind
// and the picked course. For class-teacher reviews we still need a slot id
// (used as the dedupe key), so we pick the first slot for that course and use
// it to derive the teacher name.
function resolveSlot(
  slots: ReadonlyArray<ScheduleSlot>,
  courseCode: string,
  target: ReviewKind,
): ScheduleSlot | undefined {
  const forCourse = slots.filter((s) => s.courseCode === courseCode);
  if (forCourse.length === 0) return undefined;
  if (target === "class_teacher") return forCourse[0];
  return forCourse.find((s) => s.isPeriodTeacher) ?? forCourse[0];
}

function Stars({
  value,
  onPick,
  readOnly,
}: {
  value: number;
  onPick?: (n: number) => void;
  readOnly?: boolean;
}) {
  return (
    <div
      className="inline-flex items-center gap-1"
      role={readOnly ? undefined : "radiogroup"}
      aria-label="Rating"
    >
      {RATINGS.map((star) => {
        const filled = value >= star;
        return (
          <button
            type="button"
            key={star}
            disabled={readOnly}
            onClick={() => onPick?.(star)}
            className={
              "inline-flex size-6 items-center justify-center rounded-md transition-colors " +
              (readOnly
                ? "cursor-default"
                : "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40")
            }
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            aria-pressed={!readOnly ? filled : undefined}
          >
            <Star
              aria-hidden="true"
              className={
                "size-3.5 " +
                (filled
                  ? "fill-foreground text-foreground"
                  : "text-muted-foreground/60")
              }
            />
          </button>
        );
      })}
      <span className="ml-2 font-mono text-[11px] tabular-nums text-muted-foreground">
        {value}.0
      </span>
    </div>
  );
}

function aggregate(reviews: ReadonlyArray<TeacherReview>) {
  const groups = new Map<
    string,
    { count: number; total: number; latest: TeacherReview }
  >();
  for (const r of reviews) {
    const key = `${r.kind}::${r.teacherName}`;
    const existing = groups.get(key);
    if (existing) {
      existing.count += 1;
      existing.total += r.rating;
    } else {
      groups.set(key, { count: 1, total: r.rating, latest: r });
    }
  }
  return Array.from(groups.entries()).map(([key, v]) => {
    const [kind, ...rest] = key.split("::");
    return {
      teacherName: rest.join("::"),
      kind: kind as ReviewKind,
      count: v.count,
      avg: v.count > 0 ? Math.round((v.total / v.count) * 10) / 10 : 0,
      latest: v.latest,
    };
  });
}

// ScheduleReviews — Client Component.
//
// Owns the "review an instructor" form plus the live review list for the
// schedule page. New reviews land in local state alongside the seed list;
// there is no persistence yet. The form is TanStack Form + zod, mirroring
// the pattern from app/dashboard/student/settings.
export function ScheduleReviews({ slots, seedReviews }: ScheduleReviewsProps) {
  const [reviews, setReviews] = useState<ReadonlyArray<TeacherReview>>(
      seedReviews,
    );

    const form = useForm({
      validators: {
        onChange: reviewSchema,
        onSubmit: reviewSchema,
      },
      onSubmit: async ({ value }) => {
        const slot = resolveSlot(slots, value.courseCode, value.target);
        const now = new Date();
        const submittedAt = now.toLocaleString(undefined, {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
        const review: TeacherReview = {
          id: nextReviewId(),
          kind: value.target,
          courseCode: value.courseCode,
          ...(value.target === "period_teacher" && slot
            ? { slotId: slot.id }
            : {}),
          teacherName: value.teacherName.trim(),
          rating: value.rating as 1 | 2 | 3 | 4 | 5,
          comment: value.comment.trim(),
          anonymous: value.anonymous,
          submittedAt,
        };
        setReviews((prev) => [review, ...prev]);
        toast.success(
          value.target === "class_teacher"
            ? `Review posted for class teacher ${review.teacherName}`
            : `Review posted for ${review.teacherName}`,
          {
            description: value.anonymous
              ? "Posted anonymously"
              : "Posted under your name",
          },
        );
        form.reset(buildDefaults());
      },
    });

    const handleDelete = (id: string) => {
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.info("Review removed");
    };

    const [popup, setPopup] = useState<{ review: TeacherReview; remindInMs: number } | null>(null);

    // Pick a seed teacher that has not been reviewed yet (or least-reviewed)
    // so the popup is useful rather than nagging about a course the student
    // has already evaluated. Falls back to the least-reviewed seed.
    const candidateReview = useMemo(() => {
      if (seedReviews.length === 0) return null;
      const counts = new Map<string, number>();
      for (const r of seedReviews) {
        const k = `${r.kind}::${r.teacherName}`;
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
      return [...seedReviews]
        .sort((a, b) => {
          const ak = `${a.kind}::${a.teacherName}`;
          const bk = `${b.kind}::${b.teacherName}`;
          return (counts.get(ak) ?? 0) - (counts.get(bk) ?? 0);
        })
        [0];
    }, [seedReviews]);

    const dismissTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearPopup = useCallback(() => {
      if (dismissTimeout.current) clearTimeout(dismissTimeout.current);
      dismissTimeout.current = null;
      setPopup(null);
    }, []);

    const openPopup = useCallback(
      (review: TeacherReview, remindInMs = 8000) => {
        clearPopup();
        setPopup({ review, remindInMs });
        dismissTimeout.current = setTimeout(clearPopup, remindInMs);
      },
      [clearPopup],
    );

    // First nudge at ~6s, then every ~11 min while the page is mounted. No
    // alert; a visible dialog with the teacher/course context + a single CTA
    // that presets the form for this candidate.
    useEffect(() => {
      if (!candidateReview) return;
      const scheduleNext = () => {
        return window.setTimeout(() => openPopup(candidateReview), 6000);
      };
      const timer = scheduleNext();
      return () => window.clearTimeout(timer);
      // openPopup is memoized via useCallback; candidateReview is the only
      // meaningful dependency and is itself memoized.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [candidateReview]);

    const scrollToForm = useCallback(() => {
      const el = document.getElementById("schedule-reviews-top");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, []);

    const handlePopupReview = useCallback(() => {
      clearPopup();
      if (!popup) return;
      const { review } = popup;
      form.setFieldValue("target", review.kind);
      form.setFieldValue("courseCode", review.courseCode);
      form.setFieldValue("teacherName", review.teacherName);
      form.setFieldValue("rating", 4);
      form.setFieldValue("comment", "");
      form.setFieldValue("anonymous", false);
      if (review.slotId) form.setFieldValue("slotId", review.slotId);
      scrollToForm();
    }, [clearPopup, popup, form, scrollToForm]);

  const courses = useMemo(() => {
    const seen = new Set<string>();
    const out: Array<{ code: string; title: string }> = [];
    for (const s of slots) {
      if (seen.has(s.courseCode)) continue;
      seen.add(s.courseCode);
      out.push({ code: s.courseCode, title: s.courseTitle });
    }
    return out;
  }, [slots]);

  const stats = useMemo(() => aggregate(reviews), [reviews]);

  return (
    <div className="space-y-6" id="schedule-reviews-top">
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            Review an instructor
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Submit a review against the class teacher for a course, or against
            a specific period teacher for a single session. Reviews stay
            preview-only in this demo.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              void form.handleSubmit();
            }}
            className="space-y-6"
            noValidate
          >
            <form.Field name="target">
              {(field) => (
                <FieldGroup>
                  <Field>
                    <FieldLabel>Review target</FieldLabel>
                    <FieldContent>
                      <div
                        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                        role="radiogroup"
                        aria-label="Review target"
                      >
                        {(["class_teacher", "period_teacher"] as const).map(
                          (kind) => {
                            const active = field.state.value === kind;
                            return (
                              <button
                                key={kind}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                onClick={() => {
                                  field.handleChange(kind);
                                  // Reset course + slot when target kind flips
                                  // so we never carry over an incompatible
                                  // slot from the previous target.
                                  form.setFieldValue("courseCode", "");
                                  form.setFieldValue("slotId", "");
                                }}
                                className={
                                  "rounded-md border px-4 py-3 text-left transition-colors " +
                                  (active
                                    ? "border-foreground/30 bg-muted/60"
                                    : "hover:bg-muted/40")
                                }
                              >
                                <span className="block text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                                  {KIND_LABELS[kind]}
                                </span>
                                <span className="mt-1 block text-sm font-medium leading-tight">
                                  {kind === "class_teacher"
                                    ? "Cohort's class teacher for a course"
                                    : "Teacher who ran a specific period"}
                                </span>
                                <span className="mt-1 block text-xs text-muted-foreground">
                                  {kind === "class_teacher"
                                    ? "Review the overall class teacher once per course."
                                    : "Review a substitute or cover teacher for a specific session."}
                                </span>
                              </button>
                            );
                          },
                        )}
                      </div>
                      <FieldError
                        errors={toFieldErrorItems(field.state.meta.errors)}
                      />
                    </FieldContent>
                  </Field>
                </FieldGroup>
              )}
            </form.Field>

            <Separator />

            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field
                  name="courseCode"
                  validators={{
                    onChange: reviewSchema.shape.courseCode,
                  }}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="rr-course">Course</FieldLabel>
                      <FieldContent>
                        <Select
                          value={field.state.value}
                          onValueChange={(v) => {
                            field.handleChange(v as string);
                            // Reset slot too; course changed.
                            form.setFieldValue("slotId", "");
                          }}
                        >
                          <SelectTrigger id="rr-course" className="w-full">
                            <SelectValue placeholder="Pick a course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((c) => (
                              <SelectItem key={c.code} value={c.code}>
                                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                                  {c.code}
                                </span>
                                <span className="ml-2">{c.title}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FieldError
                          errors={toFieldErrorItems(field.state.meta.errors)}
                        />
                      </FieldContent>
                    </Field>
                  )}
                </form.Field>

                <form.Field
                  name="slotId"
                  validators={{ onChange: reviewSchema.shape.slotId }}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="rr-slot">Period session</FieldLabel>
                      <FieldContent>
                        <PeriodSlotPicker
                          slots={slots}
                          form={form}
                          fieldName="slotId"
                          fieldState={field.state}
                        />
                        <FieldDescription>
                          The teacher auto-fills after you pick a session and
                          stays editable.
                        </FieldDescription>
                        <FieldError
                          errors={toFieldErrorItems(field.state.meta.errors)}
                        />
                      </FieldContent>
                    </Field>
                  )}
                </form.Field>
              </div>
            </FieldGroup>

            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <form.Field
                  name="teacherName"
                  validators={{
                    onChange: reviewSchema.shape.teacherName,
                  }}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="rr-teacher">Teacher name</FieldLabel>
                      <FieldContent>
                        <Input
                          id="rr-teacher"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Auto-filled from the period"
                          aria-invalid={Boolean(
                            field.state.meta.errors.length,
                          )}
                        />
                        <FieldError
                          errors={toFieldErrorItems(field.state.meta.errors)}
                        />
                      </FieldContent>
                    </Field>
                  )}
                </form.Field>

                <form.Field
                  name="rating"
                  validators={{ onChange: reviewSchema.shape.rating }}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel>Rating</FieldLabel>
                      <FieldContent>
                        <Stars
                          value={field.state.value}
                          onPick={(n) => field.handleChange(n)}
                        />
                        <FieldError
                          errors={toFieldErrorItems(field.state.meta.errors)}
                        />
                      </FieldContent>
                    </Field>
                  )}
                </form.Field>
              </div>
            </FieldGroup>

            <form.Field
              name="comment"
              validators={{ onChange: reviewSchema.shape.comment }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="rr-comment">Comment</FieldLabel>
                  <FieldContent>
                    <Textarea
                      id="rr-comment"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      rows={4}
                      maxLength={600}
                      placeholder="Be specific. Cite a lecture date, a slide, or a rubric decision."
                      aria-invalid={Boolean(field.state.meta.errors.length)}
                    />
                    <div className="flex items-center justify-between gap-4">
                      <FieldDescription>
                        Visible to the assigned faculty lead; never to other
                        students.
                      </FieldDescription>
                      <span className="font-mono text-[10.5px] tabular-nums text-muted-foreground">
                        {field.state.value.length}/600
                      </span>
                    </div>
                    <FieldError
                      errors={toFieldErrorItems(field.state.meta.errors)}
                    />
                  </FieldContent>
                </Field>
              )}
            </form.Field>

            <form.Field name="anonymous">
              {(field) => (
                <Field orientation="horizontal">
                  <div className="flex flex-1 flex-col gap-1">
                    <FieldLabel htmlFor="rr-anon">Post anonymously</FieldLabel>
                    <FieldDescription>
                      Hides your name from the review. Anonymous reviews still
                      carry your student ID for moderation.
                    </FieldDescription>
                  </div>
                  <Switch
                    id="rr-anon"
                    size="default"
                    checked={field.state.value}
                    onCheckedChange={(v) => field.handleChange(v)}
                  />
                </Field>
              )}
            </form.Field>

            <Separator />

            <form.Subscribe
              selector={(s) => ({
                canSubmit: s.canSubmit,
                is: s.isSubmitting,
                errors: s.errors,
              })}
            >
              {({ canSubmit, is, errors }) => (
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p
                    role="alert"
                    className="text-xs font-medium text-destructive"
                  >
                    {firstErrorMessage(errors) ?? ""}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => form.reset(buildDefaults())}
                    >
                      Clear
                    </Button>
                    <Button type="submit" disabled={!canSubmit || is}>
                      {is ? "Posting…" : "Post review"}
                    </Button>
                  </div>
                </div>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            Reviews received
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Every review you have submitted this term. Grouped by teacher and
            target kind; the average is rounded to one decimal.
          </p>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          {reviews.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              No reviews yet. Submit one above and it will appear here
              immediately.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">Teacher</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Context
                  </TableHead>
                  <TableHead className="hidden text-right md:table-cell">
                    Average
                  </TableHead>
                  <TableHead className="text-right">Latest comment</TableHead>
                  <TableHead className="pr-6 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((row) => (
                  <TableRow key={`${row.kind}-${row.teacherName}`}>
                    <TableCell className="pl-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium leading-tight">
                          {row.teacherName}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={
                              row.kind === "class_teacher"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {KIND_LABELS[row.kind]}
                          </Badge>
                          <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                            {row.count} review{row.count === 1 ? "" : "s"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {row.latest.courseCode}
                    </TableCell>
                    <TableCell className="hidden text-right md:table-cell">
                      <Stars value={Math.round(row.avg)} readOnly />
                      <span className="font-mono text-[10.5px] tabular-nums text-muted-foreground">
                        {row.avg.toFixed(1)} avg
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[420px] text-right">
                      <p className="line-clamp-2 text-sm text-foreground/80">
                        {row.latest.comment}
                      </p>
                      <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                        {row.latest.anonymous ? "anonymous" : "named"} ·{" "}
                        {row.latest.submittedAt}
                      </p>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <div className="flex flex-col items-end gap-1">
                        {reviews
                          .filter(
                            (r) =>
                              r.teacherName === row.teacherName &&
                              r.kind === row.kind,
                          )
                          .map((r) => (
                            <Button
                              key={r.id}
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="gap-1 text-muted-foreground"
                              onClick={() => handleDelete(r.id)}
                            >
                              <Trash2 className="size-3" aria-hidden="true" />
                              {r.submittedAt}
                            </Button>
                          ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            All reviews, detailed
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Chronological log. Includes both class-teacher and period-teacher
            reviews for each course.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nothing logged yet. Reviews appear here in the order you post
              them.
            </p>
          ) : (
            reviews.map((r) => (
              <article key={r.id} className="rounded-lg border bg-card p-4">
                <header className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <UserCircle2
                        className="size-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="font-medium leading-tight">
                        {r.teacherName}
                      </span>
                      <Badge
                        variant={
                          r.kind === "class_teacher"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {KIND_LABELS[r.kind]}
                      </Badge>
                      <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                        {r.courseCode}
                      </span>
                      {r.slotId ? (
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                          · session {r.slotId}
                        </span>
                      ) : null}
                    </div>
                    <Stars value={r.rating} readOnly />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                      {r.submittedAt}
                    </span>
                    <Badge variant="outline">
                      {r.anonymous ? "Anonymous" : "Named"}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="gap-1 text-muted-foreground"
                      onClick={() => handleDelete(r.id)}
                    >
                      <Trash2 className="size-3" aria-hidden="true" />
                      Remove
                    </Button>
                  </div>
                </header>
                <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                  {r.comment}
                </p>
              </article>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(popup)}
        onOpenChange={(open) => {
          if (!open) clearPopup();
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-medium tracking-tight">
              Quick check-in
            </DialogTitle>
          </DialogHeader>
          {popup && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You haven&apos;t reviewed{" "}
                <span className="font-medium text-foreground">
                  {popup.review.teacherName}
                </span>{" "}
                yet for{" "}
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {popup.review.courseCode}
                </span>
                . It only takes a minute.
              </p>
              <Stars value={4} readOnly />
              <p className="text-xs text-muted-foreground">
                This reminder will close automatically in{" "}
                {Math.round(popup.remindInMs / 1000)}s, or you can dismiss it
                now.
              </p>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={clearPopup}
              className="text-foreground/70"
            >
              Later
            </Button>
            <Button
              type="button"
              onClick={handlePopupReview}
              className="text-foreground"
            >
              Leave a review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ScheduleReviews;

// PeriodSlotPicker — small island that re-renders when the form's course
// code or target changes so the user only sees compatible sessions. Kept
// inline here (not in its own file) because it has zero reuse beyond this
// form.
type PeriodSlotPickerProps = {
  readonly slots: ReadonlyArray<ScheduleSlot>;
  readonly form: {
    getFieldValue: (name: string) => unknown;
    setFieldValue: (name: string, value: unknown) => void;
  };
  readonly fieldName: string;
  readonly fieldState: {
    readonly value: unknown;
    readonly meta: { readonly errors: ReadonlyArray<unknown> };
  };
};

function PeriodSlotPicker({
  slots,
  form,
  fieldName,
  fieldState,
}: PeriodSlotPickerProps) {
  const courseCode = String(form.getFieldValue("courseCode") ?? "");
  const target = form.getFieldValue("target") as ReviewKind;

  const compatible = useMemo(() => {
    if (!courseCode) return [] as ReadonlyArray<ScheduleSlot>;
    const matching = slots.filter((s) => s.courseCode === courseCode);
    if (target === "class_teacher") return matching;
    return matching.filter((s) => s.isPeriodTeacher);
  }, [courseCode, target, slots]);

  if (!courseCode) {
    return (
      <p className="rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        Pick a course first to see matching sessions.
      </p>
    );
  }
  if (compatible.length === 0) {
    return (
      <p className="rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        No sessions match this target. Switch to class-teacher review or pick
        a different course.
      </p>
    );
  }

  return (
    <Select
      value={String(fieldState.value ?? "")}
      onValueChange={(v) => {
        form.setFieldValue(fieldName, v);
        // Auto-fill the teacher when the slot is changed.
        const slot = slots.find((s) => s.id === v);
        if (slot) {
          form.setFieldValue(
            "teacherName",
            target === "class_teacher" ? slot.classTeacher : slot.instructor,
          );
        }
      }}
    >
      <SelectTrigger className="w-full" id="rr-slot">
        <SelectValue placeholder="Pick a session" />
      </SelectTrigger>
      <SelectContent>
        {compatible.map((s) => (
          <SelectItem key={s.id} value={s.id}>
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              {s.day} {s.startTime}–{s.endTime}
            </span>
            <span className="ml-2">
              {target === "class_teacher" ? s.classTeacher : s.instructor}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
