"use client";

/* eslint-disable react/no-children-prop -- TanStack Form requires render-prop `children` on <form.Field>. */

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from "@tanstack/react-form";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
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
  ALL_ROLES,
  roleLabel,
} from "@/lib/admin/admin-data";
import { initials } from "@/lib/admin/formatters";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import {
  updateUserSchema,
  type UpdateUserFormValues,
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

type EditUserFormProps = {
  readonly user: {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly role: string;
    readonly banned: boolean;
    readonly banReason: string | null;
  };
};

export function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      banned: user.banned,
      banReason: user.banReason ?? "",
    } as UpdateUserFormValues,
    validators: {
      onChange: updateUserSchema,
      onSubmit: updateUserSchema,
    },
    onSubmit: async () => {
      // Demo submit — same caveat as CreateUserForm.
      await new Promise((r) => setTimeout(r, 350));
      toast.success("User updated", { description: user.name });
      router.push(`/dashboard/admin/users/${user.id}`);
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
          <Link href={`/dashboard/admin/users/${user.id}`}>
            <ChevronLeft className="size-3.5" />
            Back to profile
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Avatar className="size-14 rounded-md">
          <AvatarFallback className="rounded-md bg-primary text-base text-primary-foreground">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-display text-xl font-medium leading-tight">
            {user.name}
          </span>
          <span className="text-xs text-muted-foreground">ID · {user.id}</span>
        </div>
        <Badge variant="outline" className="ml-auto">
          Editing
        </Badge>
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
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={err ? true : undefined}
                  />
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
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={err ? true : undefined}
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
                      field.handleChange(
                        v as UpdateUserFormValues["role"],
                      )
                    }
                  >
                    <SelectTrigger id="role" className="h-9 w-full">
                      <SelectValue />
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
                    Switching role grants access to a different dashboard
                    on next sign-in.
                  </FieldDescription>
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }}
        </form.Field>

        <form.Field
          name="banned"
          children={((field: AnyFieldApi) => {
            const checked = Boolean(field.state.value);
            return (
              <Field orientation="horizontal">
                <input
                  id="banned"
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
                    htmlFor="banned"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Banned from platform
                  </label>
                  <FieldDescription>
                    Banned users cannot sign in until the flag is cleared.
                  </FieldDescription>
                </FieldContent>
              </Field>
            );
          }) as unknown as (api: AnyFieldApi) => React.ReactNode}
        />

        <form.Field name="banReason">
          {((field: AnyFieldApi) => (
            <Field>
              <FieldLabel htmlFor="banReason">
                Ban reason (optional)
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id="banReason"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Repeated ToS violations."
                  className="resize-none"
                />
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
              <Link href={`/dashboard/admin/users/${user.id}`}>
                Cancel
              </Link>
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

export default EditUserForm;
