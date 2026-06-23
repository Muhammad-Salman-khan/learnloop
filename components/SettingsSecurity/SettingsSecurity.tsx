"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { LogOut, Save } from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  passwordSchema,
  type PasswordFormValues,
} from "@/lib/settings/security-schema";
import { authSessions } from "@/lib/settings/settings-data";

// Client Component. Password form is on @tanstack/react-form with the
// cross-field refine from zod mounted as an onSubmit validator. Active
// sessions stay as plain useState — they are not a form.
export function SettingsSecurity() {
  const [sessions, setSessions] = useState(authSessions);

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    } as PasswordFormValues,
    validators: {
      onSubmit: passwordSchema,
    },
    onSubmit: async () => {
      toast.success("Password updated", {
        description: "All active sessions will need to re-authenticate.",
      });
      form.reset();
    },
  });

  const handleRevoke = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success("Session revoked");
  };

  const handleRevokeOthers = () => {
    setSessions((prev) => prev.filter((s) => s.current));
    toast.success("All other sessions signed out");
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
        className="space-y-6"
        noValidate
      >
        <FieldGroup>
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field
              name="currentPassword"
              validators={{ onBlur: passwordSchema.shape.currentPassword }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="sec-current">
                    Current password
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="sec-current"
                      name={field.name}
                      type="password"
                      autoComplete="current-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={Boolean(field.state.meta.errors.length)}
                      required
                    />
                    <FieldError>
                      {field.state.meta.errors[0]?.toString()}
                    </FieldError>
                  </FieldContent>
                </Field>
              )}
            </form.Field>

            <div className="hidden sm:block" />

            <form.Field
              name="newPassword"
              validators={{ onBlur: passwordSchema.shape.newPassword }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="sec-new">New password</FieldLabel>
                  <FieldContent>
                    <Input
                      id="sec-new"
                      name={field.name}
                      type="password"
                      autoComplete="new-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={Boolean(field.state.meta.errors.length)}
                      required
                    />
                    <FieldDescription>
                      At least 8 characters. Mix of upper, lower, and digits
                      recommended.
                    </FieldDescription>
                    <FieldError>
                      {field.state.meta.errors[0]?.toString()}
                    </FieldError>
                  </FieldContent>
                </Field>
              )}
            </form.Field>

            <form.Field
              name="confirmPassword"
              validators={{ onBlur: passwordSchema.shape.confirmPassword }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="sec-confirm">
                    Confirm new password
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      id="sec-confirm"
                      name={field.name}
                      type="password"
                      autoComplete="new-password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={Boolean(field.state.meta.errors.length)}
                      required
                    />
                    <FieldError>
                      {field.state.meta.errors[0]?.toString()}
                    </FieldError>
                  </FieldContent>
                </Field>
              )}
            </form.Field>
          </div>
        </FieldGroup>

        <form.Subscribe
          selector={(s) => ({
            errors: s.errors,
            canSubmit: s.canSubmit,
            is: s.isSubmitting,
          })}
        >
          {({ errors, canSubmit, is }) => (
            <div className="flex items-end justify-between gap-3">
              <p
                role="alert"
                className="text-xs font-medium text-destructive"
              >
                {errors.length > 0 ? String(errors[0]) : ""}
              </p>
              <Button type="submit" disabled={!canSubmit || is}>
                <Save className="size-3.5" aria-hidden="true" />
                {is ? "Updating…" : "Update password"}
              </Button>
            </div>
          )}
        </form.Subscribe>
      </form>

      <Separator />

      <section>
        <div className="flex flex-col gap-1">
          <p className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Active sessions
          </p>
          <p className="max-w-[60ch] text-xs text-muted-foreground">
            These are the devices that have signed in to your account. Revoke
            any unknown or stale session immediately.
          </p>
        </div>

        <div className="mt-3 rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Device</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden md:table-cell">
                  Last active
                </TableHead>
                <TableHead className="pr-6 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-sm text-muted-foreground"
                  >
                    No active sessions. Sign in again to use this device.
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="pl-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium leading-tight">
                          {session.deviceLabel}
                        </span>
                        {session.current ? (
                          <Badge variant="default">This device</Badge>
                        ) : (
                          <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                            session · {session.id}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {session.location}
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                      {session.lastActiveAt}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      {session.current ? (
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
                          current
                        </span>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevoke(session.id)}
                        >
                          <LogOut className="size-3.5" aria-hidden="true" />
                          Sign out
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {sessions.length > 1 ? (
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleRevokeOthers}
            >
              <LogOut className="size-3.5" aria-hidden="true" />
              Sign out of all other sessions
            </Button>
          </div>
        ) : null}
      </section>

      <Separator />

      <section>
        <p className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Account export
        </p>
        <p className="mt-1 max-w-[60ch] text-xs text-muted-foreground">
          Request a portable copy of your personal data. Provisioning this
          takes up to 48 hours and the link is emailed to you.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => toast.info("Export request queued")}
          >
            Request data export
          </Button>
        </div>
      </section>
    </div>
  );
}

export default SettingsSecurity;
