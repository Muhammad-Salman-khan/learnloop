import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

type PlaceholderItem = {
  readonly title: string;
  readonly detail: string;
};

type PagePlaceholderProps = {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly items: ReadonlyArray<PlaceholderItem>;
  // Where the "Back to overview" link points. Each dashboard section has its
  // own root, so the page supplies it. Defaults to /dashboard/student to keep
  // every existing call site working.
  readonly backHref?: string;
  readonly backLabel?: string;
};

// Editorial skeleton for future client pages. The page exists, the URL
// resolves, the sidebar link works, and the layout inherits the dashboard
// chrome. No fake data, no made-up controls, no pretend buttons.
export function PagePlaceholder({
  eyebrow,
  title,
  description,
  items,
  backHref,
  backLabel,
}: PagePlaceholderProps) {
  const overviewHref = backHref ?? "/dashboard/student";
  const overviewLabel = backLabel ?? "Back to overview";
  // Section key derived from the back-href so the footer sentence names the
  // right overview URL without each page having to pass another prop.
  const sectionName = overviewHref.split("/").filter(Boolean).pop() ?? "student";

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 md:px-8 md:py-20">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mb-8 -ml-2 gap-2 text-muted-foreground hover:text-foreground"
      >
        <Link href={overviewHref}>
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          {overviewLabel}
        </Link>
      </Button>

      <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </span>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-tight md:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-[60ch] text-balance text-base text-muted-foreground md:text-lg">
        {description}
      </p>

      <div className="mt-10 rounded-lg border bg-card p-6">
        <p className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          What lives here
        </p>
        <ol className="mt-4 divide-y">
          {items.map((item, index) => (
            <li
              key={item.title}
              className="grid grid-cols-[3.25rem,1fr] gap-4 py-0 first:pt-0"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="space-y-1 border-b py-3 last:border-b-0">
                <p className="text-sm font-medium leading-tight">
                  {item.title}
                </p>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-8 max-w-[60ch] text-xs leading-relaxed text-muted-foreground">
        This page is part of the Smart Hub layout. The overview at{" "}
        <Link
          href={overviewHref}
          className="font-medium text-foreground/80 underline-offset-4 hover:underline"
        >
          {overviewHref}
        </Link>{" "}
        holds the live demo with sample charts, courses, and schedule data for
        the {sectionName} workspace.
      </p>
    </div>
  );
}

export type { PlaceholderItem };
export default PagePlaceholder;
