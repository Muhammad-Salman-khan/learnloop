import Link from "next/link";
import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Badge,
} from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";

const todayLong = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
}).format(new Date());

// Server Component. The two client islands inside (SidebarTrigger handled by
// shadcn already, ThemeToggle, the Search input below if we ever wire behavior)
// are pushed leaf-level so the JS cost of the header stays small.
export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium leading-tight">
          LearnHub · Admin console
        </span>
        <span className="hidden truncate text-xs text-muted-foreground md:block">
          {todayLong} · Demo data is mocked — no live database
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
            placeholder="Search users, courses, fees"
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
        >
          <Link href="/dashboard/admin/announcements">
            <Bell className="size-4" />
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
          <Link href="/dashboard/admin/announcements">
            <Bell className="size-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
