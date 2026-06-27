"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  CalendarClock,
  ChevronsUpDown,
  ClipboardCheck,
  Clock4,
  GraduationCap,
  GraduationCap as StudentsIcon,
  IdCard,
  LogOut,
  Megaphone,
  Repeat,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavLeaf = {
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
};

type NavGroup = {
  readonly label: string;
  readonly icon: LucideIcon;
  readonly href: string;
  readonly children: ReadonlyArray<NavLeaf>;
};

type NavEntry = NavLeaf | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}

const overview: NavLeaf = {
  label: "Overview",
  href: "/dashboard/staff",
  icon: ShieldCheck,
};

const studentsNav: NavGroup = {
  label: "Students",
  icon: StudentsIcon,
  href: "/dashboard/staff/students",
  children: [
    { label: "All students", href: "/dashboard/staff/students", icon: Users },
    {
      label: "Add student",
      href: "/dashboard/staff/students/new",
      icon: GraduationCap,
    },
  ],
};

const teachersNav: NavGroup = {
  label: "Teachers",
  icon: UserCog,
  href: "/dashboard/staff/teachers",
  children: [
    { label: "All teachers", href: "/dashboard/staff/teachers", icon: Users },
    {
      label: "Add teacher",
      href: "/dashboard/staff/teachers/new",
      icon: IdCard,
    },
  ],
};

const scheduleNav: NavGroup = {
  label: "Schedule",
  icon: CalendarClock,
  href: "/dashboard/staff/schedule",
  children: [
    {
      label: "View schedule",
      href: "/dashboard/staff/schedule",
      icon: CalendarClock,
    },
    {
      label: "Set schedule",
      href: "/dashboard/staff/schedule/new",
      icon: Clock4,
    },
  ],
};

const resultsNav: NavGroup = {
  label: "Results",
  icon: ClipboardCheck,
  href: "/dashboard/staff/results",
  children: [
    {
      label: "Master results",
      href: "/dashboard/staff/results",
      icon: ClipboardCheck,
    },
    {
      label: "Export",
      href: "/dashboard/staff/results/export",
      icon: Repeat,
    },
  ],
};

const notificationsNav: NavGroup = {
  label: "Notifications",
  icon: Megaphone,
  href: "/dashboard/staff/notifications",
  children: [
    {
      label: "Sent alerts",
      href: "/dashboard/staff/notifications",
      icon: Bell,
    },
    {
      label: "New alert",
      href: "/dashboard/staff/notifications/new",
      icon: Megaphone,
    },
  ],
};

const primaryNav: ReadonlyArray<NavEntry> = [
  overview,
  studentsNav,
  teachersNav,
  {
    label: "Role management",
    href: "/dashboard/staff/roles",
    icon: UserCog,
  },
  {
    label: "Courses",
    href: "/dashboard/staff/courses",
    icon: BookOpen,
  },
  {
    label: "Enrollments",
    href: "/dashboard/staff/enrollments",
    icon: ClipboardCheck,
  },
  scheduleNav,
  {
    label: "Fees",
    href: "/dashboard/staff/fees",
    icon: Repeat,
  },
  resultsNav,
  notificationsNav,
];

function isPathActive(pathname: string, href: string): boolean {
  if (href === "/dashboard/staff") return pathname === "/dashboard/staff";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function groupHasActiveChild(
  pathname: string,
  group: NavGroup,
): boolean {
  if (isPathActive(pathname, group.href)) return true;
  return group.children.some((c) => isPathActive(pathname, c.href));
}

function NavLeafRow({ item }: { item: NavLeaf }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.label}>
        <Link href={item.href}>
          <item.icon />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function NavGroupRow({
  item,
  pathname,
}: {
  item: NavGroup;
  pathname: string;
}) {
  const open = groupHasActiveChild(pathname, item);
  return (
    <Collapsible defaultOpen={open} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            tooltip={item.label}
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <item.icon />
            <span>{item.label}</span>
            <span className="ml-auto text-[10px] text-muted-foreground group-data-[state=open]/collapsible:hidden">
              ▾
            </span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children.map((child) => (
              <SidebarMenuSubItem key={child.href}>
                <SidebarMenuSubButton
                  asChild
                  isActive={isPathActive(pathname, child.href)}
                >
                  <Link href={child.href}>
                    <span>{child.label}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function StaffSidebar() {
  const pathname = usePathname() ?? "";

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <Link
          href="/dashboard/staff"
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
              Staff console
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primaryNav.map((entry) =>
                isGroup(entry) ? (
                  <NavGroupRow
                    key={entry.label}
                    item={entry}
                    pathname={pathname}
                  />
                ) : (
                  <NavLeafRow key={entry.href} item={entry} />
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link href="/dashboard/staff/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent"
                >
                  <Avatar className="size-7 rounded-md">
                    <AvatarFallback className="rounded-md bg-primary text-[11px] text-primary-foreground">
                      MS
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left leading-tight">
                    <span className="truncate text-sm font-medium">
                      Mariam Suleman
                    </span>
                    <span className="truncate text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      Staff
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-3.5" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="start"
                className="w-56"
              >
                <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
                <DropdownMenuItem disabled>
                  mariam.s@learnhub.test
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/staff/settings">
                    <Settings className="mr-2 size-3.5" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/staff/notifications">
                    <Bell className="mr-2 size-3.5" />
                    Notifications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <LogOut className="mr-2 size-3.5" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default StaffSidebar;
