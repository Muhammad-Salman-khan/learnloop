import type { Metadata } from "next";
import Link from "next/link";

import { AuthPanel } from "@/components/AuthPanel/AuthPanel";
import { AuthShell } from "@/components/AuthShell/AuthShell";
import { LoginForm } from "@/components/LoginForm/LoginForm";

export const metadata: Metadata = {
  title: "Sign in · LearnHub",
  description:
    "Sign in to your AI-powered LMS account to continue learning and teaching.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your workspace"
      subtitle="Pick up where you left off in your courses, lessons, and live sessions."
      panel={
        <AuthPanel
          eyebrow="Keep momentum"
          headline="Run your learning program without the busywork."
          description="LearnHub puts lesson planning, live cohorts, grading, and AI tutoring in one calm, well-typed interface so your team ships content instead of wrangling tabs."
          bullets={[
            "Plan in minutes with AI-generated lesson outlines tied to your curriculum.",
            "Track cohort progress, completion, and outcomes on one dashboard.",
            "Issue credentials, schedule live sessions, and answer learners — all from one inbox.",
          ]}
        />
      }
    >
      <LoginForm />
      <p className="text-center text-xs text-muted-foreground sm:text-left">
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
