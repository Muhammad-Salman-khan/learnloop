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
  feeStatusUpdateSchema,
  type FeeStatusUpdateValues,
} from "@/lib/staff/schemas";
import type { FeeStatus } from "@/lib/admin/admin-data";
import { FEE_STATUSES, feeStatusLabel } from "@/lib/admin/admin-data";

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

type FeeStatusFormProps = {
  readonly studentUserId: string;
  readonly studentName: string;
  readonly currentStatus: FeeStatus;
  readonly month: string;
};

export function FeeStatusForm({
  studentUserId,
  studentName,
  currentStatus,
  month,
}: FeeStatusFormProps) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      status: currentStatus,
      amount: "",
      reason: "",
    } as FeeStatusUpdateValues,
    validators: {
      onChange: feeStatusUpdateSchema,
      onSubmit: feeStatusUpdateSchema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 300));
      toast.success("Fee status updated", {
        description: `${studentName} · ${monthLabel(month)} · ${feeStatusLabel(
          value.status as FeeStatus,
        )}`,
      });
      router.push(`/dashboard/staff/fees/${studentUserId}`);
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
          <Link href={`/dashboard/staff/fees/${studentUserId}`}>
            <ChevronLeft className="size-3.5" />
            Back to ledger
          </Link>
        </Button>
      </div>

      <FieldGroup>
        <form.Field name="status">
          {((field: AnyFieldApi) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="status">Update to</FieldLabel>
                <FieldContent>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) =>
                      field.handleChange(
                        v as FeeStatusUpdateValues["status"],
                      )
                    }
                  >
                    <SelectTrigger id="status" className="h-9 w-56">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FEE_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {feeStatusLabel(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Paid = received. Due = invoice generated, payment pending.
                    Unpaid = no invoice or missed.
                  </FieldDescription>
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }) as unknown as (api: AnyFieldApi) => React.ReactNode}
        </form.Field>

        <form.Field name="amount">
          {((field: AnyFieldApi) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="amount">
                  Amount (PKR, optional)
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="amount"
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="14500"
                    aria-invalid={err ? true : undefined}
                  />
                  <FieldDescription>
                    Used only if a new invoice is being generated for this
                    cycle.
                  </FieldDescription>
                  {err ? <FieldError errors={[{ message: err }]} /> : null}
                </FieldContent>
              </Field>
            );
          }) as unknown as (api: AnyFieldApi) => React.ReactNode}
        </form.Field>

        <form.Field name="reason">
          {((field: AnyFieldApi) => (
            <Field>
              <FieldLabel htmlFor="reason">Audit note</FieldLabel>
              <FieldContent>
                <Textarea
                  id="reason"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="min-h-24 resize-y"
                  placeholder="Why is this status changing today?"
                />
                <FieldDescription>
                  Saved to the audit trail when the status differs from the
                  previous cycle.
                </FieldDescription>
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
                "Save status"
              )}
            </Button>
            <Button variant="ghost" asChild>
              <Link href={`/dashboard/staff/fees/${studentUserId}`}>
                Cancel
              </Link>
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

function monthLabel(monthString: string): string {
  try {
    const [year, month] = monthString.split("-").map(Number);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(new Date(Date.UTC(year, (month ?? 1) - 1, 1)));
  } catch {
    return monthString;
  }
}

export default FeeStatusForm;
