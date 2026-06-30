"use client";

// Super-admin change-password form. TanStack Form + zod,
// shadcn Field layout. Final submit hits better-auth's
// changePassword endpoint via a Server Action stub.

import { useState, useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const schema = z
  .object({
    current: z.string().min(8, "At least 8 characters."),
    next: z.string().min(8, "At least 8 characters."),
    confirm: z.string().min(8, "At least 8 characters."),
  })
  .refine((v) => v.next === v.confirm, {
    path: ["confirm"],
    message: "Passwords don't match.",
  });

export function SuperadminAccountPasswordForm() {
  const [pending, startTransition] = useTransition();
  const [reveal, setReveal] = useState(false);

  const form = useForm({
    defaultValues: { current: "", next: "", confirm: "" },
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        await new Promise((r) => setTimeout(r, 300));
        toast.success("Password updated", {
          description: `Length ${value.next.length}. Other sessions remain live.`,
        });
        form.reset();
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
        <form.Field name="current">
          {(field) => {
            const err = field.state.meta.errors[0]?.toString();
            return (
              <Field>
                <FieldLabel htmlFor="pw-current">Current password</FieldLabel>
                <div className="relative">
                  <Input
                    id="pw-current"
                    type={reveal ? "text" : "password"}
                    autoComplete="current-password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="h-9 pr-9"
                  />
                  <button
                    type="button"
                    aria-label={reveal ? "Hide password" : "Show password"}
                    onClick={() => setReveal((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted"
                  >
                    {reveal ? (
                      <EyeOff className="size-3.5" />
                    ) : (
                      <Eye className="size-3.5" />
                    )}
                  </button>
                </div>
                <FieldDescription>
                  Re-authenticate before rotating the credential.
                </FieldDescription>
                {err ? <FieldError>{err}</FieldError> : null}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="next">
          {(field) => {
            const err = field.state.meta.errors[0]?.toString();
            return (
              <Field>
                <FieldLabel htmlFor="pw-next">New password</FieldLabel>
                <Input
                  id="pw-next"
                  type={reveal ? "text" : "password"}
                  autoComplete="new-password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="h-9"
                />
                <FieldDescription>
                  Minimum 8 characters. Mix letters, digits, and symbols.
                </FieldDescription>
                {err ? <FieldError>{err}</FieldError> : null}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="confirm">
          {(field) => {
            const err = field.state.meta.errors[0]?.toString();
            return (
              <Field>
                <FieldLabel htmlFor="pw-confirm">Confirm new password</FieldLabel>
                <Input
                  id="pw-confirm"
                  type={reveal ? "text" : "password"}
                  autoComplete="new-password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="h-9"
                />
                {err ? <FieldError>{err}</FieldError> : null}
              </Field>
            );
          }}
        </form.Field>

        <form.Subscribe selector={(s) => ({ canSubmit: s.canSubmit })}>
          {({ canSubmit }) => (
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="submit"
                size="sm"
                disabled={!canSubmit || pending}
              >
                <KeyRound className="mr-1.5 size-3.5" />
                {pending ? "Updating…" : "Update password"}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  );
}

export default SuperadminAccountPasswordForm;
