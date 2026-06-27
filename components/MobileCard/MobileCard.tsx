import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

// Generic mobile-card row used by every responsive table list. Lives
// below a hidden `md:hidden` block — on md and up the regular shadcn
// Table renders instead.
//
// Props track the same content shape the table-rendered row would have:
//   { label, value } pairs are stacked on small screens; an optional
//   `actions` slot lives at the bottom (or right) of the card.

export type MobileCardField = {
  readonly label: string;
  readonly value: ReactNode;
};

type MobileCardProps = {
  readonly fields: ReadonlyArray<MobileCardField>;
  readonly actions?: ReactNode;
  readonly emphasis?: ReactNode;
  readonly footer?: ReactNode;
};

export function MobileCard({
  fields,
  actions,
  emphasis,
  footer,
}: MobileCardProps) {
  return (
    <Card className="gap-1 py-3">
      <CardContent className="flex flex-col gap-2 px-4 py-1">
        {emphasis ? <div className="flex flex-wrap items-center gap-2">{emphasis}</div> : null}
        <dl className="grid grid-cols-1 gap-1.5">
          {fields.map((field, i) => (
            <div
              key={`${field.label}-${i}`}
              className="flex items-baseline justify-between gap-3"
            >
              <dt className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                {field.label}
              </dt>
              <dd className="line-clamp-1 text-right text-sm">{field.value}</dd>
            </div>
          ))}
        </dl>
        {footer ? <div className="text-[11px] text-muted-foreground">{footer}</div> : null}
        {actions ? (
          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            {actions}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

// Renders the desktop-hidden `<ul>` of cards inside a containing `<div>`.
// Container-only — split out so callers don't duplicate the `md:hidden`
// class every time.
export function MobileCardList({ children }: { readonly children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:hidden">{children}</div>
  );
}

export default MobileCard;
