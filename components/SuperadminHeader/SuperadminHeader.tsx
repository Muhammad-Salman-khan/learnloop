"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";


import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

export function SuperadminHeader() {
  return (
    <header className="flex h-14 items-center gap-3 border-b bg-background px-4 md:px-6">
      <SidebarTrigger className="-ml-1" />
      <div className="hidden flex-1 md:flex md:max-w-md">
        <div className="relative w-full">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search users, courses, records…"
            className="h-9 pl-8 text-sm"
          />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/superadmin/notifications">
            <Bell className="size-4" />
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/superadmin/audit-log">Audit log</Link>
        </Button>
      </div>
    </header>
  );
}

export default SuperadminHeader;
