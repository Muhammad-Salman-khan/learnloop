import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Wallet } from "lucide-react";

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
  FEE_STATUSES,
  feeStatusLabel,
} from "@/lib/admin/admin-data";
import {
  feeRecords as feeSeed,
  findStudent,
  findUser,
} from "@/lib/staff/staff-data";
import {
  formatCurrencyPKR,
  formatMonthYear,
  relativeTime,
} from "@/lib/admin/formatters";

type Params = Promise<{ studentId: string }>;

const page = async ({ params }: { params: Params }) => {
  const { studentId } = await params;
  const student = findStudent(studentId);
  const user = findUser(studentId);
  if (!student || !user) {
    notFound();
  }

  const rows = [...feeSeed]
    .filter((r) => r.studentUserId === studentId)
    .sort((a, b) => (a.monthLabel < b.monthLabel ? 1 : -1));

  const totalPaid = rows
    .filter((r) => r.status === "paid")
    .reduce((acc, r) => acc + r.amount, 0);
  const outstanding = rows
    .filter((r) => r.status !== "paid")
    .reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            {user.name} · Fees
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            Fee status
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            Snapshot of the StudentProfile&apos;s standing with the finance
            desk. Use{" "}
            <Link
              href={`/dashboard/staff/fees/${studentId}`}
              className="underline"
            >
              the fees ledger
            </Link>{" "}
            to push an invoice or mark a month as paid.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href={`/dashboard/staff/fees/${studentId}`}>
            <Wallet className="mr-1.5 size-3.5" />
            Update fees
            <ArrowRight className="ml-1.5 size-3.5" />
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Current status
            </span>
            <CardTitle className="mt-1 font-display text-lg font-medium">
              {feeStatusLabel(student.feeStatus)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {FEE_STATUSES.map((status) => (
                <Badge
                  key={status}
                  variant={
                    student.feeStatus === status ? "default" : "outline"
                  }
                >
                  {feeStatusLabel(status)}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Total paid
            </span>
            <CardTitle className="mt-1 font-display text-lg font-medium">
              {formatCurrencyPKR(totalPaid)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Across {rows.filter((r) => r.status === "paid").length} paid
            cycles.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Outstanding
            </span>
            <CardTitle className="mt-1 font-display text-lg font-medium">
              {outstanding > 0 ? formatCurrencyPKR(outstanding) : "—"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {outstanding > 0
              ? "Open invoices below."
              : "All cycles are settled. Nicely done."}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg font-medium">
            Monthly history
          </CardTitle>
          <CardDescription className="text-xs">
            Newest cycle first.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {rows.length === 0 ? (
              <li className="px-6 py-8 text-center text-xs text-muted-foreground">
                No fee cycles recorded.
              </li>
            ) : (
              rows.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 px-6 py-3"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      {formatMonthYear(r.monthLabel)}
                    </span>
                    <span className="font-mono text-sm">
                      {formatCurrencyPKR(r.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        r.status === "paid"
                          ? "secondary"
                          : r.status === "due"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {feeStatusLabel(r.status)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {r.paidOn
                        ? `paid ${relativeTime(r.paidOn)}`
                        : `updated ${relativeTime(r.updatedAt)}`}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
