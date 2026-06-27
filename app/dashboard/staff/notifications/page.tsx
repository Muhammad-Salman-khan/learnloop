import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminStatStrip } from "@/components/AdminStatStrip/AdminStatStrip";

import { StaffNotificationsList } from "@/components/StaffNotificationsList/StaffNotificationsList";
import { staffAlerts } from "@/lib/staff/staff-data";

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
            value: new Set(
              staffAlerts.map((a) =>
                typeof a.audience === "string" ? a.audience : "batch",
              ),
            ).size.toString(),
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
            Newest first · paginated 10 per page · mobile cards on small
            screens.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaffNotificationsList items={sorted} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
