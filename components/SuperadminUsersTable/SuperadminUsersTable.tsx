"use client";

// Live, filtering table for users under /dashboard/superadmin/users/*.
// Compared with Admin*Table, this one fetches on selection: filter UI
// (role, banned, free-text) is held in state, then the table mutates client-side.

import { useMemo, useState } from "react";
import Link from "next/link";
import { Ban, Eye, Pencil, Search, ShieldAlert, UserCog } from "lucide-react";

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
  type SuperadminRole,
  ALL_ROLES,
  roleBadgeVariant,
  roleLabel,
} from "@/lib/superadmin/roles";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  createdAt: Date | string;
};

type Props = {
  readonly users: ReadonlyArray<UserRow>;
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function roleBadge(role: string) {
  const r = role as SuperadminRole;
  const variant = ALL_ROLES.includes(r) ? roleBadgeVariant(r) : "secondary";
  return (
    <Badge variant={variant} className="font-normal">
      {ALL_ROLES.includes(r) ? roleLabel(r) : role}
    </Badge>
  );
}

export function SuperadminUsersTable({ users }: Props) {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string>("all");
  const [banned, setBanned] = useState<string>("any");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return users.filter((u) => {
      if (role !== "all" && u.role !== role) return false;
      if (banned === "yes" && !u.banned) return false;
      if (banned === "no" && u.banned) return false;
      if (!query) return true;
      return (
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
      );
    });
  }, [users, q, role, banned]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:w-80">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email"
            className="h-9 pl-8 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={role} onValueChange={setRole}>
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
          <Select value={banned} onValueChange={setBanned}>
            <SelectTrigger className="h-9 w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">All status</SelectItem>
              <SelectItem value="no">Active</SelectItem>
              <SelectItem value="yes">Banned</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" asChild className="gap-1.5">
            <Link href="/dashboard/superadmin/users/new">
              <UserCog className="size-3.5" />
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
                      href={`/dashboard/superadmin/users/${u.id}`}
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
                    {roleBadge(u.role)}
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {formatDate(u.createdAt)}
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
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/superadmin/users/${u.id}`}>
                          View
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild className="gap-1">
                        <Link href={`/dashboard/superadmin/users/${u.id}/edit`}>
                          <Pencil className="size-3" />
                          Edit
                        </Link>
                      </Button>
                      {u.role !== "superAdmin" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="gap-1"
                        >
                          <Link
                            href={`/dashboard/superadmin/users/${u.id}/impersonate`}
                          >
                            <Eye className="size-3" />
                            Impersonate
                          </Link>
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        {rows.length} of {users.length} users · click row to open detail.
      </div>
    </div>
  );
}

export default SuperadminUsersTable;
