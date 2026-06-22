"use client";
/* eslint-disable react/no-children-prop -- TanStack Form requires render-prop `children` on <form.Field> and <form.Subscribe>. */

import * as React from "react";
import Link from "next/link";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertCircleIcon,
  ArrowRightIcon,
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
  Field,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { loginFormSchema, type LoginFormValues } from "@/lib/Types/auth";
import Image from "next/image";
import { loginWithEmail } from "@/lib/FormAuth";
import { signIn } from "@/lib/auth/authClient";

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

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      remember: true as boolean,
    } satisfies LoginFormValues,
    validators: {
      onChange: loginFormSchema,
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      //
      try {
        const payload = {
          email: value.email.trim(),
          password: value.password,
        };
        const { message, error, success } = await loginWithEmail(payload);
        if (!success) {
          return toast.error(error, {
            description: error ?? `something went wrong`,
          });
        }
        toast.success(message, {
          description: "You're now signed in.",
        });
        return router.push("/dashboard");
      } catch (error) {
        if (error instanceof Error && error.message === "already_exists") {
          setFormError("An account with this email already exists.");
        } else {
          setFormError("We couldn't create your account. Please try again.");
        }
        toast.error("Sign up failed.", {
          description: formError ?? "Please review your details.",
        });
      }
      //
    },
  });
  const loginWithGoogle = async () => {
    try {
      await signIn.social({ provider: "google", callbackURL: "/dashboard" });
    } catch (error: any) {
      toast.error(error?.message, {
        description: error?.message ?? "Please review your details.",
      });
      return console.error(error);
    }
  };
  return (
    <div className="flex flex-col">
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
            <AlertTitle>Couldn&apos;t sign you in</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        : null}

        <FieldGroup className="gap-5">
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="gap-2">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-[13px] font-medium text-foreground"
                  >
                    Email
                  </FieldLabel>
                  <InputGroup className="h-11 rounded-lg bg-muted/40 transition-colors focus-within:bg-background focus-within:ring-2 focus-within:ring-ring/40">
                    <InputGroupAddon align="inline-start">
                      <MailIcon data-icon="inline-start" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="you@company.com"
                      className="text-[15px]"
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
                <Field data-invalid={isInvalid} className="gap-2">
                  <div className="flex items-center justify-between">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-[13px] font-medium text-foreground"
                    >
                      Password
                    </FieldLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <InputGroup className="h-11 rounded-lg bg-muted/40 transition-colors focus-within:bg-background focus-within:ring-2 focus-within:ring-ring/40">
                    <InputGroupAddon align="inline-start">
                      <LockIcon data-icon="inline-start" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="•••••••••••"
                      className="text-[15px]"
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
                        {showPassword ?
                          <EyeOffIcon data-icon="inline" />
                        : <EyeIcon data-icon="inline" />}
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
              <Field orientation="horizontal" className="gap-2.5">
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    field.handleChange(checked === true)
                  }
                />
                <FieldLabel
                  htmlFor={field.name}
                  className="text-[13px] font-normal text-muted-foreground"
                >
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
              className="h-11 w-full rounded-lg text-[14px] font-medium shadow-sm"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ?
                <>
                  <Spinner />
                  Signing you in…
                </>
              : <>
                  <LogInIcon data-icon="inline-start" />
                  Sign in
                </>
              }
            </Button>
          )}
        />

        <FieldSeparator className="my-1">
          <span className="bg-background px-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Or continue with
          </span>
        </FieldSeparator>

        <Button
          onClick={loginWithGoogle}
          type="button"
          variant="outline"
          size="lg"
          className="h-11 w-full rounded-lg border-border/80 text-[14px] font-medium shadow-xs transition-colors hover:bg-muted/60"
        >
          <Image
            width={22}
            height={22}
            alt="google buttons"
            src="/google-button.svg"
          />
          Continue with Google
        </Button>

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
    </div>
  );
}
