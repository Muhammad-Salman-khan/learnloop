import * as React from "react";

import { cn } from "@/lib/utils";
import { SparklesIcon, ShieldCheckIcon } from "lucide-react";

type AuthShellProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /**
   * Side-panel copy shown on `md+` viewports. Each auth route passes its own
   * value (e.g. sign-in or sign-up marketing pitch + social proof).
   */
  panel: React.ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  panel,
}: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen w-full items-stretch justify-center overflow-hidden bg-background">
      {/* ============= Brand / marketing panel (md+) ============= */}
      <aside
        aria-hidden
        className={cn(
          "relative hidden overflow-hidden md:flex md:w-1/2 lg:w-[55%] xl:w-[58%]",
          "border-r border-border",
          "bg-[radial-gradient(120%_80%_at_0%_0%,color-mix(in_oklch,var(--primary)_8%,transparent),transparent_55%),radial-gradient(80%_60%_at_100%_100%,color-mix(in_oklch,var(--muted-foreground)_12%,transparent),transparent_60%)]",
        )}
      >
        {/* Subtle architectural grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            color: "var(--foreground)",
            maskImage:
              "radial-gradient(ellipse 70% 55% at 50% 40%, black 55%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 55% at 50% 40%, black 55%, transparent 100%)",
          }}
        />

        {/* Top brand row */}
        <div className="relative z-10 flex w-full flex-col justify-between p-8 sm:p-10 lg:p-14">
          <header className="flex items-center gap-2.5 text-foreground">
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-xl",
                "bg-foreground text-background ring-1 ring-foreground/10",
                "shadow-sm",
              )}
            >
              <SparklesIcon className="size-4.5" aria-hidden />
            </div>
            <div className="leading-none">
              <p className="text-[15px] font-semibold tracking-tight">
                LearnHub
              </p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                AI-powered learning
              </p>
            </div>
          </header>

          {/* Prop-driven marketing content */}
          <div className="relative z-10 mx-auto w-full max-w-md">{panel}</div>

          {/* Compliance eyebrow */}
          <footer className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheckIcon aria-hidden className="size-3.5" />
            <span>SOC 2 Type II · GDPR-ready · 256-bit encryption</span>
          </footer>
        </div>
      </aside>

      {/* ============= Form panel (mobile & desktop) ============= */}
      <main className="relative flex w-full flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-12 md:py-16 md:w-1/2 lg:w-[45%] xl:w-[42%]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,color-mix(in_oklch,var(--primary)_8%,transparent),transparent_60%)] md:hidden" />
        <div className="grid w-full max-w-md gap-8">
          {/* Mobile-only brand (hidden on md+ where the aside shows it) */}
          <div className="flex items-center justify-center gap-2 md:hidden">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-xl",
                "bg-foreground text-background shadow-sm",
                "ring-1 ring-foreground/10",
              )}
            >
              <SparklesIcon className="size-5" aria-hidden />
            </div>
            <p className="text-base font-semibold tracking-tight">LearnHub</p>
          </div>

          <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            {eyebrow ?
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {eyebrow}
              </span>
            : null}
            <h1 className="text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {title}
            </h1>
            {subtitle ?
              <p className="max-w-sm text-pretty text-sm text-muted-foreground sm:text-[15px]">
                {subtitle}
              </p>
            : null}
          </div>

          <div className="flex flex-col gap-6">{children}</div>

          {footer ?
            <div className="text-center text-sm text-muted-foreground sm:text-left">
              {footer}
            </div>
          : null}
        </div>
      </main>
    </div>
  );
}
