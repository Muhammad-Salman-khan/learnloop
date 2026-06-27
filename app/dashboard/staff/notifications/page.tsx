import Link from "next/link";
import { Megaphone, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminStatStrip } from "@/components/AdminStatStrip/AdminStatStrip";

import {
  audienceLabel,
  findUser,
  severityLabel,
  staffAlerts,
} from "@/lib/staff/staff-data";
import { relativeTime } from "@/lib/admin/formatters";

const page = () => {
  const urgent = staffAlerts.filter((a) => a.severity === "urgent").length;
  const normal = staffAlerts.filter((a) => a.severity === "normal").length;

  const sorted = [...staffAlerts].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1,
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Staff · Notifications
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Sent alerts
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            Every notification dispatched from the staff console. Urgent items
            are highlighted at the top.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/dashboard/staff/notifications/new">
            <Plus className="mr-1.5 size-3.5" />
            Push alert
          </Link>
        </Button>
      </header>

      <AdminStatStrip
        items={[
          {
            label: "Urgent alerts",
            value: String(urgent),
            hint: "Currently active",
            trend: urgent > 0 ? "down" : "flat",
          },
          {
            label: "Normal alerts",
            value: String(normal),
            hint: "Recent term",
            trend: "flat",
          },
          {
            label: "Total dispatched",
            value: String(staffAlerts.length),
            hint: "Across the term",
          },
          {
            label: "Audience mix",
            value: new Set(staffAlerts.map((a) =>
              typeof a.audience === "string"
                ? a.audience
                : "batch",
            )).size.toString(),
            hint: "Distinct recipient groups",
          },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            All alerts
          </CardTitle>
          <CardDescription className="text-xs">
            Newest first. Toggle the read state from each card once read status
            is wired to the API.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {sorted.length === 0 ? (
              <li className="px-6 py-8 text-center text-xs text-muted-foreground">
                No alerts dispatched yet.
              </li>
            ) : (
              sorted.map((alert) => {
                const author = findUser(alert.authorUserId);
                return (
                  <li
                    key={alert.id}
                    className="flex flex-col gap-2 px-6 py-4"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className={
                          alert.severity === "urgent"
                            ? "mt-1 flex size-7 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive"
                            : "mt-1 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
                        }
                      >
                        <Megaphone className="size-3.5" />
                      </span>
                      <div className="flex flex-1 flex-col gap-1">
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
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
