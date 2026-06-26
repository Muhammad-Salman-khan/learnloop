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
  ANNOUNCEMENT_TARGETS,
  announcementTargetLabel,
} from "@/lib/admin/admin-data";
import type { AnnouncementTarget } from "@/lib/admin/admin-data";
import {
  announcementSchema,
  type AnnouncementFormValues,
} from "@/lib/admin/announcement-schemas";

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

type AnnouncementFormProps = {
  readonly mode: "create" | "edit";
  readonly defaults?: Partial<{
    readonly title: string;
    readonly body: string;
    readonly target: AnnouncementTarget;
    readonly pinned: boolean;
  }>;
};

export function AnnouncementForm({
  mode,
  defaults,
}: AnnouncementFormProps) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      title: defaults?.title ?? "",
      body: defaults?.body ?? "",
      target: (defaults?.target ?? "all") as AnnouncementTarget,
      pinned: defaults?.pinned ?? false,
    } as AnnouncementFormValues,
    validators: {
      onChange: announcementSchema,
      onSubmit: announcementSchema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 250));
      toast.success(
        mode === "create" ? "Announcement published" : "Announcement updated",
        {
          description: value.title,
        },
      );
      router.push("/dashboard/admin/announcements");
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
          <Link href="/dashboard/admin/announcements">
            <ChevronLeft className="size-3.5" />
            Back to announcements
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
                    placeholder="Spring enrollment window now open"
                    aria-invalid={err ? true : undefined}
                  />
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }) as unknown as (api: AnyFieldApi) => React.ReactNode}
        </form.Field>

        <form.Field name="body">
          {((field: AnyFieldApi) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="body">Body</FieldLabel>
                <FieldContent>
                  <Textarea
                    id="body"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Open enrollment for the spring cohort runs until 28 February."
                    className="min-h-32 resize-y"
                    aria-invalid={err ? true : undefined}
                  />
                  <FieldDescription>
                    Markdown is supported. Keep it under {2000} characters.
                  </FieldDescription>
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }) as unknown as (api: AnyFieldApi) => React.ReactNode}
        </form.Field>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <form.Field name="target">
            {((field: AnyFieldApi) => {
              const err = firstError(field);
              return (
                <Field>
                  <FieldLabel htmlFor="target">Audience</FieldLabel>
                  <FieldContent>
                    <Select
                      value={field.state.value}
                      onValueChange={(v) =>
                        field.handleChange(
                          v as AnnouncementFormValues["target"],
                        )
                      }
                    >
                      <SelectTrigger id="target" className="h-9 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ANNOUNCEMENT_TARGETS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {announcementTargetLabel(t)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {err ? <FieldError errors={[{ message: err }]} /> : null}
                  </FieldContent>
                </Field>
              );
            }) as unknown as (api: AnyFieldApi) => React.ReactNode}
          </form.Field>

          <form.Field
            name="pinned"
            children={((field: AnyFieldApi) => {
              const checked = Boolean(field.state.value);
              return (
                <Field orientation="horizontal">
                  <input
                    id="pinned"
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
                      htmlFor="pinned"
                      className="text-sm font-medium leading-none"
                    >
                      Pin to top
                    </label>
                    <FieldDescription>
                      Pin sends this announcement above every other post on
                      the dashboard.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              );
            }) as unknown as (api: AnyFieldApi) => React.ReactNode}
          />
        </div>
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
              ) : mode === "create" ? (
                "Publish"
              ) : (
                "Save changes"
              )}
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/admin/announcements">Cancel</Link>
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

export default AnnouncementForm;
