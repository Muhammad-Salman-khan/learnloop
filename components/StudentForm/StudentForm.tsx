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
  studentFormSchema,
  type StudentFormValues,
} from "@/lib/staff/schemas";

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

// Demo batches available for new students.
export const STAFF_STUDENT_BATCHES: ReadonlyArray<string> = [
  "Senior A · 2025-26",
  "Senior B · 2025-26",
  "Junior A · 2025-26",
  "Junior B · 2025-26",
];

export function StudentForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      batch: "",
      className: "",
      section: "",
      fatherName: "",
      motherName: "",
      dob: "",
      phoneNumber: "",
      parentPhone: "",
      address: "",
    } as StudentFormValues,
    validators: {
      onChange: studentFormSchema,
      onSubmit: studentFormSchema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 350));
      // Auto-generate a roll number prefix server-side. Mock: rollnumber is the
      // next STU-2026-NNN slot.
      const rollNumber = `STU-2026-${String(
        Math.floor(50 + Math.random() * 200),
      ).padStart(3, "0")}`;
      toast.success("Student created", {
        description: `${value.name} · roll ${rollNumber}`,
      });
      router.push(`/dashboard/staff/students`);
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
          <Link href="/dashboard/staff/students">
            <ChevronLeft className="size-3.5" />
            Back to students
          </Link>
        </Button>
      </div>

      <FieldGroup>
        {/* --- Account --- */}
        <div className="grid gap-4 md:grid-cols-2">
          <form.Field name="name">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="name">Full name</FieldLabel>
                  <FieldContent>
                    <Input
                      id="name"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Ayesha Siddiqui"
                      aria-invalid={err ? true : undefined}
                    />
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }) as unknown as (api: AnyFieldApi) => React.ReactNode}
          </form.Field>

          <form.Field name="email">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <FieldContent>
                    <Input
                      id="email"
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="ayesha@learnhub.test"
                      aria-invalid={err ? true : undefined}
                    />
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }) as unknown as (api: AnyFieldApi) => React.ReactNode}
          </form.Field>

          <form.Field name="password">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="password">
                    Temporary password
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="password"
                      type="text"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="At least 8 characters"
                      aria-invalid={err ? true : undefined}
                    />
                    <FieldDescription>
                      Shared once on first login — student is asked to change
                      it on next visit.
                    </FieldDescription>
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }) as unknown as (api: AnyFieldApi) => React.ReactNode}
          </form.Field>

          <form.Field name="batch">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="batch">Batch</FieldLabel>
                  <FieldContent>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) =>
                        field.handleChange(v as StudentFormValues["batch"])
                      }
                    >
                      <SelectTrigger id="batch" className="h-9 w-full">
                        <SelectValue placeholder="Select a batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {STAFF_STUDENT_BATCHES.map((b) => (
                          <SelectItem key={b} value={b}>
                            {b}
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

        {/* --- Class & section --- */}
        <div className="grid gap-4 md:grid-cols-2">
          <form.Field name="className">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="className">Class</FieldLabel>
                  <FieldContent>
                    <Input
                      id="className"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Senior cohort"
                      aria-invalid={err ? true : undefined}
                    />
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }) as unknown as (api: AnyFieldApi) => React.ReactNode}
          </form.Field>

          <form.Field name="section">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="section">Section</FieldLabel>
                  <FieldContent>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) =>
                        field.handleChange(v as StudentFormValues["section"])
                      }
                    >
                      <SelectTrigger id="section" className="h-9 w-full">
                        <SelectValue placeholder="A · B · C" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A", "B", "C"].map((s) => (
                          <SelectItem key={s} value={s}>
                            Section {s}
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

        {/* --- Parents --- */}
        <div className="grid gap-4 md:grid-cols-3">
          <form.Field name="fatherName">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="fatherName">
                    Father / guardian name
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="fatherName"
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

          <form.Field name="motherName">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="motherName">Mother name</FieldLabel>
                  <FieldContent>
                    <Input
                      id="motherName"
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

          <form.Field name="dob">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="dob">Date of birth</FieldLabel>
                  <FieldContent>
                    <Input
                      id="dob"
                      type="date"
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
        </div>

        {/* --- Contact --- */}
        <div className="grid gap-4 md:grid-cols-2">
          <form.Field name="phoneNumber">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="phoneNumber">Student phone</FieldLabel>
                  <FieldContent>
                    <Input
                      id="phoneNumber"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="+92 300 0000 000"
                      aria-invalid={err ? true : undefined}
                    />
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }) as unknown as (api: AnyFieldApi) => React.ReactNode}
          </form.Field>

          <form.Field name="parentPhone">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="parentPhone">Parent phone</FieldLabel>
                  <FieldContent>
                    <Input
                      id="parentPhone"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="+92 300 0000 000"
                      aria-invalid={err ? true : undefined}
                    />
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }) as unknown as (api: AnyFieldApi) => React.ReactNode}
          </form.Field>
        </div>

        <form.Field name="address">
          {((field: AnyFieldApi) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <FieldContent>
                  <Textarea
                    id="address"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="House, street, city"
                    className="min-h-20 resize-y"
                    aria-invalid={err ? true : undefined}
                  />
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }) as unknown as (api: AnyFieldApi) => React.ReactNode}
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
              className="min-w-[10rem]"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Creating student…
                </>
              ) : (
                "Create student + roll number"
              )}
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/staff/students">Cancel</Link>
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

export default StudentForm;
