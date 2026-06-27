import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  StaffStudentsTable,
} from "@/components/StaffStudentsTable/StaffStudentsTable";
import {
  adminStudents,
  adminUsers,
} from "@/lib/staff/staff-data";

const page = () => {
  const rows = adminStudents
    .map((student) => {
      const user = adminUsers.find((u) => u.id === student.userId);
      return user ? { student, user } : null;
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Staff · Students
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            All students
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            Search by name, email, roll number, or filter by cohort and fee
            status. Open a profile to manage courses, results, and fees.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/dashboard/staff/students/new">
            <Plus className="mr-1.5 size-3.5" />
            Add student
          </Link>
        </Button>
      </header>

      <StaffStudentsTable rows={rows} />
    </div>
  );
};

export default page;
