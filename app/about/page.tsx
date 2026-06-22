import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AboutHero } from "@/components/AboutHero/AboutHero";
import { AboutManifesto } from "@/components/AboutManifesto/AboutManifesto";
import { AboutTimeline } from "@/components/AboutTimeline/AboutTimeline";
import { ShieldCheckIcon, SparklesIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "About · LearnHub",
  description:
    "Built for educators and learning teams who ship lessons, not slide decks. LearnHub is an AI-native LMS for instructors, cohort leads, and admins.",
};

export default function AboutPage() {
  return (
    <div className="flex w-full flex-1 flex-col bg-background text-foreground">
      {/* Header — same chrome as home so the marketing navigation stays
          consistent. Active page is marked via aria-current. */}
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

      {/* Editorial cover — single image + serif headline. */}
      <AboutHero />

      <Separator />

      {/* Manifesto — single column, numbered, no bento. */}
      <AboutManifesto />

      <Separator />

      {/* Five years, horizontal scroll, GSAP-driven on desktop.
          Mobile collapses to a vertical stack inside the component. */}
      <AboutTimeline />

      <Separator />

      {/* Closing — single quiet paragraph + a single-line CTA card.
          Card uses the same radius/rhythm as the rest of the page
          (rounded-sm on this dossier variant) so the chrome dissolves. */}
      <section className="mx-auto w-full max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
        <h2 className="font-display text-balance text-2xl font-medium leading-tight tracking-tight text-foreground sm:text-3xl">
          That&apos;s the file.
        </h2>
        <p className="mt-5 text-pretty text-[15.5px] leading-relaxed text-muted-foreground">
          Spin up a workspace, invite three collaborators, and ship a lesson
          this week. The trial does not require a card, and we retire more
          than we ship.
        </p>
        <div className="mt-10 flex w-full flex-col justify-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="h-11 rounded-md px-6 text-[14px] font-medium shadow-sm"
          >
            <Link href="/signup">Create your workspace</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-11 rounded-md border-border/80 px-6 text-[14px] font-medium"
          >
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </section>

      {/* Footer — same compliance strip as home. */}
      <footer className="mt-auto border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
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
