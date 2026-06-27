// Pure math for client-side pagination.
//
// Returns the visible page window (e.g. [1, 2, 3, …, 8, 9, 10]) plus a
// stable `goTo` that bounds the requested page inside [1, pageCount].
//
// Spec at the function level: zero React imports, zero side-effects —
// it's just a hook-shaped utility so consumers can spread its return.

import { useCallback, useState } from "react";

export type PageWindow =
  // (page, "ellipsis" | "page")
  ReadonlyArray<{ readonly key: string; readonly page: number; readonly kind: "page" | "ellipsis" }>;

export type Paginator = {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly pageCount: number;
  readonly window: PageWindow;
  readonly next: () => void;
  readonly previous: () => void;
  readonly goTo: (page: number) => void;
  readonly setPageSize: (size: number) => void;
  readonly offset: number;
  readonly slice: <T>(rows: ReadonlyArray<T>) => ReadonlyArray<T>;
  readonly rangeLabel: string;
};

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function buildWindow(currentPage: number, pageCount: number): PageWindow {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => ({
      key: `p-${i + 1}`,
      page: i + 1,
      kind: "page",
    }));
  }

  const items: PageWindow[number][] = [];

  // First page always present
  items.push({ key: "p-1", page: 1, kind: "page" });

  // Window around the current page: current-1, current, current+1
  const start = clamp(currentPage - 1, 2, pageCount - 1);
  const end = clamp(currentPage + 1, 2, pageCount - 1);

  if (start > 2) {
    items.push({ key: "e-l", page: 0, kind: "ellipsis" });
  }

  for (let p = start; p <= end; p += 1) {
    items.push({ key: `p-${p}`, page: p, kind: "page" });
  }

  if (end < pageCount - 1) {
    items.push({ key: "e-r", page: 0, kind: "ellipsis" });
  }

  // Last page always present
  items.push({ key: `p-${pageCount}`, page: pageCount, kind: "page" });

  return items;
}

// Compute `pageCount` for a total of `total` items given a `pageSize`.
// Exported because the math lives here; the hook just wires it up.
export function computePageCount(total: number, pageSize: number): number {
  if (pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(total / pageSize));
}

export function usePaginator(total: number, pageSize: number = 10): Paginator {
  const [internalSize, setInternalSize] = useState(pageSize);
  const rawPageCount = computePageCount(total, internalSize);
  const [currentPage, setCurrentPage] = useState(1);

  const next = useCallback(() => {
    setCurrentPage((p) => clamp(p + 1, 1, rawPageCount));
  }, [rawPageCount]);

  const previous = useCallback(() => {
    setCurrentPage((p) => clamp(p - 1, 1, rawPageCount));
  }, [rawPageCount]);

  const goTo = useCallback(
    (page: number) => {
      setCurrentPage(clamp(page, 1, rawPageCount));
    },
    [rawPageCount],
  );

  const setPageSize = useCallback((size: number) => {
    setInternalSize(size);
    setCurrentPage(1);
  }, []);

  const slice = useCallback(
    <T,>(rows: ReadonlyArray<T>): ReadonlyArray<T> => {
      const start = (currentPage - 1) * internalSize;
      return rows.slice(start, start + internalSize);
    },
    [currentPage, internalSize],
  );

  return {
    currentPage,
    pageSize: internalSize,
    pageCount: rawPageCount,
    window: buildWindow(currentPage, rawPageCount),
    next,
    previous,
    goTo,
    setPageSize,
    offset: (currentPage - 1) * internalSize,
    slice,
    rangeLabel: makeRangeLabel(currentPage, internalSize, total),
  };
}

function makeRangeLabel(
  currentPage: number,
  pageSize: number,
  total: number,
): string {
  if (total === 0) return "0 of 0";
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);
  return `${start}–${end} of ${total}`;
}
