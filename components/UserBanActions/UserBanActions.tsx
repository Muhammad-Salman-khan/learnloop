"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

type UserBanActionsProps = {
  readonly userId: string;
  readonly banned: boolean;
  readonly banReason: string | null;
};

// Client island that toggles ban state inline (still demo data — no backend).
// Lives leaf-level so /users/[id] can stay a Server Component. Replacing the
// in-memory toggle with a server action is a one-line swap.
export function UserBanActions({
  userId,
  banned,
  banReason,
}: UserBanActionsProps) {
  const router = useRouter();
  const [reason, setReason] = useState<string>(banReason ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState<boolean>(!banned);

  function handleConfirm() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success(
        banned ? "Ban lifted" : "User banned",
        {
          description: banned
            ? `${userId} can sign in again.`
            : `${userId} signed out of every device.`,
        },
      );
      // Demo: navigate back to refresh server-rendered flags.
      router.refresh();
    }, 250);
  }

  return (
    <div className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="banReason">
          {banned ? "Current reason" : "Ban reason (optional)"}
        </FieldLabel>
        <FieldContent>
          <Textarea
            id="banReason"
            value={reason}
            disabled={banned ? true : !editing}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Repeated ToS violations."
            className="resize-none"
          />
          <FieldDescription>
            Visible to admins and to the banned user on their next sign-in
            attempt.
          </FieldDescription>
        </FieldContent>
      </Field>

      <div className="flex items-center gap-2">
        <Button
          variant={banned ? "default" : "destructive"}
          size="sm"
          onClick={handleConfirm}
          disabled={submitting}
          className="gap-1.5"
        >
          {submitting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : banned ? (
            <CheckCircle2 className="size-3.5" />
          ) : (
            <Ban className="size-3.5" />
          )}
          {submitting
            ? "Saving…"
            : banned
              ? "Lift ban"
              : "Ban this user"}
        </Button>
        {banned ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing((v) => !v)}
          >
            {editing ? "Cancel" : "Update reason"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default UserBanActions;
