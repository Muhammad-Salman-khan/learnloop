import type { Metadata } from "next";

import { AuthShell } from "@/components/AuthShell/AuthShell";
import { SignupForm } from "@/components/SignupForm/SignupForm";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Get started with the AI-powered LMS — your courses, lessons, and live learning studio in one place.",
};

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your learning workspace"
      subtitle="It takes less than a minute. Use email, or continue with Google."
    >
      <SignupForm />
    </AuthShell>
  );
}
