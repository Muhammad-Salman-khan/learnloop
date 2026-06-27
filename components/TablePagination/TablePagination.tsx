"use client";

// Renders shadcn's `Pagination*` primitives driven by the usePaginator hook.
// Pure wrapper — no filtering or sorting logic lives here; the parent owns
// the rows and the hook.

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Paginator } from "@/lib/hooks/usePagination";

type TablePaginationProps = {
  readonly paginator: Paginator;
  readonly pageSizeOptions?: ReadonlyArray<number>;
};

export function TablePagination({
  paginator,
  pageSizeOptions = [10, 20, 50, 100],
}: TablePaginationProps) {
  const {
    currentPage,
    pageCount,
    window,
    next,
    previous,
    goTo,
    setPageSize,
    rangeLabel,
  } = paginator;

  if (pageCount <= 1) {
    return (
      <div className="flex flex-col items-start justify-between gap-2 px-5 py-3 text-xs text-muted-foreground md:flex-row md:items-center">
        <span>{rangeLabel}</span>
        <span className="text-[10.5px] uppercase tracking-[0.18em]">
          Single page
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">{rangeLabel}</span>
        <span className="hidden text-xs text-muted-foreground md:inline-block">
          ·
        </span>
        <div className="hidden items-center gap-2 md:flex">
          <span className="text-xs text-muted-foreground">Rows</span>
          <Select
            value={String(paginator.pageSize)}
            onValueChange={(v) => setPageSize(Number(v))}
          >
            <SelectTrigger className="h-8 w-[88px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((opt) => (
                <SelectItem key={opt} value={String(opt)}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Pagination className="md:mx-0 md:justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-label="Previous page"
              href={currentPage > 1 ? `#page-${currentPage - 1}` : undefined}
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) previous();
              }}
              className={
                currentPage === 1 ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>

          {window.map((entry) => {
            if (entry.kind === "ellipsis") {
              return (
                <PaginationItem key={entry.key}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return (
              <PaginationItem key={entry.key}>
                <PaginationLink
                  href={`#page-${entry.page}`}
                  isActive={entry.page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(entry.page);
                  }}
                  aria-label={`Go to page ${entry.page}`}
                >
                  {entry.page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              aria-label="Next page"
              href={
                currentPage < pageCount ? `#page-${currentPage + 1}` : undefined
              }
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < pageCount) next();
              }}
              className={
                currentPage === pageCount
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default TablePagination;
