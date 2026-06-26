import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Wallet } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  feeRecords,
  findStudent,
  findUser,
} from "@/lib/admin/admin-data";
import type { FeeStatus } from "@/lib/admin/admin-data";
import {
  formatCurrencyPKR,
  formatDateLong,
  formatMonthYear,
  initials,
} from "@/lib/admin/formatters";

import { StudentFeeForm } from "@/components/StudentFeeForm/StudentFeeForm";

function feeVariant(
  status: FeeStatus,
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "paid") return "secondary";
  if (status === "due") return "outline";
  return "destructive";
}

const page = ({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) => {
  return params.then(({ studentId }) => {
    const student = findStudent(studentId);
    const user = findUser(studentId);
    if (!student || !user) notFound();

    const records = feeRecords
      .filter((r) => r.studentUserId === student.userId)
      .slice()
      .reverse();

    const totalPaid = records
      .filter((r) => r.status === "paid")
      .reduce((acc, r) => acc + r.amount, 0);
    const outstanding = records
      .filter((r) => r.status !== "paid")
      .reduce((acc, r) => acc + r.amount, 0);

    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 gap-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/dashboard/admin/fees">
              <ArrowLeft className="size-3.5" />
              Back to fees
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/admin/students/${student.userId}`}>
              Open student profile
            </Link>
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Avatar className="size-14 rounded-md">
                <AvatarFallback className="rounded-md bg-primary text-base text-primary-foreground">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col gap-1">
                <h1 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                  {user.name}
                </h1>
                <span className="text-xs text-muted-foreground">
                  Roll {student.rollNumber} · {student.className} · ID{" "}
                  {student.userId}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Wallet className="size-3" />
                  Last updated {formatDateLong(student.enrollmentDate)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Total paid
              </span>
              <span className="mt-2 block font-display text-2xl font-medium">
                {formatCurrencyPKR(totalPaid)}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Outstanding
              </span>
              <span className="mt-2 block font-display text-2xl font-medium">
                {formatCurrencyPKR(outstanding)}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                Current state
              </span>
              <div className="mt-2">
                <Badge variant={feeVariant(student.feeStatus)}>
                  {student.feeStatus.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                History
              </CardTitle>
              <CardDescription className="text-xs">
                {records.length} record{records.length === 1 ? "" : "s"}.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-5">Month</TableHead>
                    <TableHead className="hidden md:table-cell">Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Paid on</TableHead>
                    <TableHead className="pr-5 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="px-5 py-8 text-center text-xs text-muted-foreground"
                      >
                        No fee history yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="pl-5 text-sm font-medium">
                          {formatMonthYear(r.monthLabel)}
                        </TableCell>
                        <TableCell className="hidden text-sm tabular-nums md:table-cell">
                          {formatCurrencyPKR(r.amount)}
                        </TableCell>
                        <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                          {r.paidOn ? formatDateLong(r.paidOn) : "—"}
                        </TableCell>
                        <TableCell className="pr-5 text-right">
                          <Badge variant={feeVariant(r.status)}>
                            {r.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                Update fee status
              </CardTitle>
              <CardDescription className="text-xs">
                Set or change the current cycle status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudentFeeForm
                userId={student.userId}
                currentStatus={student.feeStatus}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  });
};

export default page;
