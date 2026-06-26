"use client";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { initials } from "@/lib/admin/formatters";
import {
  accountSettingsSchema,
  type AccountSettingsFormValues,
} from "@/lib/admin/account-settings-schema";

const PK_TIMEZONES = [
  { value: "Asia/Karachi", label: "Asia/Karachi (UTC+5)" },
  { value: "Asia/Tashkent", label: "Asia/Tashkent (UTC+5)" },
  { value: "Asia/Aqtau", label: "Asia/Aqtau (UTC+5)" },
  { value: "Asia/Aqtobe", label: "Asia/Aqtobe (UTC+5)" },
  { value: "Asia/Dushanbe", label: "Asia/Dushanbe (UTC+5)" },
  { value: "Asia/Samarkand", label: "Asia/Samarkand (UTC+5)" },
  { value: "Asia/Oral", label: "Asia/Oral (UTC+5)" },
  { value: "UTC", label: "UTC" },
] as const;

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

type AdminAccountFormProps = {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
};

export function AdminAccountForm({ name, email, phone }: AdminAccountFormProps) {
  const form = useForm({
    defaultValues: {
      name,
      email,
      phone,
      timezone: "Asia/Karachi",
    } as AccountSettingsFormValues,
    validators: {
      onChange: accountSettingsSchema,
      onSubmit: accountSettingsSchema,
    },
    onSubmit: async () => {
      // Demo submit — simulate network delay.
      await new Promise((r) => setTimeout(r, 350));
      toast.success("Account settings saved");
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
      <div className="flex items-center gap-3">
        <Avatar className="size-14 rounded-md">
          <AvatarFallback className="rounded-md bg-primary text-base text-primary-foreground">
            {initials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-display text-xl font-medium leading-tight">
            {name}
          </span>
          <span className="text-xs text-muted-foreground">
            Super admin
          </span>
        </div>
        <Badge variant="outline" className="ml-auto">
          Active
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

        <form.Field name="phone">
          {(field) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <FieldContent>
                  <Input
                    id="phone"
                    type="tel"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={err ? true : undefined}
                  />
                  <FieldDescription>
                    Used for account recovery and notifications.
                  </FieldDescription>
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="timezone">
          {(field) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                <FieldContent>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) =>
                      field.handleChange(
                        v as AccountSettingsFormValues["timezone"],
                      )
                    }
                  >
                    <SelectTrigger id="timezone" className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PK_TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    All dates and times in the dashboard use this timezone.
                  </FieldDescription>
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }}
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
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

export default AdminAccountForm;
