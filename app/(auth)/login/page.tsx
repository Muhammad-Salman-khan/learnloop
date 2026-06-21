import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/AuthShell/AuthShell";
import { LoginForm } from "@/components/LoginForm/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your AI-powered LMS account to continue learning and teaching.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your workspace"
      subtitle="Pick up where you left off in your courses, lessons, and live sessions."
    >
      <LoginForm />
      <p className="text-center text-xs text-muted-foreground">
        By continuing, you agree to our{" "}
        <Link
          href="/terms"
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline-offset-4 hover:text-foreground hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </AuthShell>
  );
}
