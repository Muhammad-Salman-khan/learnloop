"use client";

import * as React from "react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

/**
 * Corporate-scale editorial hero for `/about`.
 *
 * Influence: the cover of an annual report for a serious software firm —
 * massive serif headline that owns the viewport, a single full-bleed
 * photograph that supports the headline, and a small mono uppercase
 * marker in the corner. Hierarchy asserts itself; the product does not
 * chase clicks.
 *
 * Layout (one family, no repeat on this page):
 *  - Full-bleed background photograph on `lg+`, 4:5 column on small
 *    screens so the headline always reads first.
 *  - Headline set in Source Serif 4 via `.font-display`. Tight leading,
 *    tight tracking, dense weight stack so the type looks like a logo,
 *    not a sentence.
 *  - Subtext: one sentence, max ~18 words.
 *  - NO buttons in this hero (per duplicate-CTA-intent rule — the page
 *    earns its CTA at the closing section).
 *  - Small corner marker: mono, uppercase, 1px-wide rule. The single
 *    decoration on the hero.
 *
 * Motion (one, motivated):
 *  - Headline words clip-path sweep on mount. The cover earns one
 *    moment. No parallax, no marquee, no scroll listener.
 *
 * Image placeholder: Picsum seed, dark/moody. Swap with a real
 * photograph before launch — no figcaption rendered on the page.
 */

const HEADLINE_WORDS = [
  "Educators",
  "who",
  "ship",
  "learning,",
  "not",
  "slide",
  "decks.",
] as const;

// Clamp viewport at this width for the photo column so a 27" display
// doesn't get a 1500px-wide image next to a 1500px-wide headline (the
// type would drown).
const PHOTO_MAX_WIDTH = 720;

export function AboutHero(): React.JSX.Element {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const ctx = gsap.context(() => {
        gsap.from(markerRef.current, {
          opacity: 0,
          y: 6,
          duration: 0.6,
          ease: "power2.out",
        });

        gsap.from(".about-hero__word", {
          clipPath: "inset(0 100% 0 0)",
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.08,
        });

        gsap.from(subtitleRef.current, {
          opacity: 0,
          y: 14,
          duration: 0.9,
          ease: "power2.out",
          delay: 0.55,
        });

        gsap.from(plateRef.current, {
          opacity: 0,
          scale: 1.04,
          duration: 1.4,
          ease: "power2.out",
          delay: 0.1,
        });
      });

      return () => ctx.revert();
    },
    { scope: headlineRef, dependencies: [] },
  );

  return (
    <section className="relative isolate overflow-hidden border-b border-border/60 bg-background">
      {/*
        Cover plate. Sits in a fixed-aspect column on `lg+`. The
        absolute-positioned `<img>` keeps the headline off the
        critical paint path while the photo streams in.
      */}
      <div
        ref={plateRef}
        aria-hidden
        className="relative order-1 aspect-[4/5] w-full overflow-hidden bg-muted lg:absolute lg:inset-y-0 lg:right-0 lg:order-2 lg:aspect-auto lg:h-full lg:w-[55vw] xl:w-[50vw]"
        style={{ maxWidth: `${PHOTO_MAX_WIDTH * 1.6}px` }}
      >
        {/* Sits just inside the frame so the column gets a subtle vignette. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(120%_60%_at_50%_100%,rgba(0,0,0,0.45),transparent_60%)] dark:bg-[radial-gradient(120%_60%_at_50%_100%,rgba(0,0,0,0.55),rgba(0,0,0,0.15)_70%)]"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/learnhub-corporate-cover/1600/2000"
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={1600}
          height={2000}
          className="absolute inset-0 size-full object-cover"
        />
        {/* Soft dark scrim only on lg+ so the photo stays legible behind the
            bottom-left marker; mobile keeps the photo crisp. */}
        <div
          aria-hidden
          className="absolute inset-0 z-10 hidden bg-gradient-to-r from-background via-background/60 to-transparent lg:block"
        />
      </div>

      {/* Copy column — full width on mobile, two-thirds on `lg+`. */}
      <div className="relative z-20 mx-auto flex w-full max-w-[1400px] flex-col gap-10 px-4 pb-16 pt-20 sm:px-6 sm:pt-24 lg:min-h-[88vh] lg:max-w-none lg:gap-12 lg:px-10 lg:py-28 lg:pr-[58vw] xl:pr-[52vw]">
        {/* Corner marker — the only decoration on the hero. */}
        <div
          ref={markerRef}
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
        >
          <span
            aria-hidden
            className="block h-px w-10 bg-foreground/40"
          />
          About · Edition 01
        </div>

        <h1
          ref={headlineRef}
          className="font-display text-balance text-[3.25rem] font-medium leading-[0.95] tracking-[-0.025em] text-foreground sm:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.75rem]"
        >
          {HEADLINE_WORDS.map((word, i) => (
            <span
              key={`${word}-${i}`}
              className="about-hero__word mr-[0.18em] inline-block"
              style={{ clipPath: "inset(0 100% 0 0)" }}
            >
              {word}
            </span>
          ))}
        </h1>

        <p
          ref={subtitleRef}
          className="mt-2 max-w-[44ch] text-pretty text-[16px] leading-relaxed text-muted-foreground sm:text-[17px] lg:text-[18px]"
        >
          LearnHub is an AI-native LMS for instructors, cohort leads, and
          learning teams who want clean tools and honest outcomes instead
          of another content dump.
        </p>

        {/* Tiny meta line. Honors the duplicate-CTA-intent rule: no buttons
            in the hero. The page earn its CTA at the closing section. No
            middle dots on this line either — rule budget stays clean. */}
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80">
          14-day trial&nbsp;&nbsp;No card&nbsp;&nbsp;SOC 2 Type II&nbsp;&nbsp;GDPR-ready
        </p>
      </div>
    </section>
  );
}

export default AboutHero;
