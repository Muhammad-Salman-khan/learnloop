"use client";

// Shared superadmin page primitives.
// All /dashboard/superadmin/* pages speak the same visual grammar: a 10.5-px
// tracked-uppercase eyebrow, a `font-display` heading, optional description,
// then an action cluster pinned to the right on md+. These wrappers exist so
// the visual rhythm is identical across the 80+ pages of this console, and
// HTML stays minimal and inspectable.

import type { ReactNode } from "react";
import Link from "next/link";

export type BreadcrumbStep = {
  readonly label: string;
  readonly href?: string;
};

type CrumbProps = {
  readonly steps: ReadonlyArray<BreadcrumbStep>;
};

export function SuperadminBreadcrumb({ steps }: CrumbProps) {
  if (steps.length === 0) return null;
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground"
    >
      {steps.map((s, i) => {
        const isLast = i === steps.length - 1;
        return (
          <span key={`${s.label}-${i}`} className="flex items-center gap-1.5">
            {s.href && !isLast ? (
              <Link href={s.href} className="hover:underline">
                {s.label}
              </Link>
            ) : (
              <span aria-current={isLast ? "page" : undefined}>
                {s.label}
              </span>
            )}
            {!isLast ? <span aria-hidden>/</span> : null}
          </span>
        );
      })}
    </nav>
  );
}

type HeaderProps = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description?: string;
  readonly breadcrumbs?: ReadonlyArray<BreadcrumbStep>;
  readonly actions?: ReactNode;
};

export function SuperadminPageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
}: HeaderProps) {
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-2">
        {breadcrumbs ? <SuperadminBreadcrumb steps={breadcrumbs} /> : null}
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {eyebrow}
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-[65ch] text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}

type StatProps = {
  readonly label: string;
  readonly value: string | number;
  readonly hint?: string;
};

export function SuperadminStat({ label, value, hint }: StatProps) {
  return (
    <div className="flex flex-col gap-1 rounded-md border bg-card px-4 py-3">
      <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span className="font-display text-2xl font-medium tracking-tight md:text-3xl">
        {value}
      </span>
      {hint ? (
        <span className="text-[11px] text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  );
}

type StatStripProps = {
  readonly stats: ReadonlyArray<StatProps>;
};

export function SuperadminStatStrip({ stats }: StatStripProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((s) => (
        <SuperadminStat key={s.label} {...s} />
      ))}
    </div>
  );
}

type Props = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description?: string;
  readonly breadcrumbs?: ReadonlyArray<BreadcrumbStep>;
  readonly actions?: ReactNode;
  readonly children: ReactNode;
};

export function SuperadminPage({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  children,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <SuperadminPageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        actions={actions}
      />
      {children}
    </div>
  );
}
