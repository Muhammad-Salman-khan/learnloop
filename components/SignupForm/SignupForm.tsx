"use client";
/* eslint-disable react/no-children-prop -- TanStack Form requires render-prop `children` on <form.Field> and <form.Subscribe>. */

import * as React from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  CircleCheckIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UserPlusIcon,
  UserIcon,
} from "lucide-react";
import type { AnyFieldApi } from "@tanstack/react-form";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";

import { signupFormSchema, type SignupFormValues } from "@/lib/Types/auth";

function FieldInfo({ field: f }: { field: AnyFieldApi }) {
  const errors = f.state.meta.errors;
  if (!errors.length) return null;
  const first = errors[0];
  const message =
    first && typeof first === "object" && "message" in first ?
      String(first.message)
    : typeof first === "string" ? first
    : "Invalid value.";
  return <FieldError errors={[{ message }]} />;
}

const PASSWORD_RULES = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (v: string) => v.length >= 8,
  },
  {
    id: "lower",
    label: "One lowercase letter",
    test: (v: string) => /[a-z]/.test(v),
  },
  {
    id: "upper",
    label: "One uppercase letter",
    test: (v: string) => /[A-Z]/.test(v),
  },
  { id: "number", label: "One number", test: (v: string) => /[0-9]/.test(v) },
] as const;

export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false as boolean,
    } satisfies SignupFormValues,
    validators: {
      onChange: signupFormSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      try {
        const payload = {
          name: value.name.trim(),
          email: value.email.trim(),
          password: value.password,
        };
        const res = await fetch("/api/auth/sign-up/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const status = res.status;
          throw new Error(
            status === 422 ? "already_exists" : "invalid_request",
          );
        }
        toast.success("Account created.", {
          description: "You're now signed in.",
        });
        router.push("/dashboard");
        router.refresh();
      } catch (err) {
        if (err instanceof Error && err.message === "already_exists") {
          setFormError("An account with this email already exists.");
        } else {
          setFormError("We couldn't create your account. Please try again.");
        }
        toast.error("Sign up failed.", {
          description: formError ?? "Please review your details.",
        });
      }
    },
  });

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Create your account</CardTitle>
        <CardDescription>A few details to get you started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-5"
        >
          {formError ?
            <Alert variant="destructive" role="alert">
              <AlertCircleIcon data-icon="inline-start" />
              <AlertTitle>Couldn&apos;t create your account</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          : null}

          <FieldGroup>
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <UserIcon data-icon="inline-start" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        type="text"
                        autoComplete="name"
                        placeholder="Ada Lovelace"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                      />
                    </InputGroup>
                    <FieldInfo field={field} />
                  </Field>
                );
              }}
            />

            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <MailIcon data-icon="inline-start" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="you@example.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                      />
                    </InputGroup>
                    <FieldInfo field={field} />
                  </Field>
                );
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const value = field.state.value;
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <LockIcon data-icon="inline-start" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        value={value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                      />
                      <InputGroupAddon align="inline-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          aria-pressed={showPassword}
                          onClick={() => setShowPassword((v) => !v)}
                        >
                          {showPassword ?
                            <EyeOffIcon data-icon="inline" />
                          : <EyeIcon data-icon="inline" />}
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldInfo field={field} />
                    {!isInvalid && value ?
                      <ul
                        aria-label="Password requirements"
                        className="grid grid-cols-1 gap-1.5 rounded-lg border border-border/60 bg-muted/40 p-3 text-xs sm:grid-cols-2"
                      >
                        {PASSWORD_RULES.map((rule) => {
                          const meets = rule.test(value);
                          return (
                            <li
                              key={rule.id}
                              className="flex items-center gap-2 text-muted-foreground"
                            >
                              {meets ?
                                <CircleCheckIcon
                                  data-icon="inline-start"
                                  className="size-3.5 text-primary"
                                  aria-hidden
                                />
                              : <span
                                  aria-hidden
                                  className="inline-flex size-3.5 items-center justify-center rounded-full border border-border"
                                />
                              }
                              <span
                                className={
                                  meets ? "text-foreground" : (
                                    "text-muted-foreground"
                                  )
                                }
                              >
                                {rule.label}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    : null}
                  </Field>
                );
              }}
            />

            <form.Field
              name="confirmPassword"
              validators={{
                onChangeListenTo: ["password"],
                onChange: ({ value, fieldApi }) => {
                  if (!value) {
                    return undefined;
                  }
                  if (value !== fieldApi.form.getFieldValue("password")) {
                    return "Passwords do not match.";
                  }
                  return undefined;
                },
              }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                const matches =
                  Boolean(field.state.value) &&
                  field.state.value === form.state.values.password;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm password
                    </FieldLabel>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <LockIcon data-icon="inline-start" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        type={showConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Repeat your password"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                      />
                      <InputGroupAddon align="inline-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label={
                            showConfirm ? "Hide password" : "Show password"
                          }
                          aria-pressed={showConfirm}
                          onClick={() => setShowConfirm((v) => !v)}
                        >
                          {showConfirm ?
                            <EyeOffIcon data-icon="inline" />
                          : <EyeIcon data-icon="inline" />}
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                    {matches && !isInvalid ?
                      <FieldDescription className="flex items-center gap-1.5 text-primary">
                        <CheckCircle2Icon
                          data-icon="inline-start"
                          className="size-3.5"
                          aria-hidden
                        />
                        Passwords match.
                      </FieldDescription>
                    : null}
                    <FieldInfo field={field} />
                  </Field>
                );
              }}
            />

            <form.Field
              name="terms"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid}>
                    <Checkbox
                      id={field.name}
                      name={field.name}
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked === true)
                      }
                      aria-invalid={isInvalid}
                    />
                    <FieldLabel
                      htmlFor={field.name}
                      className="font-normal leading-snug text-muted-foreground"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                      >
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </FieldLabel>
                    <FieldInfo field={field} />
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <form.Subscribe
            selector={(state) => ({
              canSubmit: state.canSubmit,
              isSubmitting: state.isSubmitting,
            })}
            children={({ canSubmit, isSubmitting }) => (
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ?
                  <>
                    <Spinner />
                    Creating account…
                  </>
                : <>
                    <UserPlusIcon data-icon="inline-start" />
                    Create account
                  </>
                }
              </Button>
            )}
          />

          <FieldSeparator>
            <span className="bg-card px-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Or
            </span>
          </FieldSeparator>

          <Button type="button" variant="outline" size="lg" className="w-full">
            <GoogleMark />
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

function GoogleMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4" data-icon="inline">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.44.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.47 1.18 4.97l3.66-2.87z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.65l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
