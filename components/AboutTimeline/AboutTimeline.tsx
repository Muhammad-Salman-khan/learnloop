"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Entry = {
  year: string;
  headline: string;
  body: string;
};

// Ordered chronologically. Reads left-to-right on desktop, top-to-bottom
// on mobile (where the CSS Grid flips to one column).
const entries: ReadonlyArray<Entry> = [
  {
    year: "2024",
    headline: "Three instructors, one shared spreadsheet.",
    body: "LearnHub starts as a single Notion page between three educators teaching parallel cohorts of the same program. Lesson planning, rubrics, scheduling, and grading live in four tabs and one landline group chat.",
  },
  {
    year: "Late 2024",
    headline: "The first hand-rolled prototype.",
    body: "Forty pilot instructors trade their spreadsheets for an unfinished workspace. The interface is rough. The grading rubric editor is half a database column and a prayer. They still switch, and they tell us why they stay.",
  },
  {
    year: "2025",
    headline: "The curriculum graph graduates.",
    body: "Rubrics, lesson dependencies, and adaptive quizzes graduate from the prototype into the first public workspace. The first paid cohorts ship their certificates through a system that knows which lesson they struggled on.",
  },
  {
    year: "Early 2026",
    headline: "AI tutors, in context.",
    body: "The AI tutor stops behaving like a chatbot wrapped in a sidebar. It reads the actual lesson, refuses to give answers on graded items, and learns to stay out of the way when a human office-hours thread is already running.",
  },
  {
    year: "Today",
    headline: "Forty-eight thousand educators. Ninety countries.",
    body: "LearnHub is small on purpose. The product gets quieter each quarter. Faster grading. Calmer inboxes. Smarter rubrics that explain themselves. We retire more than we ship.",
  },
];

// One GSAP-driven year reel. Pin the wrapper, scrub the inner track.
// On mobile (where the CSS Grid flips to one column) setup is skipped so
// users get a calm vertical scroll and no horizontal overflow. Reduced-
// motion users get the same — never pin, never scrub.
export function AboutTimeline(): React.JSX.Element {
  const mobileStackRef = useRef<HTMLDivElement>(null);
  const reelWrapRef = useRef<HTMLDivElement>(null);
  const reelTrackRef = useRef<HTMLDivElement>(null);

  // Note: mobileStackRef is intentionally unused — kept as a placeholder for
  // future in-view stagger animation if you want one. React allows it.
  void mobileStackRef;

  // Resize + font-load listener. Lives outside gsap.context so its cleanup
  // is owned by React's effect cycle, not by the gsap context revert.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const measure = () => ScrollTrigger.refresh();
    window.addEventListener("resize", measure, { passive: true });
    if (document.fonts && "ready" in document.fonts) {
      document.fonts.ready.then(measure).catch(() => {});
    }
    return () => window.removeEventListener("resize", measure);
  }, []);

  useGSAP(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!reelWrapRef.current || !reelTrackRef.current) return;

    gsap.context(() => {
      const track = reelTrackRef.current!;
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: reelWrapRef.current!,
          start: "top top",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, reelWrapRef);
  }, { scope: reelWrapRef });

  return (
    <section
      aria-labelledby="about-timeline-heading"
      className="relative overflow-hidden border-y border-border/60 bg-background"
    >
      {/* Intro — shared across both layouts. */}
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4 pt-16 text-center sm:px-6 md:pt-24 lg:px-8">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          A short history
        </span>
        <h2
          id="about-timeline-heading"
          className="font-display text-balance text-3xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]"
        >
          Five notes from the workshop.
        </h2>
        <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground">
          Scroll sideways to walk through the years. On mobile this section
          stacks into the same notes, top to bottom.
        </p>
      </div>

      {/* Mobile vertical stack. Hidden on md+ where the horizontal reel takes over. */}
      <ol className="mx-auto grid w-full max-w-2xl gap-10 px-4 pb-20 pt-12 sm:px-6 md:hidden">
        {entries.map((e) => (
          <li
            key={e.year}
            className="grid gap-3 border-l border-foreground/15 pl-6"
          >
            <p className="font-mono text-[12px] font-medium uppercase tracking-wider text-muted-foreground tabular-nums">
              {e.year}
            </p>
            <h3 className="font-display text-balance text-xl font-medium leading-snug tracking-tight text-foreground">
              {e.headline}
            </h3>
            <p className="text-pretty text-[15px] leading-relaxed text-foreground/85">
              {e.body}
            </p>
          </li>
        ))}
      </ol>

      {/* md+: horizontal reel. wrapRef is the pinned area; trackRef slides horizontally as the user scrolls vertically. */}
      <div ref={reelWrapRef} className="hidden md:block">
        <div
          ref={reelTrackRef}
          className="flex w-max items-stretch gap-10 px-4 pb-20 pt-12 sm:gap-14 sm:px-6 lg:gap-20 lg:px-8"
        >
          {entries.map((e) => (
            <article
              key={e.year}
              className="grid h-[60vh] w-[70vw] min-w-[70vw] grid-rows-[auto_1fr] gap-4 border-l border-foreground/15 pl-6 pr-2 sm:w-[55vw] sm:min-w-[55vw] lg:w-[40vw] lg:min-w-[40vw]"
            >
              <p className="font-mono text-[12px] font-medium uppercase tracking-wider text-muted-foreground tabular-nums">
                {e.year}
              </p>
              <div className="grid gap-4">
                <h3 className="font-display text-balance text-2xl font-medium leading-[1.15] tracking-tight text-foreground sm:text-[1.75rem]">
                  {e.headline}
                </h3>
                <p className="text-pretty max-w-prose text-[15px] leading-relaxed text-foreground/85">
                  {e.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AboutTimeline;
