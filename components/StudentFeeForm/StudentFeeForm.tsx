"use client";

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
  FieldTitle,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { FeeStatus } from "@/lib/admin/admin-data";
import { FEE_STATUSES, feeStatusLabel } from "@/lib/admin/admin-data";
import {
  feeStatusSchema,
  type FeeStatusFormValues,
} from "@/lib/admin/fee-schemas";

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

type StudentFeeFormProps = {
  readonly userId: string;
  readonly currentStatus: FeeStatus;
};

export function StudentFeeForm({
  userId,
  currentStatus,
}: StudentFeeFormProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      status: currentStatus,
      reason: "",
    } as FeeStatusFormValues,
    validators: {
      onChange: feeStatusSchema,
      onSubmit: feeStatusSchema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 250));
      toast.success("Fee status updated", {
        description: `${userId} → ${feeStatusLabel(value.status as FeeStatus)}`,
      });
      router.refresh();
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
          <Link href={`/dashboard/admin/students/${userId}`}>
            <ChevronLeft className="size-3.5" />
            Back to student
          </Link>
        </Button>
      </div>

      <FieldGroup>
        <form.Field name="status">
          {((field: AnyFieldApi) => {
            const err = firstError(field);
            return (
              <Field>
                <FieldLabel htmlFor="status">Fee status</FieldLabel>
                <FieldContent>
                  <Select
                    value={field.state.value}
                    onValueChange={(v) =>
                      field.handleChange(v as FeeStatusFormValues["status"])
                    }
                  >
                    <SelectTrigger id="status" className="h-9 w-48">
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
                    Paid = received. Due = invoice generated, payment
                    pending. Unpaid = missed or no invoice.
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
              <FieldLabel htmlFor="reason">
                Admin note (optional)
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id="reason"
                  value={field.state.value ?? ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Why is this status being changed today?"
                  className="resize-none"
                />
                <FieldTitle className="text-xs font-normal text-muted-foreground">
                  Saved to the audit trail when this status changes.
                </FieldTitle>
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
                "Update fee status"
              )}
            </Button>
            <Button variant="ghost" asChild>
              <Link href={`/dashboard/admin/students/${userId}`}>
                Cancel
              </Link>
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

export default StudentFeeForm;
