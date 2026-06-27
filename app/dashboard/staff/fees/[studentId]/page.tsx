import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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

  const records = [...feeSeed]
    .filter((r) => r.studentUserId === studentId)
    .sort((a, b) => (a.monthLabel < b.monthLabel ? 1 : -1));

  const totalPaid = records
    .filter((r) => r.status === "paid")
    .reduce((acc, r) => acc + r.amount, 0);
  const outstanding = records
    .filter((r) => r.status !== "paid")
    .reduce((acc, r) => acc + r.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 gap-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/dashboard/staff/fees">
              <ArrowLeft className="size-3.5" />
              Back to fees
            </Link>
          </Button>
        </div>
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          {user.name} · Fees ledger
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Update fee status
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          {user.name} · roll {student.rollNumber} · {records.length} cycles on
          file.
        </p>
      </header>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[420px]">
          <TabsTrigger value="status">Update status</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="mt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  Settle, mark due, or escalate
                </span>
                <CardTitle className="font-display text-lg font-medium">
                  Pick the target status
                </CardTitle>
                <CardDescription className="text-xs">
                  Anyone on staff can update. The audit row records the prior
                  status, the new one, and the reason.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid gap-3">
                  {FEE_STATUSES.map((s) => (
                    <div
                      key={s}
                      className="flex items-center justify-between gap-2 rounded-md border bg-card px-3 py-2"
                    >
                      <Badge
                        variant={
                          s === "paid"
                            ? "secondary"
                            : s === "due"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {feeStatusLabel(s)}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/dashboard/staff/fees/${student.userId}?status=${s}`}
                        >
                          Update
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Looking for the bulk-update form? It lives on the master fees
                  page once a cohort-wide sweep is needed.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
                  Snapshot
                </span>
                <CardTitle className="font-display text-lg font-medium">
                  Cycle totals
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total paid</span>
                  <span className="font-mono text-xs">
                    {formatCurrencyPKR(totalPaid)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Outstanding</span>
                  <span className="font-mono text-xs">
                    {formatCurrencyPKR(outstanding)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cycles on file</span>
                  <span className="font-mono text-xs">
                    {records.length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg font-medium">
                Per-cycle history
              </CardTitle>
              <CardDescription className="text-xs">
                Newest cycle first.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y">
                {records.length === 0 ? (
                  <li className="px-6 py-8 text-center text-xs text-muted-foreground">
                    No cycles recorded.
                  </li>
                ) : (
                  records.map((r) => (
                    <li
                      key={r.id}
                      className="flex flex-col gap-2 px-6 py-3 md:flex-row md:items-center md:justify-between"
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
                        {r.paidOn ? (
                          <span className="text-xs text-muted-foreground">
                            paid {relativeTime(r.paidOn)}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            updated {relativeTime(r.updatedAt)}
                          </span>
                        )}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
