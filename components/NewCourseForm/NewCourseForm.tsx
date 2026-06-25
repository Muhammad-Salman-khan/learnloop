"use client";

/* eslint-disable react/no-children-prop -- TanStack Form requires render-prop `children` on <form.Field>. */

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  newCourseDefaults,
  newCourseSchema,
  type NewCourseFormValues,
} from "@/lib/dashboard/new-course-schema";

function FieldInfo({ field }: { field: AnyFieldApi }) {
  const errors = field.state.meta.errors;
  if (!errors.length) return null;
  const first = errors[0];
  const message =
    first && typeof first === "object" && "message" in first ?
      String(first.message)
    : typeof first === "string" ? first
    : "Invalid value.";
  return <FieldError errors={[{ message }]} />;
}

export function NewCourseForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm({
    defaultValues: newCourseDefaults,
    validators: {
      onChange: newCourseSchema,
      onSubmit: newCourseSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitting(true);
      // Demo: simulate create + redirect.
      await new Promise((r) => setTimeout(r, 600));
      setSubmitting(false);
      toast.success("Course created", {
        description: `${value.code} · ${value.title}`,
      });
      router.push("/dashboard/teacher/courses");
    },
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-8"
    >
      {/* ---------- Course identity ---------- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FieldGroup className="gap-5 md:col-span-2">
          <FieldTitle className="text-base">Course identity</FieldTitle>
          <FieldDescription>
            The public-facing details shown on the catalogue and student dashboard.
          </FieldDescription>
        </FieldGroup>

        <form.Field
          name="code"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="gap-2">
                <FieldLabel htmlFor={field.name}>Course code</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="TS-301"
                  className="font-mono uppercase"
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value.toUpperCase().replace(/\s+/g, ""),
                    )
                  }
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />
                <FieldInfo field={field} />
              </Field>
            );
          }}
        />

        <form.Field
          name="title"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="gap-2">
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="TypeScript Bootcamp"
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

        <form.Field
          name="subtitle"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="gap-2 md:col-span-2">
                <FieldLabel htmlFor={field.name}>Subtitle</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="One short sentence students will see first."
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

        <form.Field
          name="description"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="gap-2 md:col-span-2">
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={5}
                  placeholder="Detailed description of what students will learn, the project's structure, and any prerequisites."
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
      </div>

      <FieldSeparator />

      {/* ---------- Pricing & status ---------- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FieldGroup className="gap-3 md:col-span-3">
          <FieldTitle className="text-base">Pricing & launch</FieldTitle>
          <FieldDescription>
            Set the seat fee and initial launch state. You can change this later.
          </FieldDescription>
        </FieldGroup>

        <form.Field
          name="feePerSeat"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="gap-2">
                <FieldLabel htmlFor={field.name}>Fee per seat</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="$129"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />
                <FieldDescription>Use $0 for free.</FieldDescription>
                <FieldInfo field={field} />
              </Field>
            );
          }}
        />

        <form.Field
          name="seats"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid} className="gap-2">
                <FieldLabel htmlFor={field.name}>Max seats</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={500}
                  value={String(field.state.value)}
                  onChange={(e) =>
                    field.handleChange(Number(e.target.value) || 0)
                  }
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
          children={(field) => {
            return (
              <Field className="gap-2">
                <FieldLabel htmlFor={field.name}>Initial status</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as NewCourseFormValues["status"])
                  }
                >
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft (private)</SelectItem>
                    <SelectItem value="live">Live (open enrolment)</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            );
          }}
        />
      </div>

      <FieldSeparator />

      {/* ---------- Notifications ---------- */}
      <form.Field
        name="notifyOnSubmission"
        children={(field) => (
          <Field
            orientation="horizontal"
            className="items-center justify-between gap-3 rounded-lg border bg-muted/30 p-4"
          >
            <FieldContent>
              <FieldLabel htmlFor={field.name}>
                Email me on every submission
              </FieldLabel>
              <FieldDescription>
                Off during grading crunch, on when you need to triage fast.
              </FieldDescription>
            </FieldContent>
            <Switch
              id={field.name}
              checked={field.state.value}
              onCheckedChange={(v) => field.handleChange(v)}
            />
          </Field>
        )}
      />

      {/* ---------- Form-level errors ---------- */}
      <form.Subscribe
        selector={(s) => s.errors}
        children={(errors) =>
          errors.length > 0 ?
            <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <p className="font-medium">Please fix the highlighted fields.</p>
              <ul className="mt-1 list-disc pl-5 text-xs">
                {errors.map((err, i) => (
                  <li key={i}>
                    {typeof err === "string" ?
                      err
                    : (err as { message?: string })?.message ?? "Invalid value."}
                  </li>
                ))}
              </ul>
            </div>
          : null
        }
      />

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/teacher/courses")}
        >
          Cancel
        </Button>
        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || submitting || isSubmitting}>
              {submitting || isSubmitting ?
                <>
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  Creating…
                </>
              : "Create course"}
            </Button>
          )}
        />
      </div>
    </form>
  );
}

export default NewCourseForm;
