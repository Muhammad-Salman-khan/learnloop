"use client";
/* eslint-disable react/no-children-prop -- TanStack Form requires render-prop `children` on <form.Field> and <form.Subscribe>. */

import * as React from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  LogInIcon,
  MailIcon,
} from "lucide-react";
import type { AnyFieldApi } from "@tanstack/react-form";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

import { loginFormSchema, type LoginFormValues } from "@/lib/Types/auth";

function FieldInfo({ field: f }: { field: AnyFieldApi }) {
  const errors = f.state.meta.errors;
  if (!errors.length) return null;
  const first = errors[0];
  const message =
    first && typeof first === "object" && "message" in first
      ? String(first.message)
      : typeof first === "string"
        ? first
        : "Invalid value.";
  return <FieldError errors={[{ message }]} />;
}

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    } satisfies LoginFormValues,
    validators: {
      onChange: loginFormSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      try {
        const payload = {
          email: value.email.trim(),
          password: value.password,
        };
        const res = await fetch("/api/auth/sign-in/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error("invalid_credentials");
        }
        toast.success("Welcome back.", {
          description: "You're now signed in.",
        });
        router.push("/dashboard");
        router.refresh();
      } catch {
        setFormError("Invalid email or password. Please try again.");
        toast.error("Sign in failed.", {
          description: "Check your email and password.",
        });
      }
    },
  });

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Sign in</CardTitle>
        <CardDescription>
          Use the email and password tied to your account.
        </CardDescription>
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
          {formError ? (
            <Alert variant="destructive" role="alert">
              <AlertCircleIcon data-icon="inline-start" />
              <AlertTitle>Couldn&apos;t sign you in</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          ) : null}

          <FieldGroup>
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
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="flex items-center justify-between">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <LockIcon data-icon="inline-start" />
                      </InputGroupAddon>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="••••••••"
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
                            showPassword ? "Hide password" : "Show password"
                          }
                          aria-pressed={showPassword}
                          onClick={() => setShowPassword((v) => !v)}
                        >
                          {showPassword ? (
                            <EyeOffIcon data-icon="inline" />
                          ) : (
                            <EyeIcon data-icon="inline" />
                          )}
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldInfo field={field} />
                  </Field>
                );
              }}
            />

            <form.Field
              name="remember"
              children={(field) => (
                <Field orientation="horizontal">
                  <Checkbox
                    id={field.name}
                    name={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) =>
                      field.handleChange(checked === true)
                    }
                  />
                  <FieldLabel htmlFor={field.name} className="font-normal">
                    Keep me signed in on this device
                  </FieldLabel>
                </Field>
              )}
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
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Signing in…
                  </>
                ) : (
                  <>
                    <LogInIcon data-icon="inline-start" />
                    Sign in
                  </>
                )}
              </Button>
            )}
          />

          <FieldSeparator>
            <span className="bg-card px-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Or
            </span>
          </FieldSeparator>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
          >
            <GoogleMark />
            Continue with Google
          </Button>

          <Separator />

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

function GoogleMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-4"
      data-icon="inline"
    >
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
