import Link from "next/link";

import { Button } from "@/components/ui/button";
import { listUsers } from "@/lib/superadmin/data";
import { SuperadminUsersTable } from "@/components/SuperadminUsersTable/SuperadminUsersTable";

const page = async () => {
  const users = await listUsers();
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
            Super-admin · Users
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
            All accounts on the platform
          </h1>
          <p className="max-w-[60ch] text-sm text-muted-foreground md:text-base">
            Every User in the database, regardless of role, status, or relationship
            to a Student / Teacher / Staff profile.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/superadmin/audit-log">View audit log</Link>
          </Button>
        </div>
      </header>
      <SuperadminUsersTable
        users={users.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          banned: u.banned ?? false,
          createdAt: u.createdAt.toISOString(),
        }))}
      />
    </div>
  );
};

export default page;
