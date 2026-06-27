import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminStatStrip } from "@/components/AdminStatStrip/AdminStatStrip";

import {
  adminStudents,
  adminUsers,
} from "@/lib/staff/staff-data";
import { feeStatusLabel } from "@/lib/admin/admin-data";
import { feeRecords as feeSeed } from "@/lib/staff/staff-data";
import {
  formatCurrencyPKR,
  formatMonthYear,
} from "@/lib/admin/formatters";

const page = () => {
  const rows = adminStudents
    .map((student) => {
      const user = adminUsers.find((u) => u.id === student.userId);
      if (!user) return null;
      const monthly = feeSeed.filter(
        (r) => r.studentUserId === student.userId,
      );
      const totalPaid = monthly
        .filter((r) => r.status === "paid")
        .reduce((acc, r) => acc + r.amount, 0);
      const unpaid = monthly
        .filter((r) => r.status !== "paid")
        .reduce((acc, r) => acc + r.amount, 0);
      return {
        student,
        user,
        monthly,
        totalPaid,
        unpaid,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  const collected = rows.reduce((acc, r) => acc + r.totalPaid, 0);
  const outstanding = rows.reduce((acc, r) => acc + r.unpaid, 0);
  const paidCycles = rows.reduce(
    (acc, r) => acc + r.monthly.filter((m) => m.status === "paid").length,
    0,
  );
  const totalCycles = rows.reduce((acc, r) => acc + r.monthly.length, 0);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Staff · Fees
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Fees overview
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Master ledger across every student on the platform. Open a row to view
          the per-student history and update a cycle&apos;s status.
        </p>
      </header>

      <AdminStatStrip
        items={[
          {
            label: "Collected",
            value: formatCurrencyPKR(collected),
            hint: "Across paid cycles",
            trend: "up",
          },
          {
            label: "Outstanding",
            value: formatCurrencyPKR(outstanding),
            hint: "All open invoices",
            trend: "down",
          },
          {
            label: "Paid cycles",
            value: `${paidCycles}/${totalCycles}`,
            hint: "Across all students",
            trend: "up",
          },
          {
            label: "Roll numbers",
            value: String(rows.length),
            hint: "On the ledger",
          },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Per-student ledger
          </CardTitle>
          <CardDescription className="text-xs">
            Hover a status pill to see the underlying cycles.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Student</TableHead>
                <TableHead className="hidden md:table-cell">Last 3 cycles</TableHead>
                <TableHead className="text-right">Total paid</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="pr-5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ student, user, monthly, totalPaid, unpaid }) => {
                const lastThree = [...monthly]
                  .sort((a, b) =>
                    a.monthLabel < b.monthLabel ? 1 : -1,
                  )
                  .slice(0, 3);
                return (
                  <TableRow key={student.userId}>
                    <TableCell className="pl-5">
                      <Link
                        href={`/dashboard/staff/fees/${student.userId}`}
                        className="font-medium hover:underline"
                      >
                        {user.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {student.rollNumber}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        {lastThree.map((m) => (
                          <Badge
                            key={m.id}
                            variant={
                              m.status === "paid"
                                ? "secondary"
                                : m.status === "due"
                                  ? "outline"
                                  : "destructive"
                            }
                            className="font-mono text-[10.5px]"
                            title={`${formatMonthYear(m.monthLabel)} · ${feeStatusLabel(m.status)}`}
                          >
                            {formatMonthYear(m.monthLabel).split(" ")[0]}
                          </Badge>
                        ))}
                        {lastThree.length === 0 ? (
                          <span className="text-xs text-muted-foreground">
                            —
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums">
                      {formatCurrencyPKR(totalPaid)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs tabular-nums text-muted-foreground">
                      {unpaid > 0 ? formatCurrencyPKR(unpaid) : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          student.feeStatus === "paid"
                            ? "secondary"
                            : student.feeStatus === "due"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {feeStatusLabel(student.feeStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/staff/fees/${student.userId}`}>
                          Manage
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
