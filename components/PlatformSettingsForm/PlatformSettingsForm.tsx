"use client";

/* eslint-disable react/no-children-prop -- TanStack Form requires render-prop `children` on <form.Field>. */

import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";

import {
  platformSettingsSchema,
  type PlatformSettingsFormValues,
} from "@/lib/admin/platform-settings-schema";

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

type PlatformSettingsFormProps = {
  readonly defaults: PlatformSettingsFormValues;
};

export function PlatformSettingsForm({ defaults }: PlatformSettingsFormProps) {
  const form = useForm({
    defaultValues: defaults,
    validators: {
      onChange: platformSettingsSchema,
      onSubmit: platformSettingsSchema,
    },
    onSubmit: async () => {
      // Demo submit — same shape as the user forms. Replace with a server
      // action / Route Handler that mutates the platform settings row.
      await new Promise((r) => setTimeout(r, 400));
      toast.success("Platform settings saved", {
        description: "Changes will roll out across the platform on the next render.",
      });
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
      <FieldGroup>
        <form.Field name="platformName">
          {(field) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="platformName">Platform name</FieldLabel>
                <FieldContent>
                  <Input
                    id="platformName"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={err ? true : undefined}
                    placeholder="LearnHub"
                  />
                  <FieldDescription>
                    Public-facing label shown in the browser title and emails.
                  </FieldDescription>
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }}
        </form.Field>

        <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
          <form.Field name="academicYear">
            {(field) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="academicYear">Academic year</FieldLabel>
                  <FieldContent>
                    <Input
                      id="academicYear"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={err ? true : undefined}
                      placeholder="2025-2026"
                    />
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="contactEmail">
            {(field) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="contactEmail">Contact email</FieldLabel>
                  <FieldContent>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={err ? true : undefined}
                      placeholder="admin@example.com"
                    />
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="defaultLanguage">
          {(field) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="defaultLanguage">Default language</FieldLabel>
                <FieldContent>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) =>
                      field.handleChange(
                        v as PlatformSettingsFormValues["defaultLanguage"],
                      )
                    }
                  >
                    <SelectTrigger id="defaultLanguage" className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ur">Urdu</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Used as the default for newly-registered users.
                  </FieldDescription>
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="maxCourseCapacity">
          {(field) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="maxCourseCapacity">
                  Max course capacity
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="maxCourseCapacity"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={1000}
                    // TanStack v1 narrows handleChange to the literal field
                    // union; coerce at the form boundary to keep the schema's
                    // z.number() happy.
                    value={field.state.value as unknown as number}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(Number(e.target.value) as never)
                    }
                    aria-invalid={err ? true : undefined}
                  />
                  <FieldDescription>
                    Hard cap on seats per course. Enrollment forms reject
                    above this.
                  </FieldDescription>
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }}
        </form.Field>

        <form.Field
          name="maintenanceMode"
          children={((field: AnyFieldApi) => {
            const checked = Boolean(field.state.value);
            return (
              <Field orientation="horizontal">
                <Switch
                  id="maintenanceMode"
                  checked={checked}
                  onCheckedChange={(v) =>
                    field.handleChange(v as unknown as never)
                  }
                  onBlur={field.handleBlur}
                />
                <FieldContent>
                  <FieldLabel htmlFor="maintenanceMode">
                    Maintenance mode
                  </FieldLabel>
                  <FieldDescription>
                    Show a platform-wide banner and block writes from
                    students and teachers.
                  </FieldDescription>
                </FieldContent>
              </Field>
            );
          }) as unknown as (api: AnyFieldApi) => React.ReactNode}
        />

        <form.Field
          name="allowSelfSignup"
          children={((field: AnyFieldApi) => {
            const checked = Boolean(field.state.value);
            return (
              <Field orientation="horizontal">
                <Switch
                  id="allowSelfSignup"
                  checked={checked}
                  onCheckedChange={(v) =>
                    field.handleChange(v as unknown as never)
                  }
                  onBlur={field.handleBlur}
                />
                <FieldContent>
                  <FieldLabel htmlFor="allowSelfSignup">
                    Allow self-signup
                  </FieldLabel>
                  <FieldDescription>
                    Anyone with the signup link can register without an
                    invite. Disable to lock the platform closed.
                  </FieldDescription>
                </FieldContent>
              </Field>
            );
          }) as unknown as (api: AnyFieldApi) => React.ReactNode}
        />
      </FieldGroup>

      <form.Subscribe
        selector={(s) => ({
          submitting: s.isSubmitting,
          canSubmit: s.canSubmit,
          isDirty: s.isDirty,
        })}
      >
        {({ submitting, canSubmit, isDirty }) => (
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              disabled={!canSubmit || submitting || !isDirty}
              className="min-w-[8rem]"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save settings"
              )}
            </Button>
            {!isDirty ? (
              <span className="text-xs text-muted-foreground">
                No pending changes.
              </span>
            ) : null}
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

export default PlatformSettingsForm;
