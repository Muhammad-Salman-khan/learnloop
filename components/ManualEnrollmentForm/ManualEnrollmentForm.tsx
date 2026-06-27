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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  manualEnrollmentSchema,
  type ManualEnrollmentValues,
} from "@/lib/staff/schemas";
import type {
  AdminCourse,
  AdminStudent,
  AdminUser,
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

type ManualEnrollmentFormProps = {
  readonly students: ReadonlyArray<{
    readonly student: AdminStudent;
    readonly user: AdminUser;
  }>;
  readonly courses: ReadonlyArray<AdminCourse>;
  readonly preselectedStudentId?: string;
};

export function ManualEnrollmentForm({
  students,
  courses,
  preselectedStudentId,
}: ManualEnrollmentFormProps) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      studentUserId: preselectedStudentId ?? "",
      courseId: "",
      notes: "",
    } as ManualEnrollmentValues,
    validators: {
      onChange: manualEnrollmentSchema,
      onSubmit: manualEnrollmentSchema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 350));
      const student = students.find(
        (s) => s.student.userId === value.studentUserId,
      );
      const course = courses.find((c) => c.id === value.courseId);
      toast.success("Student enrolled", {
        description: `${student?.user.name ?? "Student"} → ${
          course?.code ?? "Course"
        }`,
      });
      router.push("/dashboard/staff/enrollments");
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
          <Link href="/dashboard/staff/enrollments">
            <ChevronLeft className="size-3.5" />
            Back to enrollments
          </Link>
        </Button>
      </div>

      <FieldGroup>
        <form.Field name="studentUserId">
          {((field: AnyFieldApi) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="studentUserId">Student</FieldLabel>
                <FieldContent>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) =>
                      field.handleChange(
                        v as ManualEnrollmentValues["studentUserId"],
                      )
                    }
                  >
                    <SelectTrigger id="studentUserId" className="h-9 w-full">
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(({ student, user }) => (
                        <SelectItem key={student.userId} value={user.id}>
                          {user.name} · {student.rollNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Only students on the platform are listed.
                  </FieldDescription>
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }) as unknown as (api: AnyFieldApi) => React.ReactNode}
        </form.Field>

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
                        v as ManualEnrollmentValues["courseId"],
                      )
                    }
                  >
                    <SelectTrigger id="courseId" className="h-9 w-full">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem
                          key={c.id}
                          value={c.id}
                          disabled={
                            c.status === "archived" && c.enrolled === 0
                          }
                        >
                          {c.code} · {c.title} ({c.status})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Live and draft courses are both eligible.
                  </FieldDescription>
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }) as unknown as (api: AnyFieldApi) => React.ReactNode}
        </form.Field>

        <form.Field name="notes">
          {((field: AnyFieldApi) => (
            <Field>
              <FieldLabel htmlFor="notes">Notes (optional)</FieldLabel>
              <FieldContent>
                <Textarea
                  id="notes"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Reason for manual enrollment, override code, etc."
                  className="min-h-20 resize-y"
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
                  Enrolling…
                </>
              ) : (
                "Create enrollment"
              )}
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/staff/enrollments">Cancel</Link>
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

export default ManualEnrollmentForm;
