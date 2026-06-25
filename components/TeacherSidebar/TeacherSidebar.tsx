"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  ScrollText,
  Sparkles,
  UserCircle2,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { teacherCourses } from "@/lib/dashboard/teacher-data";

type NavItem = {
  readonly label: string;
  readonly href: string;
  readonly icon: typeof LayoutDashboard;
  // When present, internal sub-links are rendered under this item.
  readonly children?: ReadonlyArray<{ label: string; href: string }>;
};

const primaryNav: ReadonlyArray<NavItem> = [
  { label: "Dashboard", href: "/dashboard/teacher", icon: BarChart3 },
  {
    label: "My courses",
    href: "/dashboard/teacher/courses",
    icon: BookOpen,
    children: teacherCourses.slice(0, 6).map((c) => ({
      label: `${c.code} · ${c.title}`,
      href: `/dashboard/teacher/courses/${c.id}`,
    })),
  },
  { label: "Quizzes", href: "/dashboard/teacher/quizzes", icon: ListChecks },
  { label: "Schedule", href: "/dashboard/teacher/schedule", icon: ScrollText },
  { label: "AI tools", href: "/dashboard/teacher/ai-tools", icon: Sparkles },
];

const secondaryNav: ReadonlyArray<NavItem> = [
  { label: "Profile", href: "/dashboard/teacher/profile", icon: UserCircle2 },
];

function isPathActive(pathname: string, href: string): boolean {
  if (href === "/dashboard/teacher") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function TeacherSidebar() {
  const pathname = usePathname() ?? "";

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <Link
          href="/dashboard/teacher"
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
              Teacher console
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNav.map((item) => {
                const active = isPathActive(pathname, item.href);
                if (!item.children || item.children.length === 0) {
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
                // Open the group when the current path lives under the parent
                // OR under any of its children, using defaultOpen for a clean
                // initial render.
                const groupActive =
                  active || item.children.some((c) => pathname.startsWith(c.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <Collapsible defaultOpen className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={groupActive}
                          tooltip={item.label}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                          <ChevronRight
                            aria-hidden="true"
                            className="ml-auto size-3.5 transition-transform group-data-[state=open]/collapsible:rotate-90"
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={pathname === item.href}>
                              <Link href={item.href}>
                                <span>All courses</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname.startsWith(child.href)}
                              >
                                <Link href={child.href}>
                                  <span className="truncate">{child.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>You</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isPathActive(pathname, item.href)}
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
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Signed in as Salman Khan">
              <Link href="/dashboard/teacher/profile">
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

export default TeacherSidebar;
