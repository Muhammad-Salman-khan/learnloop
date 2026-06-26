"use client";

import { useMemo, useState } from "react";
import { Search, Shield } from "lucide-react";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type AdminKpi,
  type AdminRole,
  type AdminUser,
  ALL_ROLES,
  roleLabel,
} from "@/lib/admin/admin-data";
import { initials } from "@/lib/admin/formatters";

type RoleFilter = AdminRole | "all";

type RolesOverviewTableProps = {
  readonly users: ReadonlyArray<AdminUser>;
  readonly kpis: ReadonlyArray<AdminKpi>;
};

function roleBadgeVariant(role: AdminRole) {
  if (role === "superAdmin") return "default" as const;
  if (role === "admin") return "secondary" as const;
  if (role === "teacher") return "outline" as const;
  if (role === "staff") return "ghost" as const;
  return "secondary" as const;
}

function roleBadgeClass(role: AdminRole) {
  if (role === "student") return "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300 border-sky-200 dark:border-sky-800";
  return undefined;
}

export function RolesOverviewTable({ users, kpis }: RolesOverviewTableProps) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");

  // Local role overrides so inline Select changes are reflected immediately
  const [roleOverrides, setRoleOverrides] = useState<
    Record<string, AdminRole>
  >({});

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const effectiveRole = roleOverrides[u.id] ?? u.role;
      if (role !== "all" && effectiveRole !== role) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    });
  }, [users, query, role, roleOverrides]);

  function handleRoleChange(userId: string, userName: string, newRole: string) {
    setRoleOverrides((prev) => ({ ...prev, [userId]: newRole as AdminRole }));
    toast(`Role updated for ${userName}`, {
      description: `New role: ${roleLabel(newRole as AdminRole)}`,
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* KPI strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <Card key={item.label} className="gap-3 py-5">
            <CardHeader className="px-5">
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                {item.label}
              </span>
            </CardHeader>
            <CardContent className="px-5 pt-0">
              <span className="font-display text-4xl font-medium leading-none tracking-tight">
                {item.value}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:w-80">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email"
            className="h-9 pl-8 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={role}
            onValueChange={(v) => setRole(v as RoleFilter)}
          >
            <SelectTrigger className="h-9 w-44">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              {ALL_ROLES.map((r) => (
                <SelectItem key={r} value={r}>
                  {roleLabel(r)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">
                Current Role
              </TableHead>
              <TableHead className="pr-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="px-5 py-10 text-center text-xs text-muted-foreground"
                >
                  No users match these filters.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((u) => {
                const effectiveRole = roleOverrides[u.id] ?? u.role;
                return (
                  <TableRow key={u.id}>
                    <TableCell className="pl-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8 rounded-md">
                          <AvatarFallback className="rounded-md bg-primary text-[11px] text-primary-foreground">
                            {initials(u.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                      {u.email}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant={roleBadgeVariant(effectiveRole)}
                        className={roleBadgeClass(effectiveRole)}
                      >
                        <Shield className="mr-1 size-3" />
                        {roleLabel(effectiveRole)}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Select
                        value={effectiveRole}
                        onValueChange={(v) =>
                          handleRoleChange(u.id, u.name, v)
                        }
                      >
                        <SelectTrigger className="ml-auto h-8 w-36 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ALL_ROLES.map((r) => (
                            <SelectItem key={r} value={r}>
                              {roleLabel(r)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default RolesOverviewTable;
