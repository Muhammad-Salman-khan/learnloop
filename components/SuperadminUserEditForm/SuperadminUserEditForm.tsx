"use client";

// Super-admin edit-user form (name + role).
// TanStack Form + zod, shadcn Field layout. Posts to the
// `setUserRole` and `updateUser` Server Actions from
// `app/actions/superadmin.ts`.

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { setUserRole, updateUser } from "@/app/actions/superadmin";

const schema = z.object({
  name: z.string().min(2, "At least 2 characters.").max(80),
  email: z.string().email("Enter a valid email."),
  role: z.enum(["superAdmin", "admin", "staff", "teacher", "student"]),
});

type Props = {
  readonly userId: string;
  readonly defaultName: string;
  readonly defaultEmail: string;
  readonly defaultRole:
    | "superAdmin"
    | "admin"
    | "staff"
    | "teacher"
    | "student";
  readonly isSelf: boolean;
};

const ROLE_OPTIONS: ReadonlyArray<{
  readonly value: "superAdmin" | "admin" | "staff" | "teacher" | "student";
  readonly label: string;
}> = [
  { value: "superAdmin", label: "Super admin" },
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Staff" },
  { value: "teacher", label: "Teacher" },
  { value: "student", label: "Student" },
];

export function SuperadminUserEditForm({
  userId,
  defaultName,
  defaultEmail,
  defaultRole,
  isSelf,
}: Props) {
  const [pending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      name: defaultName,
      email: defaultEmail,
      role: defaultRole,
    },
    validators: {
      onChange: schema,
      onSubmit: schema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        try {
          if (value.name !== defaultName || value.email !== defaultEmail) {
            await updateUser({
              userId,
              name: value.name,
              email: value.email,
            });
          }
          if (!isSelf && value.role !== defaultRole) {
            await setUserRole(userId, value.role);
          }
          toast.success("User updated", {
            description: `${value.name} · ${value.email} · ${value.role}`,
          });
        } catch (err) {
          toast.error("Update failed", {
            description: err instanceof Error ? err.message : "Unknown error",
          });
        }
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
                <FieldLabel htmlFor="edit-name">Display name</FieldLabel>
                <Input
                  id="edit-name"
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

        <form.Field name="email">
          {(field) => {
            const err = field.state.meta.errors[0]?.toString();
            return (
              <Field>
                <FieldLabel htmlFor="edit-email">Email</FieldLabel>
                <Input
                  id="edit-email"
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="h-9"
                />
                <FieldDescription>
                  Re-issues verification on change.
                </FieldDescription>
                {err ? <FieldError>{err}</FieldError> : null}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="role">
          {(field) => {
            const err = field.state.meta.errors[0]?.toString();
            const disabled = isSelf;
            return (
              <Field>
                <FieldLabel htmlFor="edit-role">Role</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(
                      v as
                        | "superAdmin"
                        | "admin"
                        | "staff"
                        | "teacher"
                        | "student",
                    )
                  }
                  disabled={disabled}
                >
                  <SelectTrigger className="h-9" id="edit-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Determines the dashboard the user is routed to.
                  {disabled ? " You cannot change your own role." : ""}
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

export default SuperadminUserEditForm;
