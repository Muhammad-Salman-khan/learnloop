import Link from "next/link";
import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { buildOverviewSnapshot, staffAlerts } from "@/lib/staff/staff-data";

const todayLong = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
}).format(new Date());

// Server component. Renders the staff twin of the admin header.
// The total-unread counter comes straight from the demo data snapshot.
export function StaffHeader() {
  const urgentCount = staffAlerts.filter((a) => a.severity === "urgent").length;
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium leading-tight">
          LearnHub · Staff console
        </span>
        <span className="hidden truncate text-xs text-muted-foreground md:block">
          {todayLong} · Demo data · {buildOverviewSnapshot().recentEnrollments.length} recent enrollments
        </span>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Search students, teachers, courses"
            className="h-9 w-72 pl-8 text-sm"
          />
        </div>

        <Badge variant="secondary" className="h-6 px-2 text-[10.5px]">
          Demo
        </Badge>

        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          asChild
          aria-label="Notifications"
          className="relative"
        >
          <Link href="/dashboard/staff/notifications">
            <Bell className="size-4" />
            {urgentCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                {urgentCount}
              </span>
            ) : null}
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          asChild
          aria-label="Notifications"
        >
          <Link href="/dashboard/staff/notifications">
            <Bell className="size-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
}

export default StaffHeader;
