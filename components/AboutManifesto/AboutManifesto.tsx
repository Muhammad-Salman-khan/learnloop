import * as React from "react";

import {
  BookOpenCheckIcon,
  CompassIcon,
  GaugeCircleIcon,
  SparkleIcon,
} from "lucide-react";

type Principle = {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
};

// Numbered list — reads like a small manifesto. Single column. No bento.
// Order is positive; numerals appear inline so the section scans as a
// table of contents rather than a card grid.
const principles: ReadonlyArray<Principle> = [
  {
    Icon: BookOpenCheckIcon,
    title: "Lesson plans ship, not stall.",
    body: "AI outlines, rubrics, and adaptive quizzes tied to a real curriculum graph. A draft on Monday becomes a graded lesson by Friday. The product does not celebrate producing outlines; it celebrates graded lessons.",
  },
  {
    Icon: CompassIcon,
    title: "One calm workspace.",
    body: "Lesson planning, cohort inbox, grading, and scheduling live in the same typed interface. No more twelve-tab Mondays. No third-party notification avalanche. No unnamed-flag emoji rituals.",
  },
  {
    Icon: GaugeCircleIcon,
    title: "Outcomes over vanity.",
    body: "We measure completion, mastery, and cohort-to-cohort improvement. We do not measure pageviews, time-on-page, or other theater metrics dressed up as engagement. The dashboard looks quieter for a reason.",
  },
  {
    Icon: SparkleIcon,
    title: "Calm by default.",
    body: "Soft borders, generous spacing, no marketing popups in your own dashboard. The product should feel like the work, not a billboard for it. New features ship when they make the existing work lighter.",
  },
];

export function AboutManifesto(): React.JSX.Element {
  return (
    <section
      aria-labelledby="about-manifesto-heading"
      className="mx-auto w-full max-w-3xl px-4 py-24 sm:px-6 lg:px-8 lg:py-40"
    >
      <div className="flex flex-col gap-4 text-center sm:items-center">
        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Principles
        </span>
        <h2
          id="about-manifesto-heading"
          className="font-display text-balance text-3xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-4xl"
        >
          Four bets, written down.
        </h2>
        <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground">
          We make a small number of bets, restated here so they are easy to
          argue with.
        </p>
      </div>

      <ol className="mt-16 grid gap-12 lg:mt-20 lg:gap-16">
        {principles.map(({ Icon, title, body }, i) => {
          const ordinal = String(i + 1).padStart(2, "0");
          return (
            <li
              key={title}
              className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 sm:gap-x-10"
            >
              <div className="flex flex-col items-center gap-4 border-r border-foreground/15 pr-4 pt-1 sm:pr-10">
                <span className="font-mono text-[12px] font-medium uppercase tracking-wider text-muted-foreground tabular-nums">
                  {ordinal}
                </span>
                <Icon className="size-5 text-foreground/70" aria-hidden />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-balance text-2xl font-medium leading-tight tracking-tight text-foreground sm:text-[1.75rem]">
                  {title}
                </h3>
                <p className="text-pretty text-[15.5px] leading-relaxed text-foreground/85">
                  {body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default AboutManifesto;
