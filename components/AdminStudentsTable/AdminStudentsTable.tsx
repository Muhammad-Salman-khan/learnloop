"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Pencil,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  AdminStudent,
  AdminUser,
  FeeStatus,
} from "@/lib/admin/admin-data";
import { initials } from "@/lib/admin/formatters";

type FeeFilter = "all" | FeeStatus;

type Row = {
  readonly student: AdminStudent;
  readonly user: AdminUser;
};

type AdminStudentsTableProps = {
  readonly rows: ReadonlyArray<Row>;
};

function FeeBadge({ status }: { status: FeeStatus }) {
  if (status === "paid")
    return (
      <Badge variant="secondary" className="gap-1">
        <CheckCircle2 className="size-2.5" />
        Paid
      </Badge>
    );
  if (status === "due")
    return (
      <Badge variant="outline" className="gap-1">
        <Clock className="size-2.5" />
        Due
      </Badge>
    );
  return (
    <Badge variant="destructive" className="gap-1">
      <AlertTriangle className="size-2.5" />
      Unpaid
    </Badge>
  );
}

export function AdminStudentsTable({ rows }: AdminStudentsTableProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [fee, setFee] = useState<FeeFilter>("all");
  const [selectedIds, setSelectedIds] = useState<ReadonlyArray<string>>([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkFee, setBulkFee] = useState<FeeStatus>("paid");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(({ student, user }) => {
      if (fee !== "all" && student.feeStatus !== fee) return false;
      if (!q) return true;
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        student.rollNumber.toLowerCase().includes(q)
      );
    });
  }, [rows, query, fee]);

  function toggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id],
    );
  }

  function toggleAll() {
    if (
      selectedIds.length === filtered.length &&
      filtered.length > 0
    ) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(filtered.map((r) => r.student.userId));
  }

  function applyBulk() {
    setBulkOpen(false);
    toast.success(
      `Updated ${selectedIds.length} students to ${bulkFee.toUpperCase()}`,
      {
        description: "Demo: fee states are mocked in-memory. Reload to reset.",
      },
    );
    setSelectedIds([]);
    router.refresh();
  }

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
            placeholder="Search by name, email, roll number"
            className="h-9 pl-8 text-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={fee}
            onValueChange={(v) => setFee(v as FeeFilter)}
          >
            <SelectTrigger className="h-9 w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All fee states</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="due">Due</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>
          {selectedIds.length > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {selectedIds.length} selected
              </span>
              {bulkOpen ? (
                <>
                  <Select
                    value={bulkFee}
                    onValueChange={(v) =>
                      setBulkFee(v as FeeStatus)
                    }
                  >
                    <SelectTrigger className="h-9 w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="due">Due</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={applyBulk}>
                    Apply
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setBulkOpen(false)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBulkOpen(true)}
                  className="gap-1.5"
                >
                  <Wallet className="size-3.5" />
                  Bulk update fee
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedIds([])}
              >
                Clear
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 pl-5">
                <Checkbox
                  checked={
                    selectedIds.length > 0 &&
                    selectedIds.length === filtered.length
                  }
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="pl-2">Student</TableHead>
              <TableHead className="hidden md:table-cell">Roll number</TableHead>
              <TableHead className="hidden md:table-cell">Class</TableHead>
              <TableHead className="hidden md:table-cell">Enrolled</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead className="pr-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-5 py-10 text-center text-xs text-muted-foreground"
                >
                  No students match these filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map(({ student, user }) => (
                <TableRow key={student.userId}>
                  <TableCell className="pl-5">
                    <Checkbox
                      checked={selectedIds.includes(student.userId)}
                      onCheckedChange={() => toggle(student.userId)}
                      aria-label={`Select ${user.name}`}
                    />
                  </TableCell>
                  <TableCell className="pl-2">
                    <Link
                      href={`/dashboard/admin/students/${student.userId}`}
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
                    {student.rollNumber}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm">
                      {student.className} · Section {student.section}
                    </span>
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {student.enrolledCourseIds.length} courses
                  </TableCell>
                  <TableCell>
                    <FeeBadge status={student.feeStatus} />
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <Link
                          href={`/dashboard/admin/students/${student.userId}/fees`}
                        >
                          Fees
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="gap-1"
                      >
                        <Link
                          href={`/dashboard/admin/students/${student.userId}`}
                        >
                          <Pencil className="size-3" />
                          View
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

      {selectedIds.length === 0 ? null : (
        <p className="text-xs text-muted-foreground">
          Bulk fee updates affect the current month. The change is mocked
          in-memory — restart the dev server to reset to seed data.
        </p>
      )}
    </div>
  );
}

export default AdminStudentsTable;
