"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

import type {
  AdminTeacher,
  AdminUser,
} from "@/lib/admin/admin-data";
import { formatDateLong, initials } from "@/lib/admin/formatters";

type StatusFilter = "all" | "active" | "inactive";

type Row = {
  readonly teacher: AdminTeacher;
  readonly user: AdminUser;
};

type AdminTeachersTableProps = {
  readonly rows: ReadonlyArray<Row>;
};

export function AdminTeachersTable({
  rows,
}: AdminTeachersTableProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(({ teacher, user }) => {
      if (status === "active" && !teacher.isActive) return false;
      if (status === "inactive" && teacher.isActive) return false;
      if (!q) return true;
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        teacher.employmentId.toLowerCase().includes(q)
      );
    });
  }, [rows, query, status]);

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
            placeholder="Search by name, email, employment ID"
            className="h-9 pl-8 text-sm"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as StatusFilter)}
        >
          <SelectTrigger className="h-9 w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All teachers</SelectItem>
            <SelectItem value="active">Active only</SelectItem>
            <SelectItem value="inactive">Inactive only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Teacher</TableHead>
              <TableHead className="hidden md:table-cell">Employment ID</TableHead>
              <TableHead className="hidden md:table-cell">Subject</TableHead>
              <TableHead className="hidden md:table-cell">Hire date</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="pr-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-5 py-10 text-center text-xs text-muted-foreground"
                >
                  No teachers match these filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(({ teacher, user }) => (
                <TableRow key={teacher.userId}>
                  <TableCell className="pl-5">
                    <Link
                      href={`/dashboard/admin/teachers/${teacher.userId}`}
                      className="flex items-center gap-3 hover:underline"
                    >
                      <Avatar className="size-8 rounded-md">
                        <AvatarFallback className="rounded-md bg-primary text-[11px] text-primary-foreground">
                          {initials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-0.5 leading-tight">
                        <span className="text-sm font-medium">
                          {user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden font-mono text-xs tabular-nums text-muted-foreground md:table-cell">
                    {teacher.employmentId}
                  </TableCell>
                  <TableCell className="hidden text-xs md:table-cell">
                    {teacher.subjectProficiency.join(", ")}
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {formatDateLong(teacher.hireDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        teacher.isActive ? "secondary" : "outline"
                      }
                    >
                      {teacher.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={`/dashboard/admin/teachers/${teacher.userId}`}
                      >
                        View
                      </Link>
                    </Button>
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

export default AdminTeachersTable;
