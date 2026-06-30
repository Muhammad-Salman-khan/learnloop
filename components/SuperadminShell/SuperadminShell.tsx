"use client";

// SuperAdminShell is the Client Component wrapper that mounts the sidebar
// provider, the superadmin sidebar + header, and the impersonation banner.
// Mirrors AdminShell's structure but with SuperAdmin-specific content.

import type { ReactNode } from "react";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

import { SuperadminSidebar } from "@/components/SuperadminSidebar/SuperadminSidebar";
import { SuperadminHeader } from "@/components/SuperadminHeader/SuperadminHeader";
import { ImpersonationBanner } from "@/components/ImpersonationBanner/ImpersonationBanner";

type SuperadminShellProps = {
  readonly children: ReactNode;
  readonly impersonatingTargetName?: string;
};

export function SuperadminShell({
  children,
  impersonatingTargetName,
}: SuperadminShellProps) {
  const impersonating = typeof impersonatingTargetName === "string";
  return (
    <SidebarProvider>
      {impersonating ? (
        <ImpersonationBanner
          impersonating
          targetName={impersonatingTargetName}
        />
      ) : null}
      <div className="flex w-full flex-1">
        <SuperadminSidebar />
        <SidebarInset className="bg-background">
          <SuperadminHeader />
          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default SuperadminShell;
