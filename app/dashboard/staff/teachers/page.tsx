import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { StaffTeachersTable } from "@/components/StaffTeachersTable/StaffTeachersTable";
import { adminTeachers, adminUsers } from "@/lib/staff/staff-data";

const page = () => {
  const rows = adminTeachers
    .map((teacher) => {
      const user = adminUsers.find((u) => u.id === teacher.userId);
      return user ? { teacher, user } : null;
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Staff · Teachers
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            All teachers
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            Filter by status, search by subject or employment ID, and jump into a
            profile to manage courses.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/dashboard/staff/teachers/new">
            <Plus className="mr-1.5 size-3.5" />
            Add teacher
          </Link>
        </Button>
      </header>

      <StaffTeachersTable rows={rows} />
    </div>
  );
};

export default page;
