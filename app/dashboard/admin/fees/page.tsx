import {
  adminStudents,
  feeRecords,
  findUser,
} from "@/lib/admin/admin-data";
import type {
  AdminStudent,
  AdminUser,
  FeeStatus,
} from "@/lib/admin/admin-data";
import type { AdminKpi } from "@/lib/admin/admin-data";

import { AdminStatStrip } from "@/components/AdminStatStrip/AdminStatStrip";
import { AdminFeesMasterTable } from "@/components/AdminFeesMasterTable/AdminFeesMasterTable";

type Monthly = {
  readonly monthLabel: string;
  readonly status: FeeStatus;
  readonly amount: number;
};

type Row = {
  readonly student: AdminStudent;
  readonly user: AdminUser | null;
  readonly monthly: ReadonlyArray<Monthly>;
  readonly totalPaid: number;
  readonly unpaidAmount: number;
};

const page = () => {
  const rows: ReadonlyArray<Row> = adminStudents.map((student) => {
    const user = findUser(student.userId);
    const monthly: Monthly[] = feeRecords
      .filter((r) => r.studentUserId === student.userId)
      .map((r) => ({
        monthLabel: r.monthLabel,
        status: r.status,
        amount: r.amount,
      }));
    const totalPaid = monthly
      .filter((m) => m.status === "paid")
      .reduce((acc, m) => acc + m.amount, 0);
    const unpaidAmount = monthly
      .filter((m) => m.status !== "paid")
      .reduce((acc, m) => acc + m.amount, 0);
    return { student, user, monthly, totalPaid, unpaidAmount };
  });

  const counts = {
    paid: 0,
    unpaid: 0,
    due: 0,
    totalCollected: 0,
  };
  for (const r of feeRecords) {
    if (r.status === "paid") {
      counts.paid++;
      counts.totalCollected += r.amount;
    } else if (r.status === "unpaid") {
      counts.unpaid++;
    } else {
      counts.due++;
    }
  }

  const items: ReadonlyArray<AdminKpi> = [
    { label: "Students billed", value: String(adminStudents.length) },
    { label: "Monthly records", value: String(feeRecords.length) },
    {
      label: "Collected",
      value: new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
      }).format(counts.totalCollected),
      trend: "up",
    },
    {
      label: "Outstanding",
      value: String(counts.unpaid + counts.due),
      hint: `${counts.unpaid} Unpaid · ${counts.due} Due`,
      trend: "down",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          Fees
        </span>
        <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
          Master fee ledger
        </h1>
        <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
          Every student, every month, every cycle. Filter, drill in to set
          state, or export the lot as CSV at the end-of-month.
        </p>
      </header>

      <AdminStatStrip items={items} />

      <AdminFeesMasterTable rows={rows} />
    </div>
  );
};

export default page;
