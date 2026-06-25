"use client";

import type { ReactNode } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TeacherSidebar } from "@/components/TeacherSidebar/TeacherSidebar";

type TeacherShellProps = {
  readonly children: ReactNode;
};

// Client shell because shadcn's SidebarProvider holds open/collapsed state
// in React state and persists it to a cookie. The layout that renders this
// shell is still a Server Component; only this wrapper owns client state.
export function TeacherShell({ children }: TeacherShellProps) {
  return (
    <SidebarProvider>
      <TeacherSidebar />
      <SidebarInset className="bg-background">{children}</SidebarInset>
    </SidebarProvider>
  );
}

export default TeacherShell;
