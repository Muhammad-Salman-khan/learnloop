"use client";

import Link from "next/link";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
  Trophy,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavItem = {
  readonly label: string;
  readonly href: string;
  readonly icon: typeof LayoutDashboard;
  readonly isActive?: boolean;
};

const primaryNav: ReadonlyArray<NavItem> = [
  { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard, isActive: true },
  { label: "My courses", href: "/dashboard/student/courses", icon: BookOpen },
  { label: "Schedule", href: "/dashboard/student/schedule", icon: Calendar },
  { label: "Grades", href: "/dashboard/student/grades", icon: Trophy },
  { label: "Messages", href: "/dashboard/student/messages", icon: MessageSquare },
];

const secondaryNav: ReadonlyArray<NavItem> = [
  { label: "AI study tools", href: "/dashboard/student/ai-tools", icon: Sparkles },
  { label: "Settings", href: "/dashboard/student/settings", icon: Settings },
];

export function StudentSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <Link
          href="/dashboard/student"
          className="flex items-center gap-2 px-2 py-1.5"
        >
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold"
          >
            L
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-base font-semibold tracking-tight">
              LearnHub
            </span>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Student console
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Profile">
              <Link href="/dashboard/student/profile">
                <GraduationCap />
                <span>Salman Khan</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default StudentSidebar;
