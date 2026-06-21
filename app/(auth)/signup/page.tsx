import type { Metadata } from "next";

import { AuthFeatureChips, AuthPanel } from "@/components/AuthPanel/AuthPanel";
import { AuthShell } from "@/components/AuthShell/AuthShell";
import { SignupForm } from "@/components/SignupForm/SignupForm";

export const metadata: Metadata = {
  title: "Create your account · LearnHub",
  description:
    "Get started with LearnHub — your courses, lessons, and live learning studio in one place.",
};

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Get started — it's free"
      title="Create your learning workspace"
      subtitle="Join 48,000+ educators and teams using LearnHub to ship courses, run live cohorts, and certify learners, all in one place."
      panel={
        <AuthPanel
          eyebrow="What's included"
          headline="Everything you need on day one, nothing you don't."
          description="Start with a guided 90-second setup. Add your team, connect a content source, and publish your first lesson this afternoon."
          bullets={[
            "14-day free trial — no credit card required, cancel from settings.",
            "AI lesson studio with version control and curriculum-aware outlines.",
            "Built-in live cohorts, quizzes, grading rubrics, and credentialing.",
            "SSO for Google, Microsoft, and SAML when your team grows.",
          ]}
          socialProof={
            <div className="flex flex-col gap-3">
              <AuthFeatureChips />
            </div>
          }
        />
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
