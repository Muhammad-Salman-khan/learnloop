"use client";

import { useEffect, useMemo, useState } from "react";
import { Megaphone, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { StaffAlert } from "@/lib/staff/staff-data";
import {
  audienceLabel,
  severityLabel,
} from "@/lib/staff/staff-data";
import { findUser } from "@/lib/admin/admin-data";
import { usePaginator } from "@/lib/hooks/usePagination";
import { TablePagination } from "@/components/TablePagination/TablePagination";
import {
  MobileCard,
  MobileCardList,
} from "@/components/MobileCard/MobileCard";
import { relativeTime } from "@/lib/admin/formatters";

type SeverityFilter = "all" | "urgent" | "normal";

type StaffNotificationsListProps = {
  readonly items: ReadonlyArray<StaffAlert>;
};

export function StaffNotificationsList({
  items,
}: StaffNotificationsListProps) {
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<SeverityFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((alert) => {
      if (severity !== "all" && alert.severity !== severity) return false;
      if (!q) return true;
      return (
        alert.title.toLowerCase().includes(q) ||
        alert.message.toLowerCase().includes(q)
      );
    });
  }, [items, query, severity]);

  const paginator = usePaginator(filtered.length, 10);

  useEffect(() => {
    paginator.goTo(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, severity, filtered.length]);

  const pageAlerts = paginator.slice(filtered);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:w-80">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or message"
            className="h-9 pl-8 text-sm"
          />
        </div>
        <Select
          value={severity}
          onValueChange={(v) => setSeverity(v as SeverityFilter)}
        >
          <SelectTrigger className="h-9 w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All alerts</SelectItem>
            <SelectItem value="urgent">Urgent only</SelectItem>
            <SelectItem value="normal">Normal only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Desktop */}
      <div className="hidden flex-col gap-3 md:flex">
        {pageAlerts.length === 0 ? (
          <div className="rounded-md border bg-card p-8 text-center text-xs text-muted-foreground">
            {filtered.length === 0
              ? "No alerts dispatched yet."
              : "Nothing on this page."}
          </div>
        ) : (
          pageAlerts.map((alert) => {
            const author = findUser(alert.authorUserId);
            return (
              <article
                key={alert.id}
                className="flex flex-col gap-2 rounded-md border bg-card px-5 py-4"
              >
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-sm font-medium leading-tight">
                    {alert.title}
                  </h3>
                  <Badge
                    variant={
                      alert.severity === "urgent"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {severityLabel(alert.severity)}
                  </Badge>
                  <Badge variant="secondary">
                    {audienceLabel(alert.audience)}
                  </Badge>
                </div>
                <p className="text-sm leading-snug text-muted-foreground">
                  {alert.message}
                </p>
                <div className="flex items-center gap-3 text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span>{author?.name ?? "System"}</span>
                  <span>·</span>
                  <span>{relativeTime(alert.publishedAt)}</span>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Mobile */}
      <MobileCardList>
        {pageAlerts.length === 0 ? (
          <div className="rounded-md border bg-card p-6 text-center text-xs text-muted-foreground">
            {filtered.length === 0
              ? "No alerts dispatched yet."
              : "Nothing on this page."}
          </div>
        ) : (
          pageAlerts.map((alert) => {
            const author = findUser(alert.authorUserId);
            return (
              <MobileCard
                key={alert.id}
                emphasis={
                  <>
                    <span
                      aria-hidden="true"
                      className={
                        alert.severity === "urgent"
                          ? "flex size-7 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive"
                          : "flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
                      }
                    >
                      <Megaphone className="size-3.5" />
                    </span>
                    <Badge
                      variant={
                        alert.severity === "urgent"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {severityLabel(alert.severity)}
                    </Badge>
                    <Badge variant="secondary">
                      {audienceLabel(alert.audience)}
                    </Badge>
                  </>
                }
                fields={[
                  { label: "Title", value: alert.title },
                  { label: "Message", value: <span className="text-xs">{alert.message}</span> },
                  {
                    label: "Author",
                    value: author?.name ?? "System",
                  },
                  {
                    label: "Published",
                    value: relativeTime(alert.publishedAt),
                  },
                ]}
              />
            );
          })
        )}
      </MobileCardList>

      <TablePagination paginator={paginator} />
    </div>
  );
}

export default StaffNotificationsList;
