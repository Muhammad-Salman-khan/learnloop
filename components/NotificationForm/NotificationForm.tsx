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
  notificationSchema,
  type NotificationFormValues,
} from "@/lib/staff/schemas";
import {
  ALERT_SEVERITIES,
  severityLabel,
} from "@/lib/staff/staff-data";

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

export function NotificationForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      title: "",
      message: "",
      severity: "normal",
      audience: "all",
      batchName: "",
    } as NotificationFormValues,
    validators: {
      onChange: notificationSchema,
      onSubmit: notificationSchema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 350));
      toast.success(
        value.severity === "urgent"
          ? "Urgent alert dispatched"
          : "Normal alert dispatched",
        {
          description: value.title,
        },
      );
      router.push("/dashboard/staff/notifications");
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
          <Link href="/dashboard/staff/notifications">
            <ChevronLeft className="size-3.5" />
            Back to alerts
          </Link>
        </Button>
      </div>

      <FieldGroup>
        <form.Field name="title">
          {((field: AnyFieldApi) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <FieldContent>
                  <Input
                    id="title"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Fee window closes Friday"
                    aria-invalid={err ? true : undefined}
                  />
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }) as unknown as (api: AnyFieldApi) => React.ReactNode}
        </form.Field>

        <form.Field name="message">
          {((field: AnyFieldApi) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <FieldContent>
                  <Textarea
                    id="message"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Use plain language. The message is delivered in-app first; push later if needed."
                    className="min-h-32 resize-y"
                    aria-invalid={err ? true : undefined}
                  />
                  <FieldDescription>
                    10–2000 characters.
                  </FieldDescription>
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }) as unknown as (api: AnyFieldApi) => React.ReactNode}
        </form.Field>

        <div className="grid gap-4 md:grid-cols-2">
          <form.Field name="severity">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="severity">Urgency</FieldLabel>
                  <FieldContent>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) =>
                        field.handleChange(
                          v as NotificationFormValues["severity"],
                        )
                      }
                    >
                      <SelectTrigger id="severity" className="h-9 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ALERT_SEVERITIES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {severityLabel(s)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      Urgent pushes a destructive tone and a badge in the
                      recipients&apos; headers.
                    </FieldDescription>
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }) as unknown as (api: AnyFieldApi) => React.ReactNode}
          </form.Field>

          <form.Field name="audience">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="audience">Target</FieldLabel>
                  <FieldContent>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) =>
                        field.handleChange(
                          v as NotificationFormValues["audience"],
                        )
                      }
                    >
                      <SelectTrigger id="audience" className="h-9 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Everyone</SelectItem>
                        <SelectItem value="students">Students only</SelectItem>
                        <SelectItem value="teachers">Teachers only</SelectItem>
                        <SelectItem value="staff">Staff only</SelectItem>
                        <SelectItem value="batch">
                          Specific batch…
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }) as unknown as (api: AnyFieldApi) => React.ReactNode}
          </form.Field>
        </div>

        <form.Subscribe
          selector={(s) => ({ audience: s.values.audience })}
        >
          {({ audience }) =>
            audience === "batch" ? (
              <form.Field name="batchName">
                {((field: AnyFieldApi) => {
                  const err = firstError(field);
                  return (
                    <Field>
                      <FieldLabel htmlFor="batchName">Batch name</FieldLabel>
                      <FieldContent>
                        <Input
                          id="batchName"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) =>
                            field.handleChange(e.target.value)
                          }
                          placeholder="Senior A · 2025-26"
                          aria-invalid={err ? true : undefined}
                        />
                        <FieldDescription>
                          Used as the recipient label. Free-text for now;
                          will be linked to a Batch lookup once schema lands.
                        </FieldDescription>
                        {err ? (
                          <FieldError errors={[{ message: err }]} />
                        ) : null}
                      </FieldContent>
                    </Field>
                  );
                }) as unknown as (api: AnyFieldApi) => React.ReactNode}
              </form.Field>
            ) : null
          }
        </form.Subscribe>
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
              className="min-w-[10rem]"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Dispatching…
                </>
              ) : (
                "Push alert"
              )}
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/staff/notifications">Cancel</Link>
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

export default NotificationForm;
