import * as React from "react";

import { cn } from "@/lib/utils";
import {
  BookOpenIcon,
  ChartLineIcon,
  CheckCircle2Icon,
  GraduationCapIcon,
  PlayCircleIcon,
  UsersIcon,
} from "lucide-react";

type AuthPanelProps = {
  /**
   * Hero headline for the brand panel.
   */
  headline: string;
  /**
   * Lead paragraph under the headline.
   */
  description: string;
  /**
   * 2–3 short bullets shown with a check icon. Keep them specific and
   * evidence-shaped (avoid vague marketing fluff).
   */
  bullets: string[];
  /**
   * Optional social-proof card. If omitted, a default one is rendered.
   */
  socialProof?: React.ReactNode;
  /**
   * Override the headline eyebrow, defaults to "Why teams choose LearnHub"
   */
  eyebrow?: string;
};

/**
 * Side-panel content for the auth screens, rendered on `md+` viewports.
 * Pure presentational — no data fetching. Lives in its own UI folder per
 * LearnHub conventions.
 */
export function AuthPanel({
  eyebrow = "Why teams choose LearnHub",
  headline,
  description,
  bullets,
  socialProof,
}: AuthPanelProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </span>
        <h2 className="text-balance text-3xl font-semibold leading-[1.1] tracking-tight text-foreground lg:text-[2.5rem]">
          {headline}
        </h2>
        <p className="max-w-md text-pretty text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <ul className="flex flex-col gap-3 text-sm text-foreground">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3">
            <CheckCircle2Icon
              className="mt-0.5 size-4 shrink-0 text-foreground/70"
              aria-hidden
            />
            <span className="text-[14px] leading-relaxed text-pretty">
              {bullet}
            </span>
          </li>
        ))}
      </ul>

      {socialProof ?? <DefaultSocialProof />}
    </div>
  );
}

function DefaultSocialProof() {
  const stats = [
    { label: "Active learners", value: "48,200+", Icon: UsersIcon },
    { label: "Courses published", value: "1,840", Icon: BookOpenIcon },
    { label: "Avg. completion lift", value: "+37%", Icon: ChartLineIcon },
  ];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/80",
        "bg-card/60 p-5 shadow-sm backdrop-blur-[2px]",
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        Trusted by modern learning teams
      </p>
      <dl className="mt-4 grid grid-cols-3 gap-4">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="flex flex-col gap-1">
            <Icon
              className="size-4 text-muted-foreground"
              aria-hidden
            />
            <dt className="text-base font-semibold tracking-tight text-foreground">
              {value}
            </dt>
            <dd className="text-[11px] leading-tight text-muted-foreground">
              {label}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex items-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <div className="flex -space-x-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              aria-hidden
              className="size-6 rounded-full border-2 border-card bg-gradient-to-br from-foreground/15 to-foreground/30"
            />
          ))}
        </div>
        <p>
          Rated{" "}
          <span className="font-medium text-foreground">4.9 / 5</span> by 6,400+
          instructors.
        </p>
      </div>
    </div>
  );
}

type FeatureChipProps = { Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>; label: string };
function FeatureChip({ Icon, label }: FeatureChipProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-[11px] font-medium text-foreground/80">
      <Icon className="size-3" aria-hidden />
      {label}
    </span>
  );
}

/**
 * A row of feature chips, used by signup page to differentiate the new-user
 * pitch from the sign-in pitch.
 */
export function AuthFeatureChips() {
  return (
    <div className="flex flex-wrap gap-2">
      <FeatureChip Icon={PlayCircleIcon} label="AI lesson studio" />
      <FeatureChip Icon={GraduationCapIcon} label="Adaptive quizzes" />
      <FeatureChip Icon={ChartLineIcon} label="Live cohorts" />
    </div>
  );
}
