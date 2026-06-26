"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Ban, Pencil, Plus, Search } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  type AdminRole,
  type AdminUser,
  ALL_ROLES,
  roleLabel,
} from "@/lib/admin/admin-data";
import { formatDateLong, initials } from "@/lib/admin/formatters";

type RoleFilter = AdminRole | "all";

type AdminUsersTableProps = {
  readonly users: ReadonlyArray<AdminUser>;
};

function roleVariant(role: AdminRole) {
  if (role === "superAdmin") return "default" as const;
  if (role === "admin") return "secondary" as const;
  if (role === "teacher") return "outline" as const;
  if (role === "staff") return "ghost" as const;
  return "secondary" as const;
}

export function AdminUsersTable({ users }: AdminUsersTableProps) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (role !== "all" && u.role !== role) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    });
  }, [users, query, role]);

  return (
    <div className="flex flex-col gap-4">
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
          <Button size="sm" asChild className="gap-1.5">
            <Link href="/dashboard/admin/users/new">
              <Plus className="size-3.5" />
              Create user
            </Link>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">User</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="pr-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-5 py-10 text-center text-xs text-muted-foreground"
                >
                  No users match these filters.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="pl-5">
                    <Link
                      href={`/dashboard/admin/users/${u.id}`}
                      className="flex items-center gap-3 hover:underline"
                    >
                      <Avatar className="size-8 rounded-md">
                        <AvatarFallback className="rounded-md bg-primary text-[11px] text-primary-foreground">
                          {initials(u.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{u.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {u.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={roleVariant(u.role)}>
                      {roleLabel(u.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {formatDateLong(u.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {u.banned ? (
                      <Badge variant="destructive" className="gap-1">
                        <Ban className="size-2.5" /> Banned
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="gap-1"
                      >
                        <Link href={`/dashboard/admin/users/${u.id}`}>
                          View
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="gap-1"
                      >
                        <Link
                          href={`/dashboard/admin/users/${u.id}/edit`}
                        >
                          <Pencil className="size-3" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default AdminUsersTable;
