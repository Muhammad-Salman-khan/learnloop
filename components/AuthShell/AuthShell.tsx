import * as React from "react";

import { cn } from "@/lib/utils";
import { SparklesIcon } from "lucide-react";

type AuthShellProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-6 sm:py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,color-mix(in_oklch,var(--primary)_15%,transparent),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklch,var(--background)_85%,var(--foreground)_5%))]"
      />
      <div className="grid w-full max-w-md gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-2xl",
              "bg-primary text-primary-foreground shadow-sm",
              "ring-1 ring-foreground/10",
            )}
          >
            <SparklesIcon
              data-icon="inline"
              className="size-6"
              aria-hidden
            />
          </div>
          {eyebrow ? (
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-sm text-pretty text-sm text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-6">{children}</div>

        {footer ? (
          <div className="text-center text-sm text-muted-foreground">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
