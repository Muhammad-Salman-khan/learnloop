"use client";

// Super-admin ban/unban form. Two distinct submit paths — the form
// itself posts to `banUser`, and a sibling button posts to `unbanUser`.
// TanStack Form + zod, shadcn Field layout.

import { useTransition } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { toast } from "sonner";
import { ShieldOff, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { banUser, unbanUser } from "@/app/actions/superadmin";

const schema = z.object({
  reason: z.string().min(3, "Provide a reason (≥3 chars).").max(280),
  expiresAt: z.string().optional(),
});

type Props = {
  readonly userId: string;
  readonly isSelf: boolean;
  readonly currentlyBanned: boolean;
};

export function SuperadminBanForm({
  userId,
  isSelf,
  currentlyBanned,
}: Props) {
  const [pending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: { reason: "", expiresAt: "" },
    validators: {
      onSubmit: schema,
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        try {
          await banUser({
            userId,
            reason: value.reason,
            expiresAt: value.expiresAt?.length ? value.expiresAt : null,
          });
          toast.success("User banned", {
            description: value.reason,
          });
          form.reset();
        } catch (err) {
          toast.error("Ban failed", {
            description: err instanceof Error ? err.message : "Unknown error",
          });
        }
      });
    },
  });

  function handleUnban() {
    startTransition(async () => {
      try {
        await unbanUser(userId);
        toast.success("Ban lifted", {});
      } catch (err) {
        toast.error("Unban failed", {
          description: err instanceof Error ? err.message : "Unknown error",
        });
      }
    });
  }

  if (isSelf) {
    return (
      <p className="rounded-md border bg-muted/30 p-4 text-xs text-muted-foreground">
        You cannot ban or unban yourself. Use a different super-admin account
        if you need to test this control.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {currentlyBanned ? (
        <div className="flex flex-col gap-3 rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
          <span className="text-sm font-medium">This user is currently banned.</span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={handleUnban}
            className="w-fit"
          >
            <ShieldCheck className="mr-1.5 size-3.5" />
            {pending ? "Lifting…" : "Lift ban"}
          </Button>
        </div>
      ) : null}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="reason">
            {(field) => {
              const err = field.state.meta.errors[0]?.toString();
              return (
                <Field>
                  <FieldLabel htmlFor="ban-reason">Reason</FieldLabel>
                  <Input
                    id="ban-reason"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="h-9"
                    placeholder="e.g. policy violation, repeatedly abusive chat"
                  />
                  <FieldDescription>
                    Stored on User.banReason and visible to the user on sign-in.
                  </FieldDescription>
                  {err ? <FieldError>{err}</FieldError> : null}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="expiresAt">
            {_field => (
              <Field>
                <FieldLabel htmlFor="ban-expires">
                  Expires <span className="text-muted-foreground">(optional)</span>
                </FieldLabel>
                <Input
                  id="ban-expires"
                  type="datetime-local"
                  value={({}).value ?? ""}
                  onChange={e => _field.handleChange(e.target.value)}
                  onBlur={_field.handleBlur}
                  className="h-9"
                />
                <FieldDescription>
                  If set, the ban auto-lifts at this timestamp.
                </FieldDescription>
              </Field>
            )}
          </form.Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="submit"
              size="sm"
              variant="destructive"
              disabled={pending || currentlyBanned}
            >
              <ShieldOff className="mr-1.5 size-3.5" />
              {pending ? "Banning…" : currentlyBanned ? "Already banned" : "Ban user"}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}

export default SuperadminBanForm;
