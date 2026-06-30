"use client";

// Superadmin sidebar — only the role-gated nav for superAdmins.
// Layout follows AdminSidebar to keep muscle memory identical:
// sidebar header / sidebar content with workspace + configuration
// groups, sidebar footer with user dropdown.

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Building2,
  Calendar,
  ClipboardList,
  Database,
  GraduationCap,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Megaphone,
  ScrollText,
  Settings,
  Settings2,
  ShieldAlert,
  Users,
  UserCog,
  UserPlus,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
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

type NavLeaf = {
  readonly kind?: "leaf";
  readonly label: string;
  readonly href: string;
  readonly icon: LucideIcon;
};

type NavGroup = {
  readonly kind: "group";
  readonly label: string;
  readonly icon: LucideIcon;
  readonly href: string;
  readonly children: ReadonlyArray<NavLeaf>;
};

type NavEntry = NavLeaf | NavGroup;

function isGroup(e: NavEntry): e is NavGroup {
  return e.kind === "group";
}

function isPathActive(pathname: string, href: string): boolean {
  if (href === "/dashboard/superadmin")
    return pathname === "/dashboard/superadmin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function groupHasActive(pathname: string, group: NavGroup): boolean {
  if (isPathActive(pathname, group.href)) return true;
  return group.children.some((c) => isPathActive(pathname, c.href));
}

const overview: NavLeaf = {
  label: "Overview",
  href: "/dashboard/superadmin",
  icon: LayoutDashboard,
};

const usersGroup: NavGroup = {
  kind: "group",
  label: "Users",
  icon: Users,
  href: "/dashboard/superadmin/users",
  children: [
    { label: "All users", href: "/dashboard/superadmin/users", icon: Users },
    { label: "Students", href: "/dashboard/superadmin/students", icon: GraduationCap },
    { label: "Teachers", href: "/dashboard/superadmin/teachers", icon: UserCog },
    { label: "Staff", href: "/dashboard/superadmin/staff", icon: UserCog },
    { label: "Admins", href: "/dashboard/superadmin/admins", icon: ShieldAlert },
  ],
};

const access: NavLeaf = {
  label: "Roles",
  href: "/dashboard/superadmin/roles",
  icon: KeyRound,
};

const academics: NavLeaf[] = [
  { label: "Courses", href: "/dashboard/superadmin/courses", icon: BookOpen },
  { label: "Batches", href: "/dashboard/superadmin/batches", icon: ClipboardList },
  { label: "Enrollments", href: "/dashboard/superadmin/enrollments", icon: UserPlus },
  { label: "Schedule", href: "/dashboard/superadmin/schedule", icon: Calendar },
];

const financesGroup: NavGroup = {
  kind: "group",
  label: "Fees",
  icon: Wallet,
  href: "/dashboard/superadmin/fees",
  children: [
    { label: "Master", href: "/dashboard/superadmin/fees", icon: Wallet },
    { label: "Structures", href: "/dashboard/superadmin/fees/structures", icon: Settings2 },
    { label: "Records", href: "/dashboard/superadmin/fees/records", icon: ClipboardList },
  ],
};

const reporting: NavLeaf[] = [
  { label: "Attendance", href: "/dashboard/superadmin/attendance", icon: Calendar },
  { label: "Results", href: "/dashboard/superadmin/results", icon: Activity },
];

const communication: NavLeaf[] = [
  { label: "Announcements", href: "/dashboard/superadmin/announcements", icon: Megaphone },
  { label: "Notifications", href: "/dashboard/superadmin/notifications", icon: AlertTriangle },
];

const governance: NavLeaf[] = [
  { label: "Audit log", href: "/dashboard/superadmin/audit-log", icon: ScrollText },
  { label: "System", href: "/dashboard/superadmin/system", icon: Database },
];

const settingsGroup: NavGroup = {
  kind: "group",
  label: "Settings",
  icon: Settings,
  href: "/dashboard/superadmin/settings",
  children: [
    { label: "Institute", href: "/dashboard/superadmin/settings/institute", icon: Building2 },
    { label: "Roles", href: "/dashboard/superadmin/settings/roles", icon: KeyRound },
    { label: "AI", href: "/dashboard/superadmin/settings/ai", icon: Settings2 },
    { label: "Storage", href: "/dashboard/superadmin/settings/storage", icon: Database },
    { label: "Email", href: "/dashboard/superadmin/settings/email", icon: Megaphone },
    { label: "Account", href: "/dashboard/superadmin/settings/account", icon: Settings },
  ],
};

const primary: ReadonlyArray<NavEntry> = [
  overview,
  usersGroup,
  access,
  ...academics.map<NavLeaf>((a) => ({ ...a })),
  financesGroup,
  ...reporting,
  ...communication,
  ...governance,
];

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
  const open = groupHasActive(pathname, item);
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

export function SuperadminSidebar() {
  const pathname = usePathname() ?? "";
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <Link
          href="/dashboard/superadmin"
          className="flex items-center gap-2 px-2 py-1.5"
        >
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-md bg-foreground text-background font-semibold"
          >
            L
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-base font-semibold tracking-tight">
              LearnHub
            </span>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Super-admin console
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Governance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primary.map((entry) =>
                isGroup(entry) ? (
                  <NavGroupRow
                    key={entry.label}
                    item={entry}
                    pathname={pathname}
                  />
                ) : (
                  <NavLeafRow
                    key={entry.href}
                    item={{ kind: "leaf", ...entry }}
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
              <NavGroupRow item={settingsGroup} pathname={pathname} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="data-[state=open]:bg-sidebar-accent">
              <Link href="/dashboard/superadmin/settings/account">
                <Avatar className="size-7 rounded-md">
                  <AvatarFallback className="rounded-md bg-foreground text-[11px] text-background">
                    SA
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left leading-tight">
                  <span className="truncate text-sm font-medium">Super admin</span>
                  <span className="truncate text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                    alibinkhan465@gmail.com
                  </span>
                </div>
                <LogOut className="ml-auto size-3.5" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default SuperadminSidebar;
