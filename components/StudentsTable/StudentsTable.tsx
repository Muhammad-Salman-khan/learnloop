"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
  type EnrolledStudent,
  type FeeStatus,
} from "@/lib/dashboard/teacher-data";
import { formatDateLong, relativeTime } from "@/lib/dashboard/date-utils";

type FeeFilter = "all" | FeeStatus;

type StudentsTableProps = {
  readonly students: ReadonlyArray<EnrolledStudent>;
};

function feeVariant(
  status: FeeStatus,
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "paid") return "secondary";
  if (status === "pending") return "outline";
  if (status === "overdue") return "destructive";
  return "default";
}

function feeLabel(status: FeeStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function StudentsTable({ students }: StudentsTableProps) {
  const [query, setQuery] = useState("");
  const [fee, setFee] = useState<FeeFilter>("all");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      if (fee !== "all" && s.feeStatus !== fee) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    });
  }, [students, query, fee]);

  return (
    <div className="flex flex-col gap-3">
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
        <Select value={fee} onValueChange={(v) => setFee(v as FeeFilter)}>
          <SelectTrigger className="h-9 w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All fee states</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="scholarship">Scholarship</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Enrolled</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead className="text-right">Profile</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No students match this filter.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-[11px] font-medium">
                          {s.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {s.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {s.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDateLong(s.enrollmentDate)}
                  </TableCell>
                  <TableCell>
                    <div className="flex w-44 items-center gap-2">
                      <Progress
                        value={s.roadmapPct}
                        className="h-1.5"
                      />
                      <span className="font-mono text-xs">
                        {s.roadmapPct}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={feeVariant(s.feeStatus)}>
                      {feeLabel(s.feeStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {relativeTime(s.lastActive)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="ghost">
                      <Link href="/dashboard/teacher/profile">View</Link>
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

export default StudentsTable;
