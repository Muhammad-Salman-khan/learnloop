"use client";

import type { ReactNode } from "react";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

import { AdminSidebar } from "@/components/AdminSidebar/AdminSidebar";
import { AdminHeader } from "@/components/AdminHeader/AdminHeader";

type AdminShellProps = {
  readonly children: ReactNode;
};

// Client shell because shadcn's SidebarProvider holds open/collapsed state
// in React state and persists it to a cookie. The layout that uses this
// shell is still a Server Component; only this wrapper owns client state.
export function AdminShell({ children }: AdminShellProps) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-background">
        <AdminHeader />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default AdminShell;
