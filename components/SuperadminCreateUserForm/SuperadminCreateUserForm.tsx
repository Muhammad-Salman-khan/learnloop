"use client";

/* eslint-disable react/no-children-prop -- TanStack Form requires render-prop `children` on <form.Field>. */

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
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

import { createUser } from "@/app/actions/superadmin";
import {
  ALL_ROLES,
  roleLabel,
  type SuperadminRole,
} from "@/lib/superadmin/roles";

import {
  createUserSchema,
  type CreateUserFormValues,
} from "@/lib/admin/user-schemas";

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

export function SuperadminCreateUserForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "student",
      phone: "",
      sendInvite: false,
    } as CreateUserFormValues,
    validators: {
      onChange: createUserSchema,
      onSubmit: createUserSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createUser({
          name: value.name,
          email: value.email,
          role: value.role as SuperadminRole,
          password: "Welcome@1234",
        });
        toast.success("User created", {
          description: `${value.name} as ${roleLabel(value.role as SuperadminRole)}`,
        });
        router.push("/dashboard/superadmin/users");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to create user");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <FieldGroup>
        <form.Field name="name">
          {(field) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="name">Full name</FieldLabel>
                <FieldContent>
                  <Input
                    id="name"
                    autoComplete="name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Salman Khan"
                  />
                  <FieldDescription>
                    Display name used through the dashboard.
                  </FieldDescription>
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="email">
          {(field) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="user@learnhub.test"
                  />
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="role">
          {(field) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="role">Role</FieldLabel>
                <FieldContent>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) =>
                      field.handleChange(v as CreateUserFormValues["role"])
                    }
                  >
                    <SelectTrigger id="role" className="h-9 w-full">
                      <SelectValue placeholder="Choose a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {roleLabel(r)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Super-admin only route can choose "superAdmin".
                  </FieldDescription>
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <div className="flex items-center justify-end gap-2">
        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting} size="sm">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Creating
                </>
              ) : (
                "Create user"
              )}
            </Button>
          )}
        </form.Subscribe>
      </div>
      <p className="text-xs text-muted-foreground">
        Default password is <code>Welcome@1234</code> — share it through a
        separate channel and ask the user to rotate it on first sign-in.
      </p>
    </form>
  );
}

export default SuperadminCreateUserForm;
