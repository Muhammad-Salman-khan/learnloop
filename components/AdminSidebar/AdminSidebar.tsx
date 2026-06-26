"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronsUpDown,
  LogOut,
  Megaphone,
  Settings,
  ShieldCheck,
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

const overviewNav: NavLeaf = {
  label: "Overview",
  href: "/dashboard/admin",
  icon: ShieldCheck,
};

const usersNav: NavGroup = {
  label: "Users",
  icon: Users,
  href: "/dashboard/admin/users",
  children: [
    { label: "All users", href: "/dashboard/admin/users", icon: Users },
    {
      label: "Students",
      href: "/dashboard/admin/students",
      icon: Users,
    },
    {
      label: "Teachers",
      href: "/dashboard/admin/teachers",
      icon: Users,
    },
    { label: "Staff", href: "/dashboard/admin/staff", icon: Users },
  ],
};

const primaryNav: ReadonlyArray<NavEntry> = [
  overviewNav,
  usersNav,
  {
    label: "Courses",
    href: "/dashboard/admin/courses",
    icon: ShieldCheck,
  },
  {
    label: "Enrollments",
    href: "/dashboard/admin/enrollments",
    icon: ShieldCheck,
  },
  {
    label: "Fees",
    href: "/dashboard/admin/fees",
    icon: ShieldCheck,
  },
  {
    label: "Announcements",
    href: "/dashboard/admin/announcements",
    icon: Megaphone,
  },
];

const settingsNav: NavGroup = {
  label: "Settings",
  icon: Settings,
  href: "/dashboard/admin/settings",
  children: [
    {
      label: "General",
      href: "/dashboard/admin/settings",
      icon: Settings,
    },
    {
      label: "Roles",
      href: "/dashboard/admin/settings/roles",
      icon: Settings,
    },
    {
      label: "Account",
      href: "/dashboard/admin/settings/account",
      icon: Settings,
    },
  ],
};

function isPathActive(pathname: string, href: string): boolean {
  if (href === "/dashboard/admin") return pathname === "/dashboard/admin";
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

export function AdminSidebar() {
  const pathname = usePathname() ?? "";

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <Link
          href="/dashboard/admin"
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
              Admin console
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
                  <NavLeafRow
                    key={entry.href}
                    item={{
                      ...entry,
                      icon: entry.icon,
                    }}
                  />
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Configuration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavGroupRow item={settingsNav} pathname={pathname} />
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
                      SK
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col text-left leading-tight">
                    <span className="truncate text-sm font-medium">
                      Salman Khan
                    </span>
                    <span className="truncate text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      Super admin
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
                  alibinkhan465@gmail.com
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/admin/settings/account">
                    <Settings className="mr-2 size-3.5" />
                    Account settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Bell className="mr-2 size-3.5" />
                  Notifications
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

export default AdminSidebar;
