import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartLineIcon,
  GraduationCapIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col bg-background text-foreground">
      {/* ============= Header ============= */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background shadow-sm">
              <SparklesIcon className="size-3.5" aria-hidden />
            </span>
            <span className="text-[15px]">LearnHub</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <Link
              href="#product"
              className="transition-colors hover:text-foreground"
            >
              Product
            </Link>
            <Link
              href="#outcomes"
              className="transition-colors hover:text-foreground"
            >
              Outcomes
            </Link>
            <Link
              href="#trust"
              className="transition-colors hover:text-foreground"
            >
              Trust
            </Link>
            <Link
              href="/login"
              className="transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild size="sm" className="h-9 rounded-md shadow-sm">
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ============= Hero ============= */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_0%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_70%)]"
        />
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:px-8 lg:py-28">
          <div className="flex flex-col items-start gap-6">
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full border-border/60 px-3 py-1 text-[11px] font-medium tracking-wide"
            >
              <SparklesIcon className="size-3" aria-hidden />
              New · AI lesson studio is live
            </Badge>
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
              Run your learning program{" "}
              <span className="text-muted-foreground">without the busywork.</span>
            </h1>
            <p className="max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              LearnHub puts lesson planning, live cohorts, grading, and AI
              tutoring in one calm, well-typed interface. Built for educators
              and learning teams that ship.
            </p>
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="h-11 w-full rounded-md text-[14px] font-medium shadow-sm sm:w-auto"
              >
                <Link href="/signup">Start free trial</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 w-full rounded-md border-border/80 text-[14px] font-medium sm:w-auto"
              >
                <Link href="/login">Sign in to workspace</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              14-day free trial · No credit card required · SOC 2 Type II
            </p>
          </div>

          {/* Hero visual — typed mock, no fake images */}
          <div
            className="relative w-full max-w-xl justify-self-center lg:justify-self-end"
            aria-hidden
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm ring-1 ring-foreground/5">
              <div className="flex items-center gap-1.5 border-b border-border/70 bg-muted/30 px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="size-2.5 rounded-full bg-muted-foreground/30" />
                <span className="ml-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Cohort · Spring 2026
                </span>
              </div>
              <div className="grid gap-3 p-4 sm:grid-cols-3">
                {[
                  { label: "Active learners", value: "1,284" },
                  { label: "Lessons shipped", value: "62" },
                  { label: "Completion", value: "94%" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-border/60 bg-background p-3"
                  >
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {s.label}
                    </p>
                    <p className="mt-1 text-xl font-semibold tracking-tight">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-4">
                <div className="rounded-xl border border-border/60 bg-background p-4">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Latest lesson
                  </p>
                  <p className="mt-1 text-[14px] font-medium">
                    Intro to transformers — positional encoding
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[66%] rounded-full bg-foreground/80" />
                    </div>
                    <span className="text-[11px] tabular-nums text-muted-foreground">
                      66%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ============= Trust / Outcomes ============= */}
      <section
        id="outcomes"
        className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8 lg:py-24"
      >
        {[
          {
            Icon: ChartLineIcon,
            title: "Track real outcomes",
            body: "Completion, mastery, and cohort progress in one dashboard.",
          },
          {
            Icon: GraduationCapIcon,
            title: "Adaptive content",
            body: "Quizzes adapt to learner level. AI tutors answer in context.",
          },
          {
            Icon: UsersIcon,
            title: "Live cohorts",
            body: "Run branded cohort sessions with calendar, inbox, and replays.",
          },
        ].map(({ Icon, title, body }) => (
          <Card key={title} className="border-border/70 bg-card">
            <CardHeader className="gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
                <Icon className="size-5" aria-hidden />
              </div>
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              <CardDescription className="text-[14px] leading-relaxed">
                {body}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Separator />

      {/* ============= CTA ============= */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Card className="overflow-hidden border-border/70 bg-card">
          <CardContent className="flex flex-col items-start gap-6 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to ship learning that actually sticks?
              </h2>
              <p className="text-pretty text-[15px] text-muted-foreground">
                Join 48,000+ educators and learning teams. Cancel from settings
                any time.
              </p>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-11 w-full rounded-md text-[14px] font-medium shadow-sm sm:w-auto"
              >
                <Link href="/signup">Create your workspace</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 w-full rounded-md border-border/80 text-[14px] font-medium sm:w-auto"
              >
                <Link href="/login">Talk to sales</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ============= Footer ============= */}
      <footer className="mt-auto border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 px-4 py-8 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheckIcon className="size-3.5" aria-hidden />
            SOC 2 Type II · GDPR-ready · 256-bit encryption
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} LearnHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
