"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, MessageSquareWarning, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { RecentSubmission } from "@/lib/dashboard/teacher-data";
import { relativeTime } from "@/lib/dashboard/date-utils";

type RecentSubmissionsTableProps = {
  readonly items: ReadonlyArray<RecentSubmission>;
};

function statusVariant(
  status: RecentSubmission["status"],
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "graded") return "secondary";
  if (status === "late") return "destructive";
  return "outline";
}

function statusLabel(status: RecentSubmission["status"]): string {
  if (status === "graded") return "Graded";
  if (status === "late") return "Late";
  return "Awaiting grade";
}

// Client island so the search input can filter the table in place.
export function RecentSubmissionsTable({ items }: RecentSubmissionsTableProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (s) =>
        s.assignmentTitle.toLowerCase().includes(q) ||
        s.studentName.toLowerCase().includes(q) ||
        s.courseCode.toLowerCase().includes(q),
    );
  }, [items, query]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <CardTitle className="font-display text-xl font-medium tracking-tight">
            Needs grading
          </CardTitle>
          <CardDescription>
            Submissions awaiting your review. Open the row to grade inline.
          </CardDescription>
        </div>
        <div className="relative w-56 max-w-full">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter…"
            className="h-9 pl-8 text-sm"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Assignment</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Submitted</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No submissions match &ldquo;{query}&rdquo;.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7">
                        <AvatarFallback className="text-[10px] font-medium">
                          {row.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{row.studentName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{row.assignmentTitle}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10.5px]">
                      {row.courseCode}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(row.status)}>{statusLabel(row.status)}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {relativeTime(row.submittedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline" className="gap-1.5">
                      <Link href="/dashboard/teacher/courses/c-ts-bootcamp/assignments/a-2/submissions">
                        {row.status === "late" ? (
                          <MessageSquareWarning className="size-3.5" aria-hidden="true" />
                        ) : (
                          <Check className="size-3.5" aria-hidden="true" />
                        )}
                        Review
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="border-t bg-muted/30 px-6 py-3">
          <Link
            href="/dashboard/teacher/courses/c-ts-bootcamp/assignments"
            className="text-xs font-medium text-foreground/80 hover:text-foreground"
          >
            View all assignments
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentSubmissionsTable;
