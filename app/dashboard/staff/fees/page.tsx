import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminStatStrip } from "@/components/AdminStatStrip/AdminStatStrip";

import { StaffFeesTable } from "@/components/StaffFeesTable/StaffFeesTable";
import {
  adminStudents,
  adminUsers,
} from "@/lib/staff/staff-data";
import { feeRecords as feeSeed } from "@/lib/staff/staff-data";
import { formatCurrencyPKR } from "@/lib/admin/formatters";

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
          Master ledger across every student on the platform. Open a row to
          view per-student history and update a cycle&apos;s status.
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
            label: "Students",
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
            10 rows per page. Search by name or roll number, filter by fee
            status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaffFeesTable rows={rows} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
