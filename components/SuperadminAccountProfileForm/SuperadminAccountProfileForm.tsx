"use client";

// Super-admin account profile form.
// TanStack Form + zod validators, laid out with the shadcn Field family.
// Posts to a future Server Action; today it surfaces validation and a
// success toast so the field group stays exercisable in QA.

import { useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const schema = z.object({
  name: z.string().min(2, "At least 2 characters.").max(80),
  email: z.string().email("Enter a valid email."),
});

type Props = {
  readonly defaultName: string;
  readonly defaultEmail: string;
};

export function SuperadminAccountProfileForm({
  defaultName,
  defaultEmail,
}: Props) {
  const [pending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: { name: defaultName, email: defaultEmail },
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit: ({ value }) => {
      // Server Action stub — real one lives under app/actions/superadmin/*.
      startTransition(async () => {
        await new Promise((r) => setTimeout(r, 250));
        toast.success("Profile saved", {
          description: `${value.name} · ${value.email}`,
        });
      });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="name">
          {(field) => {
            const err = field.state.meta.errors[0]?.toString();
            return (
              <Field>
                <FieldLabel htmlFor="account-name">Display name</FieldLabel>
                <Input
                  id="account-name"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="h-9"
                  placeholder="Your full name"
                />
                <FieldDescription>
                  Shown next to the avatar across the platform.
                </FieldDescription>
                {err ? <FieldError>{err}</FieldError> : null}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="email">
          {(field) => {
            const err = field.state.meta.errors[0]?.toString();
            return (
              <Field>
                <FieldLabel htmlFor="account-email">Email</FieldLabel>
                <Input
                  id="account-email"
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="h-9"
                />
                <FieldDescription>
                  The sign-in identifier. Changing it re-issues verification.
                </FieldDescription>
                {err ? <FieldError>{err}</FieldError> : null}
              </Field>
            );
          }}
        </form.Field>

        <form.Subscribe
          selector={(s) => ({ canSubmit: s.canSubmit, dirty: s.isDirty })}
        >
          {({ canSubmit, dirty }) => (
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="submit"
                size="sm"
                disabled={!canSubmit || !dirty || pending}
              >
                <Save className="mr-1.5 size-3.5" />
                {pending ? "Saving…" : "Save changes"}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}

export default SuperadminAccountProfileForm;
