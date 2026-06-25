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

type EditCourseFormProps = {
  readonly defaults: NewCourseFormValues;
  readonly courseId: string;
};

export function EditCourseForm({ defaults, courseId }: EditCourseFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm({
    defaultValues: defaults,
    validators: {
      onChange: newCourseSchema,
      onSubmit: newCourseSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitting(true);
      // Demo: simulate save.
      await new Promise((r) => setTimeout(r, 500));
      setSubmitting(false);
      toast.success("Course updated", { description: `${value.code} · ${value.title}` });
      router.push(`/dashboard/teacher/courses/${courseId}`);
    },
  });

  // Edit pages start dirty so the Save button is enabled the moment the
  // page mounts. Tracking isDirty reactively across every keystroke would
  // require a Subscribe render-prop in JSX; this constant is closer to the
  // real product behaviour (any edit without save is treated as dirty).
  const dirty = true;

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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FieldGroup className="gap-5 md:col-span-2">
          <FieldTitle className="text-base">Course identity</FieldTitle>
          <FieldDescription>
            Updating these changes how the course appears in the catalogue.
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <FieldGroup className="gap-3 md:col-span-3">
          <FieldTitle className="text-base">Pricing & launch</FieldTitle>
        </FieldGroup>

        <form.Field
          name="feePerSeat"
          children={(field) => {
            return (
              <Field className="gap-2">
                <FieldLabel htmlFor={field.name}>Fee per seat</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                <FieldInfo field={field} />
              </Field>
            );
          }}
        />

        <form.Field
          name="seats"
          children={(field) => {
            return (
              <Field className="gap-2">
                <FieldLabel htmlFor={field.name}>Max seats</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  inputMode="numeric"
                  value={String(field.state.value)}
                  onChange={(e) =>
                    field.handleChange(Number(e.target.value) || 0)
                  }
                  onBlur={field.handleBlur}
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
                <FieldLabel htmlFor={field.name}>Status</FieldLabel>
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
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            );
          }}
        />
      </div>

      <FieldSeparator />

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

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={() => form.reset()}
          disabled={!dirty || submitting}
        >
          Reset changes
        </Button>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/dashboard/teacher/courses/${courseId}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!dirty || submitting}>
            {submitting ?
              <>
                <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                Saving…
              </>
            : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default EditCourseForm;
