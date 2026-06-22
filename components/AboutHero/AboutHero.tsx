import * as React from "react";

import { SparklesIcon } from "lucide-react";

/**
 * Server-rendered full-bleed editorial hero for `/about`.
 *
 * Layout family: centered single-column manifesto hero.
 * Lives inside the page's outer chrome (header / footer) — this is just the
 * hero block. Composed without interactivity so it stays a Server Component.
 *
 * Design read:
 * - Headline is the thesis. Two lines max, font-sans (Geist), no italic word
 *   choices that drop descenders below the baseline.
 * - No eyebrow inside the hero — the page-nav already labels where you are.
 * - No CTA in the hero. About pages earn their CTAs at the bottom, after the
 *   reader has seen the values and the proof. Skipping the CTA keeps the hero
 *   stack to 2 text elements (eyebrow + headline + subtext rule satisfied).
 * - Brand mark stays consistent with `app/page.tsx` (the 7x7 rounded square
 *   with the sparkles glyph on a foreground fill).
 */
export function AboutHero(): React.JSX.Element {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_50%_0%,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_70%)]"
      />
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-24 lg:py-32">
        <span
          aria-hidden
          className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background shadow-sm ring-1 ring-foreground/10"
        >
          <SparklesIcon className="size-4" />
        </span>
        <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
          Built for educators who ship learning, not slide decks.
        </h1>
        <p className="max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          LearnHub is an AI-native learning management system for instructors,
          cohort leads, and learning teams who want clean tools and honest
          outcomes instead of another content dump.
        </p>
      </div>
    </section>
  );
}

export default AboutHero;
