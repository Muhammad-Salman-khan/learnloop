import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AboutHero } from "@/components/AboutHero/AboutHero";
import { AboutValues } from "@/components/AboutValues/AboutValues";
import {
  ClipboardListIcon,
  QuoteIcon,
  RocketIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About · LearnHub",
  description:
    "Built for educators and learning teams who ship lessons, not slide decks. LearnHub is an AI-native LMS for instructors, cohort leads, and admins.",
};

export default function AboutPage() {
  return (
    <div className="flex w-full flex-1 flex-col bg-background text-foreground">
      {/* ============= Header =============
          Same markup as app/page.tsx so the marketing chrome stays consistent.
          Per project rules: do NOT extract into a shared component in this
          task (out of scope, would touch unrelated files). */}
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
              href="/#product"
              className="transition-colors hover:text-foreground"
            >
              Product
            </Link>
            <Link
              href="/#outcomes"
              className="transition-colors hover:text-foreground"
            >
              Outcomes
            </Link>
            <Link
              href="/about"
              aria-current="page"
              className="text-foreground"
            >
              About
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

      {/* ============= Hero =============
          Centered single-column manifesto hero. Lives in its own folder so the
          visual can be reused on /mission, /team, etc. without copy-paste. */}
      <AboutHero />

      {/* ============= Values bento ============= */}
      <AboutValues />

      <Separator />

      {/* ============= Story block #1 (image LEFT, copy RIGHT) =============
          Two-column story blocks. This is block 1 of max 2 (zigzag cap).
          Image slot is a TYPED visual mock — no fake screenshots / fake
          dashboards, just a labeled timeline so the layout reads as
          editorial rather than placeholder. */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div
            aria-hidden
            className="order-2 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm ring-1 ring-foreground/5 lg:order-1"
          >
            <div className="flex items-center gap-1.5 border-b border-border/70 bg-muted/30 px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="size-2.5 rounded-full bg-muted-foreground/30" />
              <span className="ml-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Origin log
              </span>
            </div>
            <ol className="divide-y divide-border/70">
              {[
                {
                  year: "2024",
                  body: "First cohort of 40 educators runs a single AI-assisted course on a hand-rolled prototype.",
                },
                {
                  year: "2025",
                  body: "Curriculum graph and rubric engine graduate from prototype into the first public workspace.",
                },
                {
                  year: "Today",
                  body: "48,000+ educators across 90 countries run their programs inside LearnHub.",
                },
              ].map((row) => (
                <li
                  key={row.year}
                  className="grid grid-cols-[80px_1fr] items-start gap-4 p-4 sm:grid-cols-[96px_1fr] sm:gap-6 sm:p-5"
                >
                  <span className="font-mono text-[12px] font-medium uppercase tracking-wider text-muted-foreground tabular-nums">
                    {row.year}
                  </span>
                  <p className="text-[14.5px] leading-relaxed text-foreground">
                    {row.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="order-1 flex flex-col gap-5 lg:order-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Where we started
            </span>
            <h2 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
              Three instructors. One shared spreadsheet. A lot of late nights.
            </h2>
            <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground">
              LearnHub started as a single shared spreadsheet between three
              instructors who taught different cohorts of the same program.
              Lesson planning, rubrics, scheduling, and grading lived in four
              tabs and one landline group chat. We replaced it with code,
              slowly, carefully, with educators in the room the whole time.
            </p>
            <ul className="flex flex-col gap-2 text-[14.5px] text-muted-foreground">
              {[
                "Co-designed with the first 40 instructors in pilot.",
                "Every rubric and grading rubric ships only after a real cohort uses it.",
                "Roadmap is public. Regressions are public. So are the things we won't build.",
              ].map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <ClipboardListIcon
                    className="mt-0.5 size-4 shrink-0 text-foreground/70"
                    aria-hidden
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============= Story block #2 (copy LEFT, image RIGHT) =============
          Block 2 of 2 — zigzag cap. Different layout family from block 1 by
          swapping image/copy sides. */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-5">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Where we&apos;re going
            </span>
            <h2 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
              The next chapter is the boring one. On purpose.
            </h2>
            <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground">
              We&apos;re not chasing a viral demo. The next year is about
              making the parts of LearnHub you already use feel quieter:
              faster grading, calmer inboxes, smarter rubrics that explain
              themselves, and an AI tutor that knows when to stay out of the
              way.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  Icon: TargetIcon,
                  label: "Fewer features",
                  body: "We retire more than we ship each quarter.",
                },
                {
                  Icon: RocketIcon,
                  label: "Deeper defaults",
                  body: "Sensible defaults so you don't configure your way out of value.",
                },
              ].map(({ Icon, label, body }) => (
                <div
                  key={label}
                  className="rounded-xl border border-border/70 bg-card p-4"
                >
                  <Icon className="size-4 text-foreground/70" aria-hidden />
                  <p className="mt-3 text-[13.5px] font-semibold text-foreground">
                    {label}
                  </p>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            aria-hidden
            className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm ring-1 ring-foreground/5"
          >
            <div className="flex flex-col gap-5 p-6 sm:p-8">
              <QuoteIcon className="size-6 text-muted-foreground/70" />
              <p className="text-balance text-[17px] leading-relaxed text-foreground sm:text-[18px]">
                LearnHub is one of the few tools we bring instructors into
                during onboarding and find them still using two months later.
                It does the unsexy work first.
              </p>
              <Separator />
              <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-muted text-[13px] font-semibold text-foreground">
                  IB
                </span>
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-foreground">
                    Instructor Bee (placeholder example)
                  </span>
                  <span className="text-[13px] text-muted-foreground">
                    Curriculum lead, Cohort Spring 2026
                  </span>
                </div>
              </div>
              <p className="text-[11.5px] uppercase tracking-wider text-muted-foreground">
                Placeholder quote · swap with real testimonial once collected
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* ============= Stats strip =============
          Single dense data row. Per design rules, stat numbers MUST use
          font-mono + tabular-nums so digits don't jitter between figures. */}
      <section
        aria-labelledby="about-stats-heading"
        className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <h2 id="about-stats-heading" className="sr-only">
          LearnHub at a glance
        </h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-y-0">
          {[
            { value: "48,000+", label: "Educators using LearnHub" },
            { value: "1.2M", label: "Lessons shipped this year" },
            { value: "94%", label: "Average cohort completion" },
            { value: "90", label: "Countries served" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-2 border-l border-border/70 pl-4 sm:border-l sm:pl-6 first:border-l-0 first:pl-0 sm:first:border-l sm:first:pl-6"
            >
              <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="font-mono text-3xl font-semibold tracking-tight text-foreground tabular-nums sm:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <Separator />

      {/* ============= CTA card =============
          Reuses the same Card + CardContent flex pattern as app/page.tsx so
          the marketing rhythm stays consistent. CTA label mirrors the home
          page (single signup intent = "Create your workspace") per
          duplicate-CTA-intent rule. */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Card className="overflow-hidden border-border/70 bg-card">
          <CardContent className="flex flex-col items-start gap-6 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Spend less time on the tabs. More time on the teaching.
              </h2>
              <p className="text-pretty text-[15px] text-muted-foreground">
                Spin up a workspace, invite three collaborators, and ship a
                lesson this week. The trial does not require a card.
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
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ============= Team / contact placeholder =============
          Plain text mini-grid. Names below are PLACEHOLDER EXAMPLES — replace
          with real names/roles once you decide who is on the team. */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="flex flex-col items-start gap-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Say hello
          </span>
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Talk to a human, not a sales bot.
          </h2>
          <p className="max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground">
            We answer support and partnership email ourselves, weekdays within
            one business day. Press and research inquiries get a dedicated
            inbox.
          </p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Support", email: "support@learnhub.example" },
            { label: "Partnerships", email: "partners@learnhub.example" },
            { label: "Press", email: "press@learnhub.example" },
          ].map((c) => (
            <Card key={c.label} className="border-border/70 bg-card">
              <CardHeader className="gap-1">
                <CardDescription className="text-[12.5px] font-medium uppercase tracking-wider text-muted-foreground">
                  {c.label}
                </CardDescription>
                <CardTitle className="font-mono text-[14px] tracking-normal text-foreground">
                  <a
                    href={`mailto:${c.email}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {c.email}
                  </a>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
        <p className="mt-4 text-[12px] uppercase tracking-wider text-muted-foreground">
          Placeholder emails · swap with real addresses before launch
        </p>
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
