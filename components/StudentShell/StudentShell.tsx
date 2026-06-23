"use client";

import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar/StudentSidebar";

type StudentShellProps = {
  readonly children: ReactNode;
};

// Client shell because shadcn's SidebarProvider holds open/collapsed state
// in React state and persists it to a cookie. The page that renders this
// shell is still a Server Component; only this wrapper owns client state.
export function StudentShell({ children }: StudentShellProps) {
  return (
    <SidebarProvider>
      <StudentSidebar />
      <SidebarInset className="bg-background">{children}</SidebarInset>
    </SidebarProvider>
  );
}

export default StudentShell;
