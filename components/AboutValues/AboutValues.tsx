import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpenCheckIcon,
  CompassIcon,
  GaugeCircleIcon,
  SparkleIcon,
} from "lucide-react";

type Value = {
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  body: string;
};

// Edit this list to add/remove values. Order matters — first cell is the
// "lead" tile and uses the bigger card variant below.
const values: ReadonlyArray<Value> = [
  {
    Icon: BookOpenCheckIcon,
    title: "Lesson plans ship, not stall",
    body: "AI outlines, rubrics, and adaptive quizzes tied to a real curriculum graph — so a draft on Monday becomes a graded lesson by Friday.",
  },
  {
    Icon: CompassIcon,
    title: "One calm workspace",
    body: "Lesson planning, cohort inbox, grading, and scheduling live in the same typed interface. No more twelve-tab Mondays.",
  },
  {
    Icon: GaugeCircleIcon,
    title: "Outcomes over vanity",
    body: "We measure completion, mastery, and cohort-to-cohort improvement — not pageviews, time-on-page, or other theater metrics.",
  },
  {
    Icon: SparkleIcon,
    title: "Calm by default",
    body: "Soft borders, generous spacing, no marketing popups in your own dashboard. The product should feel like the work, not a billboard for it.",
  },
];

/**
 * Server-rendered 2x2 bento grid of brand values for `/about`.
 *
 * Layout family: asymmetric bento. The lead tile (first item) spans both
 * columns on mobile and the full width row on `lg`. The remaining cells are
 * 1fr 1fr on `lg` and stack on mobile.
 *
 * Bento Background Diversity (per design rule): each cell gets a subtle
 * visual variation — the lead tile uses a tinted foreground panel, the
 * others use the default card surface, and icons vary in stroke / fill so
 * the grid never reads as four identical white cards.
 */
export function AboutValues(): React.JSX.Element {
  const [lead, ...rest] = values;

  return (
    <section
      aria-labelledby="about-values-heading"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto flex max-w-2xl flex-col gap-3 text-center sm:items-center">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          What we believe
        </span>
        <h2
          id="about-values-heading"
          className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Four principles, one product.
        </h2>
        <p className="text-pretty text-[15px] text-muted-foreground">
          We make a small number of bets. Then we ship them before adding more.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-2 lg:gap-6">
        {/*
          Lead tile: spans full width on lg, full first row on smaller screens.
          Tinted background breaks the all-white-bento tell.
        */}
        <Card
          className={cn(
            "relative overflow-hidden border-border/70 bg-foreground text-background",
            "lg:col-span-2",
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_0%_0%,color-mix(in_oklch,var(--primary-foreground)_18%,transparent),transparent_70%)]"
          />
          <CardHeader className="relative gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-background/10 text-background ring-1 ring-background/15">
              <lead.Icon className="size-6" aria-hidden />
            </div>
            <div className="flex flex-col gap-2">
              <CardTitle className="text-base font-semibold text-background">
                {lead.title}
              </CardTitle>
              <CardDescription className="max-w-2xl text-[15px] leading-relaxed text-background/75">
                {lead.body}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="relative" />
        </Card>

        {/* Remaining tiles: 2-col grid on lg, stacked on mobile. */}
        {rest.map(({ Icon, title, body }) => (
          <Card key={title} className="border-border/70 bg-card">
            <CardHeader className="gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-foreground">
                <Icon className="size-5" aria-hidden />
              </div>
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              <CardDescription className="text-[14.5px] leading-relaxed">
                {body}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default AboutValues;
