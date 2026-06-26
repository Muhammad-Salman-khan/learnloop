"use client";

/* eslint-disable react/no-children-prop -- TanStack Form requires render-prop `children` on <form.Field>. */

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import Link from "next/link";

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
import {
  ALL_ROLES,
  roleLabel,
} from "@/lib/admin/admin-data";
import type { AdminRole } from "@/lib/admin/admin-data";
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

export function CreateUserForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "student",
      phone: "",
      sendInvite: true,
    } as CreateUserFormValues,
    validators: {
      onChange: createUserSchema,
      onSubmit: createUserSchema,
    },
    onSubmit: async ({ value }) => {
      // Demo submit: simulate a network round-trip, toast, then navigate
      // back to the user list. Replacing the timeout with a real server
      // action is a one-line swap once Prisma users land.
      await new Promise((r) => setTimeout(r, 350));
      toast.success("User created", {
        description: `${value.name} added as ${roleLabel(value.role as AdminRole)}`,
      });
      router.push("/dashboard/admin/users");
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
      <div className="flex items-center justify-between">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 gap-2 text-muted-foreground hover:text-foreground"
        >
          <Link href="/dashboard/admin/users">
            <ChevronLeft className="size-3.5" />
            Back to users
          </Link>
        </Button>
      </div>

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
                    aria-invalid={err ? true : undefined}
                  />
                  <FieldDescription>
                    Use the user&apos;s display name, exactly as they sign in.
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
                    placeholder="name@learnhub.test"
                    aria-invalid={err ? true : undefined}
                  />
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }}
        </form.Field>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                        <SelectValue placeholder="Select a role" />
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
                      The role controls what dashboards this user can sign
                      into.
                    </FieldDescription>
                    {err ? (
                      <FieldError errors={[{ message: err }]} />
                    ) : null}
                  </FieldContent>
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="phone">
            {(field) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="phone">Phone (optional)</FieldLabel>
                  <FieldContent>
                    <Input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="+92 300 0000 000"
                      aria-invalid={err ? true : undefined}
                    />
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field
          name="sendInvite"
          children={((field: AnyFieldApi) => {
            const checked = Boolean(field.state.value);
            return (
              <Field orientation="horizontal">
                <input
                  id="sendInvite"
                  type="checkbox"
                  className="size-4 rounded border"
                  checked={checked}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.checked as unknown as never,
                    )
                  }
                />
                <FieldContent>
                  <label
                    htmlFor="sendInvite"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Send welcome email
                  </label>
                  <FieldDescription>
                    Email the new user a magic link to set their password.
                  </FieldDescription>
                </FieldContent>
              </Field>
            );
          }) as unknown as (api: AnyFieldApi) => React.ReactNode}
        />
      </FieldGroup>

      <form.Subscribe
        selector={(s) => ({ submitting: s.isSubmitting, canSubmit: s.canSubmit })}
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
                  Creating…
                </>
              ) : (
                "Create user"
              )}
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/admin/users">Cancel</Link>
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

export default CreateUserForm;
