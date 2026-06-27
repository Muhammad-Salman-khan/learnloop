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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import {
  editTeacherSchema,
  type EditTeacherValues,
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

type EditTeacherFormProps = {
  readonly teacherId: string;
  readonly defaults: EditTeacherValues;
};

export function EditTeacherForm({
  teacherId,
  defaults,
}: EditTeacherFormProps) {
  const router = useRouter();
  const form = useForm({
    defaultValues: defaults,
    validators: {
      onChange: editTeacherSchema,
      onSubmit: editTeacherSchema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 250));
      toast.success("Teacher updated", {
        description: value.name,
      });
      router.push(`/dashboard/staff/teachers/${teacherId}`);
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
          <Link href={`/dashboard/staff/teachers/${teacherId}`}>
            <ChevronLeft className="size-3.5" />
            Back to profile
          </Link>
        </Button>
      </div>

      <FieldGroup>
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
                      aria-invalid={err ? true : undefined}
                    />
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }) as unknown as (api: AnyFieldApi) => React.ReactNode}
          </form.Field>

          <form.Field name="nic">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="nic">NIC</FieldLabel>
                  <FieldContent>
                    <Input
                      id="nic"
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

          <form.Field name="phoneNumber">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="phoneNumber">Phone</FieldLabel>
                  <FieldContent>
                    <Input
                      id="phoneNumber"
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

          <form.Field name="qualification">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="qualification">
                    Qualification
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="qualification"
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

        <form.Field name="subjectSpecialization">
          {((field: AnyFieldApi) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="subjectSpecialization">
                  Subject specialization
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="subjectSpecialization"
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
                    className="min-h-16 resize-y"
                    aria-invalid={err ? true : undefined}
                  />
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }) as unknown as (api: AnyFieldApi) => React.ReactNode}
        </form.Field>

        <form.Field name="bio">
          {((field: AnyFieldApi) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                <FieldContent>
                  <Textarea
                    id="bio"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="min-h-28 resize-y"
                    aria-invalid={err ? true : undefined}
                  />
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }) as unknown as (api: AnyFieldApi) => React.ReactNode}
        </form.Field>

        <form.Field name="isActive">
          {((field: AnyFieldApi) => (
            <Field orientation="horizontal">
              <Checkbox
                id="isActive"
                checked={field.state.value}
                onBlur={field.handleBlur}
                onCheckedChange={(c) =>
                  field.handleChange(Boolean(c) as unknown as never)
                }
              />
              <FieldContent>
                <FieldLabel htmlFor="isActive">Active employee</FieldLabel>
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
              className="min-w-[8rem]"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
            <Button variant="ghost" asChild>
              <Link href={`/dashboard/staff/teachers/${teacherId}`}>
                Cancel
              </Link>
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

export default EditTeacherForm;
