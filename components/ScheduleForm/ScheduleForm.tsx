"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  scheduleEntrySchema,
  type ScheduleEntryFormValues,
} from "@/lib/staff/schemas";
import {
  SCHEDULE_WEEKDAYS,
  weekdayLabel,
} from "@/lib/staff/staff-data";
import type {
  AdminCourse,
  AdminUser,
  ScheduleWeekday,
} from "@/lib/staff/staff-data";

function firstError(field: {
  state: { meta: { errors: ReadonlyArray<unknown> } };
}): string | null {
  const errors = field.state.meta.errors;
  if (!errors.length) return null;
  const first = errors[0];
  if (first && typeof first === "object" && "message" in first) {
    return String((first as { message: unknown }).message);
  }
  return typeof first === "string" ? first : null;
}

type ScheduleFormProps = {
  readonly mode: "create" | "edit";
  readonly courses: ReadonlyArray<AdminCourse>;
  readonly teachers: ReadonlyArray<AdminUser>;
  readonly defaults?: Partial<ScheduleEntryFormValues>;
  readonly cancelHref: string;
};

const RECURRENCES = ["weekly", "biweekly", "one-off"] as const;

export function ScheduleForm({
  mode,
  courses,
  teachers,
  defaults,
  cancelHref,
}: ScheduleFormProps) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      courseId: defaults?.courseId ?? "",
      teacherUserId: defaults?.teacherUserId ?? "",
      day: defaults?.day ?? ("mon" as ScheduleEntryFormValues["day"]),
      startTime: defaults?.startTime ?? "09:00",
      endTime: defaults?.endTime ?? "10:00",
      room: defaults?.room ?? "",
      recurrence: defaults?.recurrence ?? "weekly",
      notes: defaults?.notes ?? "",
    } as ScheduleEntryFormValues,
    validators: {
      onChange: scheduleEntrySchema,
      onSubmit: scheduleEntrySchema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 300));
      const course = courses.find((c) => c.id === value.courseId);
      const teacher = teachers.find((t) => t.id === value.teacherUserId);
      toast.success(
        mode === "create"
          ? "Slot added to timetable"
          : "Slot updated",
        {
          description: `${course?.code ?? "Course"} · ${weekdayLabel(
            value.day as ScheduleWeekday,
          )} ${value.startTime}–${value.endTime} · ${
            teacher?.name ?? "Teacher"
          }`,
        },
      );
      router.push(cancelHref);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-8"
    >
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link href={cancelHref}>
            <ChevronLeft className="size-3.5" />
            Back to schedule
          </Link>
        </Button>
      </div>

      <FieldGroup>
        <div className="grid gap-4 md:grid-cols-2">
          <form.Field name="courseId">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="courseId">Course</FieldLabel>
                  <FieldContent>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) =>
                        field.handleChange(
                          v as ScheduleEntryFormValues["courseId"],
                        )
                      }
                    >
                      <SelectTrigger id="courseId" className="h-9 w-full">
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.code} · {c.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }) as unknown as (api: AnyFieldApi) => React.ReactNode}
          </form.Field>

          <form.Field name="teacherUserId">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="teacherUserId">Teacher</FieldLabel>
                  <FieldContent>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) =>
                        field.handleChange(
                          v as ScheduleEntryFormValues["teacherUserId"],
                        )
                      }
                    >
                      <SelectTrigger id="teacherUserId" className="h-9 w-full">
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }) as unknown as (api: AnyFieldApi) => React.ReactNode}
          </form.Field>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <form.Field name="day">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="day">Day</FieldLabel>
                  <FieldContent>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) =>
                        field.handleChange(v as unknown as ScheduleWeekday)
                      }
                    >
                      <SelectTrigger id="day" className="h-9 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SCHEDULE_WEEKDAYS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {weekdayLabel(d)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }) as unknown as (api: AnyFieldApi) => React.ReactNode}
          </form.Field>

          <form.Field name="startTime">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="startTime">Start</FieldLabel>
                  <FieldContent>
                    <Input
                      id="startTime"
                      type="time"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={err ? true : undefined}
                    />
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }) as unknown as (api: AnyFieldApi) => React.ReactNode}
          </form.Field>

          <form.Field name="endTime">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="endTime">End</FieldLabel>
                  <FieldContent>
                    <Input
                      id="endTime"
                      type="time"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={err ? true : undefined}
                    />
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }) as unknown as (api: AnyFieldApi) => React.ReactNode}
          </form.Field>

          <form.Field name="room">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="room">Room</FieldLabel>
                  <FieldContent>
                    <Input
                      id="room"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Hall A · Lab 2 · Studio 1"
                      aria-invalid={err ? true : undefined}
                    />
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }) as unknown as (api: AnyFieldApi) => React.ReactNode}
          </form.Field>
        </div>

        <form.Field name="recurrence">
          {((field: AnyFieldApi) => (
            <Field>
              <FieldLabel htmlFor="recurrence">Recurrence</FieldLabel>
              <FieldContent>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(
                      v as ScheduleEntryFormValues["recurrence"],
                    )
                  }
                >
                  <SelectTrigger id="recurrence" className="h-9 w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RECURRENCES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r === "weekly"
                          ? "Weekly · recurring"
                          : r === "biweekly"
                            ? "Every other week"
                            : "One-off event"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Recurring slots repeat every week (or every other) on the
                  same day until removed.
                </FieldDescription>
              </FieldContent>
            </Field>
          )) as unknown as (api: AnyFieldApi) => React.ReactNode}
        </form.Field>

        <form.Field name="notes">
          {((field: AnyFieldApi) => (
            <Field>
              <FieldLabel htmlFor="notes">
                Notes (optional)
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id="notes"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="min-h-20 resize-y"
                  placeholder="Lecture-only? bring laptops. Special workshop setup?"
                />
              </FieldContent>
            </Field>
          )) as unknown as (api: AnyFieldApi) => React.ReactNode}
        </form.Field>
      </FieldGroup>

      <form.Subscribe
        selector={(s) => ({
          submitting: s.isSubmitting,
          canSubmit: s.canSubmit,
        })}
      >
        {({ submitting, canSubmit }) => (
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              disabled={!canSubmit || submitting}
              className="min-w-[9rem]"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving…
                </>
              ) : mode === "create" ? (
                "Add to timetable"
              ) : (
                "Save changes"
              )}
            </Button>
            <Button variant="ghost" asChild>
              <Link href={cancelHref}>Cancel</Link>
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

export default ScheduleForm;
