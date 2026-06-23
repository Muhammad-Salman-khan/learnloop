"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Camera, RefreshCcw, Save } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { profileSchema, type ProfileFormValues } from "@/lib/settings/profile-schema";
import { profileDefaults } from "@/lib/settings/settings-data";

// Client Component. Form state lives in @tanstack/react-form; zod schema is
// mounted as the onChange validator so errors surface field-by-field. Submit
// is preview-only (toast on success) — the persistence layer lands later.
export function SettingsProfile() {
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const form = useForm({
    defaultValues: profileDefaults as ProfileFormValues,
    validators: {
      // zod produces a record keyed by field path; merge into form errors.
      onChange: profileSchema,
    },
    onSubmit: async ({ value }) => {
      setSavedAt(new Date().toLocaleString());
      toast.success("Profile updated", {
        description: `${value.firstName} ${value.lastName}`,
      });
    },
  });

  const handleReset = () => {
    form.reset();
    setSavedAt(null);
    toast.info("Reverted to your last saved profile");
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-8"
      noValidate
    >
      <form.Subscribe
        selector={(state) => ({
          firstName: state.values.firstName,
          lastName: state.values.lastName,
        })}
      >
        {({ firstName, lastName }) => (
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="profile-avatar">Profile photo</FieldLabel>
              <FieldContent>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-full bg-muted text-base font-semibold text-muted-foreground ring-1 ring-foreground/10">
                    {(firstName[0] ?? "S").toUpperCase()}
                    {(lastName[0] ?? "K").toUpperCase()}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info("Photo upload is preview-only")}
                    >
                      <Camera className="size-3.5" aria-hidden="true" />
                      Upload photo
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => form.setFieldValue("avatarUrl", "")}
                    >
                      <RefreshCcw className="size-3.5" aria-hidden="true" />
                      Reset to initials
                    </Button>
                  </div>
                </div>
                <FieldDescription>
                  JPG or PNG up to 2 MB. The avatar appears next to your
                  messages and on the cohort directory listing.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        )}
      </form.Subscribe>

      <Separator />

      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <form.Field
            name="firstName"
            validators={{ onChange: profileSchema.shape.firstName }}
          >
            {(field) => (
              <Field>
                <FieldLabel htmlFor="profile-firstName">First name</FieldLabel>
                <FieldContent>
                  <Input
                    id="profile-firstName"
                    name={field.name}
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

          <form.Field
            name="lastName"
            validators={{ onChange: profileSchema.shape.lastName }}
          >
            {(field) => (
              <Field>
                <FieldLabel htmlFor="profile-lastName">Last name</FieldLabel>
                <FieldContent>
                  <Input
                    id="profile-lastName"
                    name={field.name}
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

          <form.Field name="preferredName">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="profile-preferredName">
                  Preferred name
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="profile-preferredName"
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={Boolean(field.state.meta.errors.length)}
                  />
                  <FieldDescription>
                    Shown in the header and cohort directory instead of your
                    full name. Leave blank to use your first name.
                  </FieldDescription>
                  <FieldError>
                    {field.state.meta.errors[0]?.toString()}
                  </FieldError>
                </FieldContent>
              </Field>
            )}
          </form.Field>

          <form.Field name="phone">
            {(field) => (
              <Field>
                <FieldLabel htmlFor="profile-phone">Phone</FieldLabel>
                <FieldContent>
                  <Input
                    id="profile-phone"
                    name={field.name}
                    type="tel"
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={Boolean(field.state.meta.errors.length)}
                    placeholder="+92 300 0000000"
                  />
                  <FieldDescription>
                    Used only for SMS reminders and registrar outreach.
                  </FieldDescription>
                  <FieldError>
                    {field.state.meta.errors[0]?.toString()}
                  </FieldError>
                </FieldContent>
              </Field>
            )}
          </form.Field>
        </div>
      </FieldGroup>

      <Separator />

      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="profile-email">Institutional email</FieldLabel>
            <FieldContent>
              <form.Field name="email">
                {(field) => (
                  <Input
                    id="profile-email"
                    name={field.name}
                    value={field.state.value}
                    readOnly
                    aria-readonly="true"
                    className="bg-muted/50 text-muted-foreground"
                  />
                )}
              </form.Field>
              <FieldDescription>
                Email flows from auth and is read-only here.
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="profile-studentId">Student ID</FieldLabel>
            <FieldContent>
              <form.Field name="studentId">
                {(field) => (
                  <Input
                    id="profile-studentId"
                    name={field.name}
                    value={field.state.value}
                    readOnly
                    aria-readonly="true"
                    className="bg-muted/50 font-mono text-muted-foreground"
                  />
                )}
              </form.Field>
              <FieldDescription>
                Issued by the registrar. Contact the office to change.
              </FieldDescription>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="profile-programme">Programme</FieldLabel>
            <FieldContent>
              <form.Field name="programme">
                {(field) => (
                  <Input
                    id="profile-programme"
                    name={field.name}
                    value={field.state.value}
                    readOnly
                    aria-readonly="true"
                    className="bg-muted/50 text-muted-foreground"
                  />
                )}
              </form.Field>
              <FieldDescription>
                Programme is set by admissions. Update from the registrar
                request form if you need to change tracks.
              </FieldDescription>
            </FieldContent>
          </Field>

          <form.Field
            name="yearOfStudy"
            validators={{ onChange: profileSchema.shape.yearOfStudy }}
          >
            {(field) => (
              <Field>
                <FieldLabel htmlFor="profile-yearOfStudy">
                  Year of study
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="profile-yearOfStudy"
                    name={field.name}
                    type="number"
                    min={1}
                    max={8}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    aria-invalid={Boolean(field.state.meta.errors.length)}
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

      <Separator />

      <form.Field
        name="bio"
        validators={{ onChange: profileSchema.shape.bio }}
      >
        {(field) => (
          <Field>
            <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
            <FieldContent>
              <Textarea
                id="profile-bio"
                name={field.name}
                rows={4}
                value={field.state.value}
                maxLength={280}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={Boolean(field.state.meta.errors.length)}
              />
              <div className="flex items-center justify-between gap-4">
                <FieldDescription>
                  Visible on your public profile and the cohort directory
                  listing.
                </FieldDescription>
                <span className="font-mono text-[10.5px] tabular-nums text-muted-foreground">
                  {field.state.value.length}/280
                </span>
              </div>
              <FieldError>
                {field.state.meta.errors[0]?.toString()}
              </FieldError>
            </FieldContent>
          </Field>
        )}
      </form.Field>

      <Separator />

      <form.Subscribe
        selector={(state) => ({
          firstName: state.values.firstName,
          lastName: state.values.lastName,
          preferredName: state.values.preferredName ?? "",
          email: state.values.email,
          studentId: state.values.studentId,
          programme: state.values.programme,
          yearOfStudy: state.values.yearOfStudy,
          phone: state.values.phone ?? "",
        })}
      >
        {(values) => (
          <section>
            <p className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Identity recap
            </p>
            <p className="mt-1 max-w-[60ch] text-xs text-muted-foreground">
              Read-only view of how your identity appears in the system. Use
              this as a quick late-night sanity check before submitting forms.
            </p>
            <div className="mt-3 rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Field</TableHead>
                    <TableHead className="pr-6">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="pl-6 font-medium">
                      Display name
                    </TableCell>
                    <TableCell className="pr-6">
                      {values.preferredName ||
                        `${values.firstName} ${values.lastName}`}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 font-medium">Email</TableCell>
                    <TableCell className="pr-6 font-mono text-xs text-muted-foreground">
                      {values.email}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 font-medium">
                      Student ID
                    </TableCell>
                    <TableCell className="pr-6 font-mono text-xs text-muted-foreground">
                      {values.studentId}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 font-medium">
                      Programme
                    </TableCell>
                    <TableCell className="pr-6">{values.programme}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 font-medium">Year</TableCell>
                    <TableCell className="pr-6 font-mono tabular-nums">
                      Year {values.yearOfStudy}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 font-medium">Phone</TableCell>
                    <TableCell className="pr-6 font-mono text-xs text-muted-foreground">
                      {values.phone || "—"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </section>
        )}
      </form.Subscribe>

      <Separator />

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[10.5px] text-muted-foreground">
              {savedAt
                ? `Last saved locally ${savedAt}`
                : "Changes not yet saved"}
              {isSubmitting ? " · saving…" : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="ghost" onClick={handleReset}>
                <RefreshCcw className="size-3.5" aria-hidden="true" />
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="size-3.5" aria-hidden="true" />
                {isSubmitting ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

export default SettingsProfile;
