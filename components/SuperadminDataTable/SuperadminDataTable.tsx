"use client";

// Generic filterable table used across the superadmin console.
// Mirrors SuperadminUsersTable's visual grammar but generic over columns.
// Pages own the data shape; this Client Component owns the search/filter UI.

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export type DataColumn<T> = {
  readonly id: string;
  readonly header: string;
  readonly cell: (row: T) => ReactNode;
  readonly hidden?: "sm" | "md" | "lg";
  readonly align?: "left" | "right" | "center";
  readonly searchable?: boolean;
  readonly className?: string;
};

type Props<T> = {
  readonly rows: ReadonlyArray<T>;
  readonly columns: ReadonlyArray<DataColumn<T>>;
  readonly searchPlaceholder?: string;
  readonly emptyMessage?: string;
  readonly rowKey: (row: T) => string;
  readonly rowHref?: (row: T) => string;
  readonly filters?: ReactNode;
  readonly toolbarRight?: ReactNode;
  readonly caption?: string;
};

function classForVisibility(hidden: DataColumn<unknown>["hidden"]): string {
  if (hidden === "sm") return "hidden sm:table-cell";
  if (hidden === "md") return "hidden md:table-cell";
  if (hidden === "lg") return "hidden lg:table-cell";
  return "";
}

function classForAlign(align: DataColumn<unknown>["align"]): string {
  if (align === "right") return "text-right";
  if (align === "center") return "text-center";
  return "text-left";
}

function defaultSearchMatch(value: ReactNode): string {
  if (value === null || value === undefined || typeof value === "boolean")
    return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  return "";
}

export function SuperadminDataTable<T>({
  rows,
  columns,
  searchPlaceholder = "Search…",
  emptyMessage = "No rows match these filters.",
  rowKey,
  rowHref,
  filters,
  toolbarRight,
  caption,
}: Props<T>) {
  const [q, setQ] = useState("");

  const searchableCols = useMemo(
    () => columns.filter((c) => c.searchable !== false),
    [columns],
  );

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) =>
      searchableCols.some((c) =>
        defaultSearchMatch(c.cell(row)).toLowerCase().includes(query),
      ),
    );
  }, [rows, q, searchableCols]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:w-80">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 pl-8 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {filters}
          {toolbarRight}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/30 text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.id}
                  className={`px-4 py-2.5 font-medium ${classForAlign(
                    c.align,
                  )} ${classForVisibility(c.hidden)}`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-xs text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              filtered.map((row) => {
                const href = rowHref?.(row);
                return (
                  <tr
                    key={rowKey(row)}
                    className={href ? "hover:bg-muted/30" : undefined}
                  >
                    {columns.map((c) => {
                      const node = c.cell(row);
                      return (
                        <td
                          key={c.id}
                          className={`px-4 py-3 align-middle ${classForAlign(
                            c.align,
                          )} ${classForVisibility(c.hidden)} ${c.className ?? ""}`}
                        >
                          {href && c === columns[0] ? (
                            <Link
                              href={href}
                              className="block hover:underline"
                            >
                              {node}
                            </Link>
                          ) : (
                            node
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>
          {filtered.length} of {rows.length} · {caption ?? ""}
        </span>
      </div>
    </div>
  );
}

export default SuperadminDataTable;
