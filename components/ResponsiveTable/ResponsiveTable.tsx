import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DesktopTableProps = {
  readonly children: ReactNode;
};

type ResponsiveTableProps = {
  // Used to give the shadcn `<Table>` an aria-label when no header text
  // is captured at the cell.
  readonly caption?: string;
  readonly header: ReactNode;
  readonly body: ReactNode;
  readonly footer?: ReactNode;
  // Optional explicit colgroup widths (Tailwind classes) to keep
  // columns readable when the table needs to horizontally scroll.
  readonly minWidthClass?: string;
};

function DesktopTable({ children }: DesktopTableProps) {
  return (
    <div className="hidden w-full overflow-x-auto md:block">
      <div className="min-w-full overflow-hidden rounded-md border bg-card">
        <Table className="w-full text-sm">{children}</Table>
      </div>
    </div>
  );
}

// Wraps a shadcn `<Table>` so it works on every breakpoint:
//
// - On `md+`, the table renders inside the standard horizontally-scrollable
//   container.
// - On `<md`, the parent renders stacked cards instead (the caller owns
//   that mobile-template). This component only owns the table layout.
//
// The wrapper is a Server Component — no event handlers, no state — so it
// can be composed server-side and dropped into any page.
export function ResponsiveTable({
  caption,
  header,
  body,
  footer,
}: ResponsiveTableProps) {
  return (
    <>
      <DesktopTable>
        {caption ? (
          <caption className="sr-only">{caption}</caption>
        ) : null}
        <TableHeader>{header}</TableHeader>
        <TableBody>{body}</TableBody>
      </DesktopTable>

      {/* Footer (e.g. pagination) sits below the table on desktop
          but should always be visible on mobile too. Render it once. */}
      {footer ? <div className="mt-2">{footer}</div> : null}
    </>
  );
}

// Helper to render the desktop-only empty-state inside a `<TableBody>` row.
export function EmptyTableRow({
  colSpan,
  children,
}: {
  readonly colSpan: number;
  readonly children: ReactNode;
}) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="px-5 py-10 text-center text-xs text-muted-foreground"
      >
        {children}
      </TableCell>
    </TableRow>
  );
}

export default ResponsiveTable;
