"use client";

import type { ReactNode } from "react";

import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

import { StaffSidebar } from "@/components/StaffSidebar/StaffSidebar";
import { StaffHeader } from "@/components/StaffHeader/StaffHeader";

type StaffShellProps = {
  readonly children: ReactNode;
};

// Client-side chrome for the staff dashboard. The actual layout file is
// still a Server Component; only this wrapper owns the open/collapsed
// state via shadcn's SidebarProvider.
export function StaffShell({ children }: StaffShellProps) {
  return (
    <SidebarProvider>
      <StaffSidebar />
      <SidebarInset className="bg-background">
        <StaffHeader />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default StaffShell;
